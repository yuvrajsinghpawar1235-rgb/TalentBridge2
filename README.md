# TalentBridge - Professional Job Portal & Recruitment Platform

TalentBridge is an enterprise-grade job portal and recruitment management platform designed for Candidates, Recruiters, and Administrators. Built to mirror real-world SaaS applications, it features a robust role-based architecture, secure session management, and a live relational database backend.

---

##  Problem Statement
Traditional job portals often lack structured, end-to-end recruitment pipelines where recruiters can seamlessly track applicants through various hiring stages (Screening, Interview, Offer, Hired) and candidates can manage their professional journeys in real time. TalentBridge bridges this gap with a unified platform powered by modern web technologies.

---

## Features
- **Candidate Portal:** Job discovery, multi-step application workflow, saved jobs, and application tracking.
- **Recruiter Portal:** Job posting CRUD, applicant tracking pipeline, interview scheduling, and analytics.
- **Admin Portal:** Platform KPI dashboards, user moderation, system settings, and job approvals.
- **Advanced UI/UX:** Responsive SaaS visual design, toast notifications, loading skeletons, and empty states.

---

## User Roles
1. **Candidate:** Explores listings, applies for jobs, tracks application statuses.
2. **Recruiter:** Manages job openings, reviews applicants, schedules interviews.
3. **Admin:** Oversees platform health, manages system users, configures global settings.

---

## Technology Stack
- **Frontend:** React, React Router, Tailwind CSS, Context API, Lucide Icons.
- **Backend:** Spring Boot (Java 21), Spring Data JPA, Hibernate, RESTful APIs.
- **Database:** MySQL Server 8.0 (`talentbridge_db`).
- **Version Control & Hosting:** Git, GitHub, Netlify.

---

## 📁 Architecture / Folder Structure
```text
talentbridge/
├── talentbridge-backend/         # Spring Boot API Server
│   ├── src/main/java/com/talentbridge/
│   │   ├── controller/           # REST Controllers
│   │   ├── model/                # JPA Entities (User, Job, Application, etc.)
│   │   └── repository/           # Spring Data Repositories
│   └── src/main/resources/       # application.properties & migrations
│
└── talentbridge-frontend/        # React Client App
    ├── src/
    │   ├── assets/               # Images and static files
    │   ├── components/           # Reusable UI & Feature components
    │   └── context/              # Global state (Auth, Notifications)