package com.talentbridge.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobRequestDTO {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Job type is required")
    private String type; // FULL_TIME, PART_TIME, REMOTE, INTERNSHIP

    @NotBlank(message = "Experience level is required")
    private String experienceLevel;

    private String salaryRange;

    @Future(message = "Deadline must be in the future")
    private LocalDateTime deadline;

    @NotNull(message = "Company ID is required")
    private Long companyId;
}