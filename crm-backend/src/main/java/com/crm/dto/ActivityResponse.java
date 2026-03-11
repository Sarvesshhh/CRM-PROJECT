package com.crm.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ActivityResponse {
    private Long id;
    private String type;
    private String notes;
    private LocalDateTime date;
    private String customerName;
    private Long customerId;
}
