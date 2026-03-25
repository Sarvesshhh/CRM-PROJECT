package com.crm.service;

import com.crm.dto.ActivityRequest;
import com.crm.dto.ActivityResponse;
import com.crm.entity.Activity;
import com.crm.entity.ActivityType;
import com.crm.entity.Customer;
import com.crm.entity.User;
import com.crm.entity.Role;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.ActivityRepository;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    public ActivityResponse createActivity(ActivityRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        }

        Activity activity = Activity.builder()
                .type(ActivityType.valueOf(request.getType().toUpperCase()))
                .notes(request.getNotes())
                .customer(customer)
                .performedBy(user)
                .entityId(request.getEntityId())
                .entityType(request.getEntityType())
                .build();

        return mapToResponse(activityRepository.save(activity));
    }

    public void logSystemActivity(ActivityType type, String notes, Long entityId, String entityType, Long customerId, String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) return;
        
        Customer customer = null;
        if (customerId != null) {
            customer = customerRepository.findById(customerId).orElse(null);
        }

        Activity activity = Activity.builder()
                .type(type)
                .notes(notes)
                .customer(customer)
                .performedBy(user)
                .entityId(entityId)
                .entityType(entityType)
                .build();

        activityRepository.save(activity);
    }

    public List<ActivityResponse> getActivitiesByCustomer(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer not found with id: " + customerId);
        }
        return activityRepository.findByCustomerIdOrderByDateDesc(customerId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ActivityResponse> getRecentActivitiesForUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            return activityRepository.findTop10ByOrderByDateDesc()
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }
        return activityRepository.findTop10ByPerformedByIdOrderByDateDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ActivityResponse> getAllActivitiesForUser(User user) {
        if (user.getRole() == Role.ADMIN) {
            return activityRepository.findAllByOrderByDateDesc()
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }
        return activityRepository.findAllByPerformedByIdOrderByDateDesc(user.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ActivityResponse mapToResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .type(activity.getType().name())
                .notes(activity.getNotes())
                .date(activity.getDate())
                .customerName(activity.getCustomer() != null ? activity.getCustomer().getName() : null)
                .customerId(activity.getCustomer() != null ? activity.getCustomer().getId() : null)
                .performedByName(activity.getPerformedBy() != null ? activity.getPerformedBy().getName() : null)
                .performedById(activity.getPerformedBy() != null ? activity.getPerformedBy().getId() : null)
                .entityId(activity.getEntityId())
                .entityType(activity.getEntityType())
                .build();
    }
}
