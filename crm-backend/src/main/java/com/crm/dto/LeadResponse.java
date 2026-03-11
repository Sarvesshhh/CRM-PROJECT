package com.crm.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeadResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String source;
    private String status;
    private String assignedToName;
    private Long assignedToId;
}
