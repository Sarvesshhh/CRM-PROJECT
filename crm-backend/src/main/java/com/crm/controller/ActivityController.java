package com.crm.controller;

import com.crm.dto.ActivityRequest;
import com.crm.dto.ActivityResponse;
import com.crm.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.crm.repository.UserRepository;
import com.crm.entity.User;
import com.crm.exception.ResourceNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Activities", description = "Activity tracking APIs")
public class ActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Log a new activity (CALL, MEETING, EMAIL)")
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest request, java.security.Principal principal) {
        return ResponseEntity.ok(activityService.createActivity(request, principal.getName()));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get all activities for a customer")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByCustomer(@PathVariable(name = "customerId") Long customerId) {
        return ResponseEntity.ok(activityService.getActivitiesByCustomer(customerId));
    }

    @GetMapping
    @Operation(summary = "Get all activities")
    public ResponseEntity<List<ActivityResponse>> getAllActivities(java.security.Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(activityService.getAllActivitiesForUser(user));
    }
}
