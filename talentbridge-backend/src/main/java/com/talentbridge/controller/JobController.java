package com.talentbridge.controller;

import com.talentbridge.entity.Job;
import com.talentbridge.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:3000",
                "https://talentbridge2-git-main-yuvraj-419a.vercel.app"
        },
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // 1. GET ALL JOBS
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        try {
            List<Job> jobs = jobRepository.findAll();
            return new ResponseEntity<>(jobs, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 2. GET JOB BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable("id") Long id) {
        Optional<Job> jobData = jobRepository.findById(id);
        if (jobData.isPresent()) {
            return new ResponseEntity<>(jobData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 3. CREATE / POST NEW JOB
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        try {
            if (job.getStatus() == null || job.getStatus().trim().isEmpty()) {
                job.setStatus("Active");
            }
            if (job.getPostedDate() == null || job.getPostedDate().trim().isEmpty()) {
                job.setPostedDate(LocalDate.now().toString());
            }

            Job savedJob = jobRepository.save(job);
            return new ResponseEntity<>(savedJob, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 4. UPDATE EXISTING JOB
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable("id") Long id, @RequestBody Job job) {
        Optional<Job> jobData = jobRepository.findById(id);

        if (jobData.isPresent()) {
            Job _job = jobData.get();
            if (job.getTitle() != null) _job.setTitle(job.getTitle());
            if (job.getDescription() != null) _job.setDescription(job.getDescription());
            if (job.getLocation() != null) _job.setLocation(job.getLocation());
            if (job.getType() != null) _job.setType(job.getType());
            if (job.getWorkplaceType() != null) _job.setWorkplaceType(job.getWorkplaceType());
            if (job.getExperienceLevel() != null) _job.setExperienceLevel(job.getExperienceLevel());
            if (job.getSalaryMin() != null) _job.setSalaryMin(job.getSalaryMin());
            if (job.getSalaryRange() != null) _job.setSalaryRange(job.getSalaryRange());
            if (job.getCompanyName() != null) _job.setCompanyName(job.getCompanyName());
            if (job.getCompanyDescription() != null) _job.setCompanyDescription(job.getCompanyDescription());
            if (job.getRequirements() != null) _job.setRequirements(job.getRequirements());
            if (job.getSkills() != null) _job.setSkills(job.getSkills());
            if (job.getStatus() != null) _job.setStatus(job.getStatus());

            return new ResponseEntity<>(jobRepository.save(_job), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 5. DELETE JOB
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteJob(@PathVariable("id") Long id) {
        try {
            jobRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}