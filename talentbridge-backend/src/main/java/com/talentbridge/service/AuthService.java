package com.talentbridge.service;

import com.talentbridge.entity.User;
import com.talentbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Default role if none provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CANDIDATE");
        }

        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return user; // Login successful
            }
        }
        throw new RuntimeException("Invalid email or password!");
    }
}