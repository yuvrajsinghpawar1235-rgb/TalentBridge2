package com.talentbridge.controller;

import com.talentbridge.entity.Job;
import com.talentbridge.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }
}