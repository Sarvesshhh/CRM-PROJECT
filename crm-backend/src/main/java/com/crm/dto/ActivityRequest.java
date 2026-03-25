package com.crm.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActivityRequest {

    @NotBlank(message = "Type is required")
    private String type; // CALL, MEETING, EMAIL

    private String notes;

    private Long customerId;
    
    // For generic system events
    private Long entityId;
    private String entityType;
}
