package com.talentbridge.controller;

import com.talentbridge.entity.Job;
import com.talentbridge.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://talentbriddge2.netlify.app",
        "https://talentbridge-olive.vercel.app",
        "https://talentbridge2-seven.vercel.app"
})
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // Available to ALL accounts (New or Old)
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        if (job.getPostedDate() == null || job.getPostedDate().isEmpty()) {
            job.setPostedDate(LocalDate.now().toString());
        }
        if (job.getStatus() == null || job.getStatus().isEmpty()) {
            job.setStatus("ACTIVE");
        }
        return jobRepository.save(job);
    }
}