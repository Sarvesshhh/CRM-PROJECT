package com.crm.service;

import com.crm.dto.ActivityRequest;
import com.crm.dto.ActivityResponse;
import com.crm.entity.Activity;
import com.crm.entity.ActivityType;
import com.crm.entity.Customer;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.ActivityRepository;
import com.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;

    public ActivityResponse createActivity(ActivityRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        Activity activity = Activity.builder()
                .type(ActivityType.valueOf(request.getType().toUpperCase()))
                .notes(request.getNotes())
                .customer(customer)
                .build();

        return mapToResponse(activityRepository.save(activity));
    }

    public List<ActivityResponse> getActivitiesByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with id: " + customerId);
        }
        return activityRepository.findByCustomerIdOrderByDateDesc(customerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ActivityResponse> getRecentActivities() {
        return activityRepository.findTop10ByOrderByDateDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ActivityResponse mapToResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType().name())
                .notes(activity.getNotes())
                .date(activity.getDate())
                .customerName(activity.getCustomer().getName())
                .customerId(activity.getCustomer().getId())
                .build();
    }
}
