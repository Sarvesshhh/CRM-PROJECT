package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private LocalDate dueDate;
    private String status;
    private Long assignedToId;
    private Long customerId;
}
