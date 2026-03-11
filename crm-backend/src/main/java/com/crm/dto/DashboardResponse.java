package com.crm.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardResponse {
    private long totalLeads;
    private long totalCustomers;
    private long pendingTasks;
    private long completedTasks;
    private List<ActivityResponse> recentActivities;
}
