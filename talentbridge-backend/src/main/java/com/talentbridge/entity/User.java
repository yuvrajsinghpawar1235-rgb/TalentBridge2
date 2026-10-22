package com.talentbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // CANDIDATE, RECRUITER, ADMIN

    // --- Extended Profile Fields ---
    private String headline;          // e.g., "Full Stack Developer | Java & React"
    private String location;          // e.g., "Bangalore, India"

    @Column(length = 2000)
    private String summary;           // Professional bio / summary

    @Column(length = 1000)
    private String skills;            // Comma-separated or JSON list of skills

    @Column(length = 2000)
    private String education;         // JSON or formatted string of education history

    @Column(length = 2000)
    private String experience;        // JSON or formatted string of work experience

    private String links;             // Portfolio / GitHub / LinkedIn URLs

    private Integer profileCompletion = 0; // Calculated completion percentage (0-100)

    private LocalDateTime createdAt = LocalDateTime.now();

    // Default Constructor
    public User() {}

    // Full Constructor
    public User(Long id, String name, String email, String password, String role,
                String headline, String location, String summary, String skills,
                String education, String experience, String links, Integer profileCompletion) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.headline = headline;
        this.location = location;
        this.summary = summary;
        this.skills = skills;
        this.education = education;
        this.experience = experience;
        this.links = links;
        this.profileCompletion = profileCompletion != null ? profileCompletion : calculateCompletion();
    }

    // Helper method to automatically calculate profile completion percentage
    @PrePersist
    @PreUpdate
    public void updateCompletionScore() {
        this.profileCompletion = calculateCompletion();
    }

    private int calculateCompletion() {
        int score = 20; // Base score for account creation (name, email, role)
        if (headline != null && !headline.isEmpty()) score += 15;
        if (location != null && !location.isEmpty()) score += 10;
        if (summary != null && !summary.isEmpty()) score += 15;
        if (skills != null && !skills.isEmpty()) score += 15;
        if (education != null && !education.isEmpty()) score += 10;
        if (experience != null && !experience.isEmpty()) score += 10;
        if (links != null && !links.isEmpty()) score += 5;
        return Math.min(score, 100);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getLinks() { return links; }
    public void setLinks(String links) { this.links = links; }

    public Integer getProfileCompletion() { return profileCompletion; }
    public void setProfileCompletion(Integer profileCompletion) { this.profileCompletion = profileCompletion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}