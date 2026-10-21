package com.talentbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String location;
    private String type;             // e.g., Full-Time, Part-Time, Contract
    private String workplaceType;    // e.g., Remote, On-site, Hybrid
    private String experienceLevel;  // e.g., Entry, Mid, Senior
    private Double salaryMin;
    private String salaryRange;

    private String companyName;
    private Long companyId;          // Link to company entity/ID

    @Column(length = 1000)
    private String companyDescription;

    @Column(length = 2000)
    private String requirements;

    @Column(length = 1000)
    private String skills;

    private String status;           // Active, Closed
    private String postedDate;
    private LocalDateTime deadline;  // Application deadline (Datetime/Timestamp)
    private String employmentType;   // Employment type alias

    // Default Constructor
    public Job() {}

    // Full Constructor
    public Job(Long id, String title, String description, String location, String type, String workplaceType,
               String experienceLevel, Double salaryMin, String salaryRange, String companyName, Long companyId,
               String companyDescription, String requirements, String skills, String status, String postedDate,
               LocalDateTime deadline, String employmentType) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.type = type;
        this.workplaceType = workplaceType;
        this.experienceLevel = experienceLevel;
        this.salaryMin = salaryMin;
        this.salaryRange = salaryRange;
        this.companyName = companyName;
        this.companyId = companyId;
        this.companyDescription = companyDescription;
        this.requirements = requirements;
        this.skills = skills;
        this.status = status;
        this.postedDate = postedDate;
        this.deadline = deadline;
        this.employmentType = employmentType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getWorkplaceType() { return workplaceType; }
    public void setWorkplaceType(String workplaceType) { this.workplaceType = workplaceType; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public Double getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Double salaryMin) { this.salaryMin = salaryMin; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyDescription() { return companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPostedDate() { return postedDate; }
    public void setPostedDate(String postedDate) { this.postedDate = postedDate; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }
}