package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String email;
    private String phone;
    private String company;
    private String status;

    @NotNull(message = "Assigned user is required")
    private Long assignedToId;
}
