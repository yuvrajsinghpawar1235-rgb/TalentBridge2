package com.talentbridge.controller;

import com.talentbridge.entity.Application;
import com.talentbridge.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:3000",
        "https://talentbriddge2.netlify.app",
        "https://talentbridge-olive.vercel.app",
        "https://talentbridge2-seven.vercel.app"
})
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getApplicationsByJob(@PathVariable Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @GetMapping("/candidate/{candidateId}")
    public List<Application> getApplicationsByCandidate(@PathVariable Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId);
    }

    @PostMapping
    public Application createApplication(@RequestBody Application application) {
        return applicationRepository.save(application);
    }

    @PutMapping("/{id}/stage")
    public ResponseEntity<Application> updateApplicationStage(@PathVariable Long id, @RequestBody Application updatedDetails) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (optionalApp.isPresent()) {
            Application app = optionalApp.get();
            app.setStage(updatedDetails.getStage());
            if (updatedDetails.getRecruiterNotes() != null) {
                app.setRecruiterNotes(updatedDetails.getRecruiterNotes());
            }
            Application saved = applicationRepository.save(app);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (applicationRepository.existsById(id)) {
            applicationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}