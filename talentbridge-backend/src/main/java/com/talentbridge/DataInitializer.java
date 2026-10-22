package com.talentbridge;

import com.talentbridge.entity.User;
import com.talentbridge.entity.Company;
import com.talentbridge.entity.Job;
import com.talentbridge.entity.Application;
import com.talentbridge.repository.UserRepository;
import com.talentbridge.repository.CompanyRepository;
import com.talentbridge.repository.JobRepository;
import com.talentbridge.repository.ApplicationRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public DataInitializer(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            System.out.println("🌱 Seeding rich enterprise ecosystem data...");

            // 1. Users (Admin, Recruiter, Candidates)
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@talentbridge.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            userRepository.save(admin);

            User recruiter = new User();
            recruiter.setName("Sarah Jenkins");
            recruiter.setEmail("recruiter@talentbridge.com");
            recruiter.setPassword("recruiter123");
            recruiter.setRole("RECRUITER");
            userRepository.save(recruiter);

            User candidate1 = new User();
            candidate1.setName("Alex Turner");
            candidate1.setEmail("candidate@talentbridge.com");
            candidate1.setPassword("candidate123");
            candidate1.setRole("CANDIDATE");
            userRepository.save(candidate1);

            User candidate2 = new User();
            candidate2.setName("Priya Sharma");
            candidate2.setEmail("priya.dev@gmail.com");
            candidate2.setPassword("candidate123");
            candidate2.setRole("CANDIDATE");
            userRepository.save(candidate2);

            // 2. Companies
            Company techNova = new Company();
            techNova.setName("TechNova Solutions");
            techNova.setDescription("Enterprise cloud and software engineering firm specializing in high-scale microservices.");
            techNova.setLocation("San Francisco, CA");
            companyRepository.save(techNova);

            Company aigHospitals = new Company();
            aigHospitals.setName("AIG Hospitals");
            aigHospitals.setDescription("State-of-the-art healthcare and medical research institution driving digital health innovation.");
            aigHospitals.setLocation("New York, NY");
            companyRepository.save(aigHospitals);

            Company apexAI = new Company();
            apexAI.setName("Apex AI Labs");
            apexAI.setDescription("Cutting-edge artificial intelligence research and deep learning product development.");
            apexAI.setLocation("Austin, TX");
            companyRepository.save(apexAI);

            Company cyberShield = new Company();
            cyberShield.setName("CyberShield Security");
            cyberShield.setDescription("Global leader in cloud infrastructure security and enterprise threat intelligence.");
            cyberShield.setLocation("Seattle, WA");
            companyRepository.save(cyberShield);

            // 3. Jobs (Linked to Companies)
            Job job1 = new Job();
            job1.setTitle("Full Stack Java Developer");
            job1.setDescription("Looking for a strong developer proficient in Spring Boot, React, and MySQL to build scalable enterprise modules.");
            job1.setLocation("Remote");
            job1.setType("Full-time");
            job1.setSalaryRange("$120,000 - $145,000");
            job1.setCompanyId(techNova.getId());
            job1.setStatus("ACTIVE");
            jobRepository.save(job1);

            Job job2 = new Job();
            job2.setTitle("React Frontend Architect");
            job2.setDescription("Lead frontend development using modern React, state management, and Tailwind CSS component systems.");
            job2.setLocation("Remote");
            job2.setType("Contract");
            job2.setSalaryRange("$110,000 - $130,000");
            job2.setCompanyId(techNova.getId());
            job2.setStatus("ACTIVE");
            jobRepository.save(job2);

            Job job3 = new Job();
            job3.setTitle("HealthTech Data Analyst");
            job3.setDescription("Seeking an analytical specialist to manage patient data pipelines and clinical reporting metrics.");
            job3.setLocation("New York, NY");
            job3.setType("Full-time");
            job3.setSalaryRange("$95,000 - $110,000");
            job3.setCompanyId(aigHospitals.getId());
            job3.setStatus("ACTIVE");
            jobRepository.save(job3);

            Job job4 = new Job();
            job4.setTitle("AI / Deep Learning Engineer");
            job4.setDescription("Build and optimize PyTorch models for computer vision and real-time image classification pipelines.");
            job4.setLocation("Austin, TX");
            job4.setType("Full-time");
            job4.setSalaryRange("$140,000 - $175,000");
            job4.setCompanyId(apexAI.getId());
            job4.setStatus("ACTIVE");
            jobRepository.save(job4);

            Job job5 = new Job();
            job5.setTitle("Cloud Security Engineer");
            job5.setDescription("Implement robust AWS security protocols, IAM policies, and automated vulnerability scanning tools.");
            job5.setLocation("Seattle, WA");
            job5.setType("Full-time");
            job5.setSalaryRange("$130,000 - $160,000");
            job5.setCompanyId(cyberShield.getId());
            job5.setStatus("ACTIVE");
            jobRepository.save(job5);

            // 4. Applications (Giving recruiters candidate data to manage)
            Application app1 = new Application();
            app1.setJobId(job1.getId());
            app1.setCandidateId(candidate1.getId());
            applicationRepository.save(app1);

            Application app2 = new Application();
            app2.setJobId(job3.getId());
            app2.setCandidateId(candidate2.getId());
            applicationRepository.save(app2);

            Application app3 = new Application();
            app3.setJobId(job4.getId());
            app3.setCandidateId(candidate1.getId());
            applicationRepository.save(app3);

            System.out.println("✅ Seeded successfully!");
        }
    }
}