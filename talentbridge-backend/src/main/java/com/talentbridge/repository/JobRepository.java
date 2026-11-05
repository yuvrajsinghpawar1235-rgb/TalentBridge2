package com.talentbridge.repository;

import com.talentbridge.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("SELECT j FROM Job j WHERE " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:type IS NULL OR j.type = :type)")
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("type") String type,
            Pageable pageable
    );

    /**
     * Find all job listings posted by a specific recruiter ID across their companies.
     */
    List<Job> findByRecruiterId(Long recruiterId);

    /**
     * Find all job listings associated with a specific company ID.
     */
    List<Job> findByCompanyId(Long companyId);
}