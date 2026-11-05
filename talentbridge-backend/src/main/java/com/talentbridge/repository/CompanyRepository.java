package com.talentbridge.repository;

import com.talentbridge.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * Find a company by its name (case-insensitive).
     */
    Optional<Company> findByNameIgnoreCase(String name);

    /**
     * Check if a company with the given name already exists.
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Find all companies registered and managed by a specific recruiter ID.
     */
    List<Company> findByRecruiterId(Long recruiterId);
}