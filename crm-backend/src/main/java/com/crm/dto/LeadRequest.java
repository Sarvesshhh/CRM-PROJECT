package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeadRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String email;
    private String phone;
    private String source;
    private String status;

    @NotNull(message = "Assigned user is required")
    private Long assignedToId;
}
