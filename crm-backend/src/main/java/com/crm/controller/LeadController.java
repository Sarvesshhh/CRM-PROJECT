package com.crm.controller;

import com.crm.dto.CustomerResponse;
import com.crm.dto.LeadRequest;
import com.crm.dto.LeadResponse;
import com.crm.service.LeadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Leads", description = "Lead management APIs")
public class LeadController {

    private final LeadService leadService;

    @PostMapping
    @Operation(summary = "Create a new lead")
    public ResponseEntity<LeadResponse> createLead(@Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.createLead(request));
    }

    @GetMapping
    @Operation(summary = "List all leads, optionally filter by status")
    public ResponseEntity<List<LeadResponse>> getAllLeads(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(leadService.getAllLeads(status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lead by ID")
    public ResponseEntity<LeadResponse> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a lead")
    public ResponseEntity<LeadResponse> updateLead(@PathVariable Long id,
                                                   @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.updateLead(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lead")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/convert")
    @Operation(summary = "Convert a lead to a customer")
    public ResponseEntity<CustomerResponse> convertLead(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.convertLeadToCustomer(id));
    }
}
