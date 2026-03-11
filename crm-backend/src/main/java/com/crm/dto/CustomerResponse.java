package com.crm.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String status;
    private String assignedToName;
    private Long assignedToId;
    private LocalDateTime createdAt;
}
