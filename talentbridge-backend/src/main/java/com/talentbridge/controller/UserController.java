package com.talentbridge.controller;

import com.talentbridge.entity.User;
import com.talentbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Get single user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        Map<String, String> error = new HashMap<>();
        error.put("error", "User not found with ID: " + id);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // PUT Endpoint: Update candidate profile (Handles CandidateDashboard updates)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updatedDetails) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (!optionalUser.isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User existingUser = optionalUser.get();

        // Selective Field Updates
        if (updatedDetails.getName() != null) existingUser.setName(updatedDetails.getName());
        if (updatedDetails.getHeadline() != null) existingUser.setHeadline(updatedDetails.getHeadline());
        if (updatedDetails.getLocation() != null) existingUser.setLocation(updatedDetails.getLocation());
        if (updatedDetails.getSummary() != null) existingUser.setSummary(updatedDetails.getSummary());
        if (updatedDetails.getSkills() != null) existingUser.setSkills(updatedDetails.getSkills());
        if (updatedDetails.getEducation() != null) existingUser.setEducation(updatedDetails.getEducation());
        if (updatedDetails.getExperience() != null) existingUser.setExperience(updatedDetails.getExperience());
        if (updatedDetails.getLinks() != null) existingUser.setLinks(updatedDetails.getLinks());
        if (updatedDetails.getUniversity() != null) existingUser.setUniversity(updatedDetails.getUniversity());
        if (updatedDetails.getIsFresher() != null) existingUser.setIsFresher(updatedDetails.getIsFresher());

        // Note: JPA @PreUpdate hook automatically re-calculates profileCompletion score before saving
        User savedUser = userRepository.save(existingUser);

        return ResponseEntity.ok(savedUser);
    }

    // Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "User not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        userRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}