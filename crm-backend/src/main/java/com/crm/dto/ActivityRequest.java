package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActivityRequest {

    @NotBlank(message = "Type is required")
    private String type; // CALL, MEETING, EMAIL

    private String notes;

    @NotNull(message = "Customer ID is required")
    private Long customerId;
}
