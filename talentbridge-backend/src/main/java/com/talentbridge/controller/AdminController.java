package com.talentbridge.controller;

import com.talentbridge.entity.SystemSetting;
import com.talentbridge.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    // --- 1. Reports & Analytics / KPI Dashboard ---
    @GetMapping("/analytics")
    public Map<String, Object> getPlatformAnalytics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalInterviews", interviewRepository.count());

        // Stage conversion breakdown or status counts can be added here
        return stats;
    }

    // --- 2. Platform Settings ---
    @GetMapping("/settings")
    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    @PostMapping("/settings")
    public SystemSetting saveOrUpdateSetting(@RequestBody SystemSetting setting) {
        Optional<SystemSetting> existing = systemSettingRepository.findBySettingKey(setting.getSettingKey());
        if (existing.isPresent()) {
            SystemSetting s = existing.get();
            s.setSettingValue(setting.getSettingValue());
            s.setDescription(setting.getDescription());
            return systemSettingRepository.save(s);
        }
        return systemSettingRepository.save(setting);
    }
}