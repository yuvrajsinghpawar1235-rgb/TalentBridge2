package com.talentbridge.repository;

import com.talentbridge.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    // Standard CRUD operations are automatically provided by JpaRepository
}