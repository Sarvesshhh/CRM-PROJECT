package com.crm.service;

import com.crm.dto.ActivityResponse;
import com.crm.dto.DashboardResponse;
import com.crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;
    private final CustomerRepository customerRepository;
    private final TaskRepository taskRepository;
    private final ActivityService activityService;

    public DashboardResponse getDashboardStats() {
        long totalLeads = leadRepository.count();
        long totalCustomers = customerRepository.count();
        long pendingTasks = taskRepository.countByStatus("PENDING");
        long completedTasks = taskRepository.countByStatus("COMPLETED");
        List<ActivityResponse> recentActivities = activityService.getRecentActivities();

        return DashboardResponse.builder()
                .totalLeads(totalLeads)
                .totalCustomers(totalCustomers)
                .pendingTasks(pendingTasks)
                .completedTasks(completedTasks)
                .recentActivities(recentActivities)
                .build();
    }
}
