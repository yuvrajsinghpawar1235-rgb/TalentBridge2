package com.talentbridge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String type;
    private String experienceLevel;
    private String salaryRange;
    private String companyName;
    private LocalDateTime createdAt;
}