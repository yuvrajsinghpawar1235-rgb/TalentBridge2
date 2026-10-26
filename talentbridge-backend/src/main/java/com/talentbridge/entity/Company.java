package com.talentbridge.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String industry;
    private String location;
    private String size;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean verified = true;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Default Constructor
    public Company() {}

    // Full Constructor
    public Company(Long id, String name, String industry, String location, String size, Boolean verified, String description) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.location = location;
        this.size = size;
        this.verified = verified;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}