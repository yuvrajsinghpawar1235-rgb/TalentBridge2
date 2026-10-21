package com.talentbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;
    private Long jobId;
    private Long candidateId;

    private LocalDateTime interviewDate;
    private String mode;         // e.g., Video Call, Phone, In-Person
    private String interviewer;  // e.g., "Sarah Jenkins (Engineering Manager)"

    @Column(length = 2000)
    private String notes;

    private String status = "SCHEDULED"; // SCHEDULED, COMPLETED, CANCELLED

    public Interview() {}

    public Interview(Long id, Long applicationId, Long jobId, Long candidateId, LocalDateTime interviewDate, String mode, String interviewer, String notes, String status) {
        this.id = id;
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.candidateId = candidateId;
        this.interviewDate = interviewDate;
        this.mode = mode;
        this.interviewer = interviewer;
        this.notes = notes;
        this.status = status != null ? status : "SCHEDULED";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public LocalDateTime getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDateTime interviewDate) { this.interviewDate = interviewDate; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getInterviewer() { return interviewer; }
    public void setInterviewer(String interviewer) { this.interviewer = interviewer; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}