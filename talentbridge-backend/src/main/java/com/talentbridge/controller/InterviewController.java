package com.talentbridge.controller;

import com.talentbridge.entity.Interview;
import com.talentbridge.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class InterviewController {

    @Autowired
    private InterviewRepository interviewRepository;

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    @GetMapping("/job/{jobId}")
    public List<Interview> getInterviewsByJob(@PathVariable Long jobId) {
        return interviewRepository.findByJobId(jobId);
    }

    @PostMapping
    public Interview scheduleInterview(@RequestBody Interview interview) {
        return interviewRepository.save(interview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interview> updateInterview(@PathVariable Long id, @RequestBody Interview updatedDetails) {
        Optional<Interview> optionalInterview = interviewRepository.findById(id);
        if (optionalInterview.isPresent()) {
            Interview interview = optionalInterview.get();
            interview.setInterviewDate(updatedDetails.getInterviewDate());
            interview.setMode(updatedDetails.getMode());
            interview.setInterviewer(updatedDetails.getInterviewer());
            interview.setNotes(updatedDetails.getNotes());
            interview.setStatus(updatedDetails.getStatus());
            Interview saved = interviewRepository.save(interview);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        if (interviewRepository.existsById(id)) {
            interviewRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}