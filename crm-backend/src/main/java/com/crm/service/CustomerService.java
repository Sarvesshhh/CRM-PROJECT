package com.crm.service;

import com.crm.dto.CustomerRequest;
import com.crm.dto.CustomerResponse;
import com.crm.entity.Customer;
import com.crm.entity.User;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public CustomerResponse createCustomer(CustomerRequest request) {
        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .company(request.getCompany())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .build();

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            customer.setAssignedTo(user);
        }

        return mapToResponse(customerRepository.save(customer));
    }

    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setCompany(request.getCompany());
        if (request.getStatus() != null) {
            customer.setStatus(request.getStatus());
        }

        if (request.getAssignedToId() != null) {
            User user = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            customer.setAssignedTo(user);
        }

        return mapToResponse(customerRepository.save(customer));
    }

    public void deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    public CustomerResponse getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapToResponse(customer);
    }

    public Page<CustomerResponse> getAllCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return customerRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<CustomerResponse> searchCustomers(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return customerRepository.searchByName(name, pageable).map(this::mapToResponse);
    }

    private CustomerResponse mapToResponse(Customer customer) {
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
}
