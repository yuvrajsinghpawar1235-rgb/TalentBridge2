package com.talentbridge.service;

import com.talentbridge.entity.User;
import com.talentbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User newUser) throws Exception {
        // Validate if email already exists in MySQL
        if (userRepository.existsByEmail(newUser.getEmail())) {
            throw new RuntimeException("Email is already registered. Please log in.");
        }

        // Set default role if null/empty
        if (newUser.getRole() == null || newUser.getRole().trim().isEmpty()) {
            newUser.setRole("CANDIDATE");
        }

        // Save new user entity to MySQL (triggers @PrePersist for profile completion)
        return userRepository.save(newUser);
    }

    public User login(String email, String password) throws Exception {
        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            throw new RuntimeException("Email and password are required.");
        }

        // Find user by email in MySQL database
        Optional<User> optionalUser = userRepository.findByEmail(email.trim().toLowerCase());

        if (!optionalUser.isPresent()) {
            throw new RuntimeException("Account not found with this email. Please sign up.");
        }

        User user = optionalUser.get();

        // Validate password
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password. Please try again.");
        }

        return user;
    }
}