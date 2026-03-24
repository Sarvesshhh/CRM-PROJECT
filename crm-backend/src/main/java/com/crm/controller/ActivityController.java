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

import java.util.List;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Activities", description = "Activity tracking APIs")
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    @Operation(summary = "Log a new activity (CALL, MEETING, EMAIL)")
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.createActivity(request));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get all activities for a customer")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByCustomer(@PathVariable(name = "customerId") Long customerId) {
        return ResponseEntity.ok(activityService.getActivitiesByCustomer(customerId));
    }

    @GetMapping
    @Operation(summary = "Get all activities")
    public ResponseEntity<List<ActivityResponse>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }
}
