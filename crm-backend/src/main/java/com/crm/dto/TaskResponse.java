package com.crm.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private String status;
    private String assignedToName;
    private Long assignedToId;
    private String customerName;
    private Long customerId;
}
