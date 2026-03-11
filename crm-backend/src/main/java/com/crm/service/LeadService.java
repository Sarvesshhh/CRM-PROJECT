package com.crm.service;

import com.crm.dto.CustomerResponse;
import com.crm.dto.LeadRequest;
import com.crm.dto.LeadResponse;
import com.crm.entity.Customer;
import com.crm.entity.Lead;
import com.crm.entity.User;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.CustomerRepository;
import com.crm.repository.LeadRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public LeadResponse createLead(LeadRequest request) {
        Lead lead = Lead.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .source(request.getSource())
                .status(request.getStatus() != null ? request.getStatus() : "NEW")
                .build();

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            lead.setAssignedTo(user);
        }

        return mapToResponse(leadRepository.save(lead));
    }

    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        lead.setName(request.getName());
        lead.setEmail(request.getEmail());
        lead.setPhone(request.getPhone());
        lead.setSource(request.getSource());
        if (request.getStatus() != null) {
            lead.setStatus(request.getStatus());
        }

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            lead.setAssignedTo(user);
        }

        return mapToResponse(leadRepository.save(lead));
    }

    public void deleteLead(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lead not found with id: " + id);
        }
        leadRepository.deleteById(id);
    }

    public List<LeadResponse> getAllLeads(String status) {
        List<Lead> leads;
        if (status != null && !status.isEmpty()) {
            leads = leadRepository.findByStatus(status);
        } else {
            leads = leadRepository.findAll();
        }
        return leads.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public LeadResponse getLeadById(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return mapToResponse(lead);
    }

    public CustomerResponse convertLeadToCustomer(Long leadId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + leadId));

        Customer customer = Customer.builder()
                .name(lead.getName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .status("ACTIVE")
                .assignedTo(lead.getAssignedTo())
                .build();

        customer = customerRepository.save(customer);
        leadRepository.delete(lead);

        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .company(customer.getCompany())
                .status(customer.getStatus())
                .assignedToName(customer.getAssignedTo() != null ? customer.getAssignedTo().getName() : null)
                .assignedToId(customer.getAssignedTo() != null ? customer.getAssignedTo().getId() : null)
                .createdAt(customer.getCreatedAt())
                .build();
    }

    private LeadResponse mapToResponse(Lead lead) {
        return LeadResponse.builder()
                .id(lead.getId())
                .name(lead.getName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .source(lead.getSource())
                .status(lead.getStatus())
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getName() : null)
                .assignedToId(lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null)
                .build();
    }
}
