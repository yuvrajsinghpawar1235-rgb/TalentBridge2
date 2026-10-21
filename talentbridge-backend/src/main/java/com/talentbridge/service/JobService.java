package com.talentbridge.service;

import com.talentbridge.entity.Job;
import com.talentbridge.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public Page<Job> searchJobs(String keyword, String location, String type, Pageable pageable) {
        return jobRepository.searchJobs(keyword, location, type, pageable);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job jobDetails) {
        Job job = getJobById(id);
        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setLocation(jobDetails.getLocation());
        job.setType(jobDetails.getType());
        job.setExperienceLevel(jobDetails.getExperienceLevel());
        job.setSalaryRange(jobDetails.getSalaryRange());
        job.setDeadline(jobDetails.getDeadline());
        job.setStatus(jobDetails.getStatus());
        job.setCompanyId(jobDetails.getCompanyId());
        job.setEmploymentType(jobDetails.getEmploymentType());
        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}