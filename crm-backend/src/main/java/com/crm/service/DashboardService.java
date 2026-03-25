package com.crm.service;

import com.crm.dto.ActivityResponse;
import com.crm.dto.DashboardResponse;
import com.crm.entity.Role;
import com.crm.entity.User;
import com.crm.exception.ResourceNotFoundException;
import com.crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ActivityService activityService;

    public DashboardResponse getDashboardStats(String currentUserEmail) {
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalLeads;
        long totalCustomers;
        long pendingTasks;
        long completedTasks;

        if (currentUser.getRole() == Role.ADMIN) {
            totalLeads = leadRepository.count();
            totalCustomers = customerRepository.count();
            pendingTasks = taskRepository.countByStatus("PENDING");
            completedTasks = taskRepository.countByStatus("COMPLETED");
        } else {
            Long userId = currentUser.getId();
            totalLeads = leadRepository.findByAssignedToId(userId).size();
            totalCustomers = customerRepository.countByAssignedToId(userId);
            pendingTasks = taskRepository.countByStatusAndAssignedToId("PENDING", userId);
            completedTasks = taskRepository.countByStatusAndAssignedToId("COMPLETED", userId);
        }

        List<ActivityResponse> recentActivities = activityService.getRecentActivitiesForUser(currentUser);

        return DashboardResponse.builder()
                .totalLeads(totalLeads)
                .totalCustomers(totalCustomers)
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .recentActivities(recentActivities)
                .build();
    }
}
