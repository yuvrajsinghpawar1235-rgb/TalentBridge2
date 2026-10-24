import React, { useState, useEffect } from 'react';
import './App.css';
import LoginModal from './components/LoginModal';
import PostJobModal from './components/PostJobModal';
import JobDetailsModal from './components/JobDetailsModal';
import RecruiterDashboard from './components/RecruiterDashboard';
import CompaniesView from './components/CompaniesView';
import CandidateDashboard from './components/CandidateDashboard';
import AdminDashboard from './components/AdminDashboard';
import HeaderProfileMenu from './components/HeaderProfileMenu';
import ConfirmModal from './components/ConfirmModal';
import NotFound from './components/NotFound';
import { SkeletonCard, ErrorState } from './components/SharedUI';
import { useToast } from './context/ToastContext';

// Dynamic API Base URL (defaults to live Render backend in production)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://talentbridge2-5.onrender.com";

// Fallback demo jobs so demo accounts never show empty lists
const MOCK_DEMO_JOBS = [
  {
    id: 1,
    title: 'Full Stack Software Engineer',
    companyName: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Full-Time',
    workplaceType: 'Remote',
    experienceLevel: 'Entry',
    salaryRange: '$110,000 - $125,000',
    description: 'Empowering enterprises through distributed cloud architecture and intelligent AI platforms using React and Spring Boot.'
  },
  {
    id: 2,
    title: 'Senior Frontend Architect',
    companyName: 'TechCorp Solutions',
    location: 'New York, NY',
    type: 'Full-Time',
    workplaceType: 'Hybrid',
    experienceLevel: 'Senior',
    salaryRange: '$140,000 - $165,000',
    description: 'Lead frontend architecture, performance optimization, and scalable design systems.'
  },
  {
    id: 3,
    title: 'Java Backend Developer',
    companyName: 'FinFlow Global',
    location: 'Chicago, IL',
    type: 'Full-Time',
    workplaceType: 'On-site',
    experienceLevel: 'Mid',
    salaryRange: '$120,000 - $135,000',
    description: 'Build high-performance microservices and secure banking transaction pipelines with Spring Boot and MySQL.'
  },
  {
    id: 4,
    title: 'AI / Machine Learning Engineer',
    companyName: 'Neural Systems AI',
    location: 'Austin, TX',
    type: 'Full-Time',
    workplaceType: 'Remote',
    experienceLevel: 'Mid',
    salaryRange: '$130,000 - $150,000',
    description: 'Develop deep learning pipelines, computer vision models, and LLM integration tools using Python and PyTorch.'
  },
  {
    id: 5,
    title: 'DevOps & Cloud Engineer',
    companyName: 'CloudScale Inc.',
    location: 'Seattle, WA',
    type: 'Contract',
    workplaceType: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '$135,000 - $155,000',
    description: 'Manage AWS infrastructure, Kubernetes clusters, and automated CI/CD deployment pipelines.'
  }
];

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState('CANDIDATE');
  const [isGenericHeader, setIsGenericHeader] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Dedicated Company Filter State (Decoupled from generic search)
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState(null);

  // Data, Loading, & Error States
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Use backend jobs if available and non-empty, otherwise fallback to mock demo jobs
  const activeJobs = Array.isArray(jobs) && jobs.length > 0 ? jobs : MOCK_DEMO_JOBS;

  // Persist Saved Jobs in Local Storage
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const stored = localStorage.getItem('savedJobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState('landing');
  const [searchTerm, setSearchTerm] = useState('');

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmColor: 'var(--primary-accent)',
    onConfirm: () => {}
  });

  const { addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync savedJobs with localStorage
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    addToast(`Switched to ${nextTheme === 'light' ? 'Light' : 'Dark'} Mode`, 'info');
  };

  const openAuthForRole = (role, generic = false) => {
    setAuthRole(role);
    setIsGenericHeader(generic);
    setIsAuthOpen(true);
  };

  const fetchJobs = () => {
    setIsLoadingJobs(true);
    setFetchError(null);
    fetch(`${API_BASE_URL}/api/jobs`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        }
        setIsLoadingJobs(false);
      })
      .catch((err) => {
        console.error('Error fetching jobs, using fallback mock data:', err);
        setIsLoadingJobs(false);
      });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchJobs();
  }, []);

  const handleLogout = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Sign Out Confirmation',
      message: 'Are you sure you want to sign out of your session?',
      confirmText: 'Sign Out',
      confirmColor: '#ef4444',
      onConfirm: () => {
        localStorage.removeItem('user');
        setUser(null);
        setActiveTab('landing');
        addToast('Signed out successfully', 'info');
      }
    });
  };

  // Structured Company Selection Handler
  const handleSelectCompanyJobs = (companyName) => {
    setSelectedCompanyFilter(companyName);
    setSearchTerm('');
    setActiveTab('jobs');
  };

  const handleToggleSaveJob = (jobToSave) => {
    if (!user) {
      addToast('Please sign in or register to bookmark job opportunities!', 'info');
      openAuthForRole('CANDIDATE', true);
      return;
    }

    setSavedJobs((prev) => {
      const exists = prev.some((j) => j.id === jobToSave.id);
      if (exists) {
        addToast(`Removed "${jobToSave.title}" from saved jobs`, 'info');
        return prev.filter((j) => j.id !== jobToSave.id);
      } else {
        addToast(`Saved "${jobToSave.title}" to bookmarks!`, 'success');
        return [...prev, jobToSave];
      }
    });
  };

  // Submit Application Handler
  const handleApplyJob = async (job) => {
    if (!user) {
      addToast('Please sign in or register to submit job applications!', 'info');
      openAuthForRole('CANDIDATE', true);
      return;
    }

    const applicationPayload = {
      jobId: job.id,
      candidateId: user.id,
      candidateName: user.name || user.email,
      candidateEmail: user.email,
      stage: 'APPLIED',
      recruiterNotes: 'Application submitted successfully.'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      addToast(`🎉 Application submitted for "${job.title}"!`, 'success');
      if (selectedJob) setSelectedJob(null);
    } catch (err) {
      addToast(`Could not apply: ${err.message}`, 'error');
    }
  };

  // State-Based Filter Logic
  const filteredJobs = activeJobs.filter((job) => {
    const jobCompany = (job.companyName || job.company || '').toLowerCase();

    // 1. If a specific company is selected, strictly match company name
    if (selectedCompanyFilter) {
      return jobCompany.includes(selectedCompanyFilter.toLowerCase());
    }

    // 2. Otherwise apply general search input
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = (job.title || '').toLowerCase();
    const location = (job.location || '').toLowerCase();

    return title.includes(term) || location.includes(term) || jobCompany.includes(term);
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Navigation Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1
            onClick={() => { setActiveTab('landing'); setSelectedCompanyFilter(null); }}
            style={{ color: 'var(--text-primary)', margin: 0, fontSize: '22px', fontWeight: '800', cursor: 'pointer' }}
          >
            Talent<span style={{ color: 'var(--primary-accent)' }}>Bridge</span>
          </h1>

          <nav style={{ display: 'flex', gap: '15px' }}>
            <span onClick={() => setActiveTab('landing')} style={{ ...navLinkStyle, color: activeTab === 'landing' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              Overview
            </span>
            <span onClick={() => setActiveTab('jobs')} style={{ ...navLinkStyle, color: activeTab === 'jobs' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              Jobs ({activeJobs.length})
            </span>
            <span onClick={() => setActiveTab('companies')} style={{ ...navLinkStyle, color: activeTab === 'companies' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              Companies
            </span>
            <span onClick={() => setActiveTab('about')} style={{ ...navLinkStyle, color: activeTab === 'about' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              About / Help
            </span>

            {user?.role === 'CANDIDATE' && (
              <span onClick={() => setActiveTab('candidate')} style={{ ...navLinkStyle, color: activeTab === 'candidate' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
                👤 Candidate Dashboard
              </span>
            )}
            {user?.role === 'RECRUITER' && (
              <span onClick={() => setActiveTab('recruiter')} style={{ ...navLinkStyle, color: activeTab === 'recruiter' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                💼 Recruiter Pipeline
              </span>
            )}
            {user?.role === 'ADMIN' && (
              <span onClick={() => setActiveTab('admin')} style={{ ...navLinkStyle, color: activeTab === 'admin' ? 'var(--accent-purple)' : 'var(--text-secondary)' }}>
                🛡️ Admin Moderation
              </span>
            )}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={toggleTheme} className="btn-secondary" style={{ borderRadius: '20px', padding: '6px 14px' }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          {user?.role === 'RECRUITER' && (
            <button onClick={() => setIsPostJobOpen(true)} className="btn-primary" style={{ backgroundColor: 'var(--accent-green)' }}>
              + Post Job
            </button>
          )}

          {user ? (
            <HeaderProfileMenu
              user={user}
              onLogout={handleLogout}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          ) : (
            <button onClick={() => openAuthForRole('CANDIDATE', true)} className="btn-primary">Sign In / Register</button>
          )}
        </div>
      </header>

      {/* OVERVIEW TAB */}
      {activeTab === 'landing' && (
        <>
          <section style={heroSectionStyle}>
            <div style={pillBadgeStyle}>✦ Next-Gen Talent Platform</div>
            <h2 style={heroTitleStyle}>
              Hire faster. Scale smarter with <span className="gradient-text">dedicated workspaces</span>.
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 28px auto', fontSize: '16px', lineHeight: '1.6' }}>
              TalentBridge provides exclusive sign-in portals for Candidates, Recruiters, and Administrators.
            </p>
          </section>

          <section style={{ marginTop: '10px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>Choose Your Role Workspace</h3>

            <div style={roleGridStyle}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary-accent)' }}>
                <div>
                  <div style={roleBadgeStyle('var(--primary-accent)', 'var(--badge-bg)')}>Job Seeker</div>
                  <h4 style={{ fontSize: '20px', margin: '12px 0 8px 0', color: 'var(--text-primary)' }}>👤 Candidate Sign In</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                    Discover top tech jobs, manage applications, save jobs, and track interview stages.
                  </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => openAuthForRole('CANDIDATE', false)}>
                  Candidate Portal
                </button>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent-green)' }}>
                <div>
                  <div style={roleBadgeStyle('var(--accent-green)', 'rgba(16, 185, 129, 0.15)')}>Employer</div>
                  <h4 style={{ fontSize: '20px', margin: '12px 0 8px 0', color: 'var(--text-primary)' }}>💼 Recruiter Workspace</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                    Access recruiter workspace, review Kanban candidate pipelines, post jobs, and manage interviews.
                  </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--accent-green)' }} onClick={() => openAuthForRole('RECRUITER', false)}>
                  Recruiter Portal
                </button>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent-purple)' }}>
                <div>
                  <div style={roleBadgeStyle('var(--accent-purple)', 'rgba(168, 85, 247, 0.15)')}>Moderator</div>
                  <h4 style={{ fontSize: '20px', margin: '12px 0 8px 0', color: 'var(--text-primary)' }}>🛡️ Admin Moderation</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                    Access platform administration, moderate active job listings, oversee users, and manage system operations.
                  </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--accent-purple)' }} onClick={() => openAuthForRole('ADMIN', false)}>
                  Admin Portal
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* COMPANIES TAB */}
      {activeTab === 'companies' && (
        <CompaniesView jobs={activeJobs} onSelectCompany={handleSelectCompanyJobs} />
      )}

      {/* CANDIDATE DASHBOARD TAB */}
      {activeTab === 'candidate' && user?.role === 'CANDIDATE' && (
        <CandidateDashboard
          jobs={activeJobs}
          user={user}
          savedJobs={savedJobs}
          onToggleSaveJob={handleToggleSaveJob}
        />
      )}

      {/* RECRUITER PIPELINE TAB */}
      {activeTab === 'recruiter' && user?.role === 'RECRUITER' && (
        <RecruiterDashboard jobs={activeJobs} onOpenPostJob={() => setIsPostJobOpen(true)} />
      )}

      {/* ADMIN DASHBOARD TAB */}
      {activeTab === 'admin' && user?.role === 'ADMIN' && (
        <AdminDashboard jobs={activeJobs} />
      )}

      {/* ABOUT / HELP PAGE */}
      {activeTab === 'about' && (
        <main style={{ marginTop: '30px' }}>
          <h2>About TalentBridge & Help Center</h2>
          <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            <div className="card">
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-accent)' }}>🎯 Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                TalentBridge solves fragmented job discovery by providing candidates with transparent stage tracking and equipping recruiters with visual applicant pipelines.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* JOBS FEED TAB WITH UNIVERSAL SAVE & APPLY */}
      {activeTab === 'jobs' && (
        <main style={{ marginTop: '30px' }}>
          {/* Active Company Filter Notification Banner */}
          {selectedCompanyFilter && (
            <div className="card" style={{ padding: '12px 20px', marginBottom: '20px', backgroundColor: 'var(--badge-bg)', border: '1px solid var(--primary-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--primary-accent)', fontWeight: 'bold' }}>
                🏢 Showing jobs for: "{selectedCompanyFilter}"
              </span>
              <button
                className="btn-secondary"
                onClick={() => setSelectedCompanyFilter(null)}
                style={{ fontSize: '12px', padding: '4px 10px' }}
              >
                Clear Company Filter ✕
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>
              {selectedCompanyFilter
                ? `Jobs at ${selectedCompanyFilter} (${filteredJobs.length})`
                : searchTerm
                ? `Jobs matching "${searchTerm}" (${filteredJobs.length})`
                : `Available Opportunities (${filteredJobs.length})`}
            </h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {searchTerm && (
                <button className="btn-secondary" onClick={() => setSearchTerm('')} style={{ fontSize: '12px' }}>
                  Clear Filter ✕
                </button>
              )}
              <input
                type="text"
                placeholder="Filter by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoadingJobs && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Jobs List */}
          {!isLoadingJobs && filteredJobs.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No matching jobs found.</p>
              {selectedCompanyFilter && (
                <button className="btn-primary" onClick={() => setSelectedCompanyFilter(null)} style={{ marginTop: '15px', fontSize: '13px' }}>
                  View All Companies & Jobs
                </button>
              )}
            </div>
          )}

          {!isLoadingJobs && filteredJobs.length > 0 && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredJobs.map((job) => {
                const isSaved = savedJobs.some((j) => j.id === job.id);
                return (
                  <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div onClick={() => setSelectedJob(job)} style={{ cursor: 'pointer', flex: 1, paddingRight: '15px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                        🏢 {job.companyName || job.company || 'TalentBridge Partner'}
                      </span>
                      <h4 style={{ margin: '4px 0 6px 0', color: 'var(--primary-accent)', fontSize: '18px' }}>{job.title}</h4>
                      <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        📍 {job.location || 'Remote'} • 💼 {job.type || 'Full-Time'} • 💰 {job.salaryRange || '$100k - $130k'}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>{job.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => handleToggleSaveJob(job)}
                        style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap', color: isSaved ? '#f59e0b' : 'inherit' }}
                      >
                        {isSaved ? '⭐ Saved' : '☆ Save Job'}
                      </button>

                      <button className="btn-primary" onClick={() => setSelectedJob(job)} style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        View Details & Apply →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* 404 Standalone Catch-All Page */}
      {!['landing', 'jobs', 'companies', 'about', 'candidate', 'recruiter', 'admin'].includes(activeTab) && (
        <NotFound onGoHome={() => setActiveTab('landing')} />
      )}

      {/* Modals & Dialogs */}
      <LoginModal
        isOpen={isAuthOpen}
        initialRole={authRole}
        isGenericHeader={isGenericHeader}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          addToast(`Welcome back, ${loggedInUser.name}!`, 'success');
          if (loggedInUser.role === 'CANDIDATE') setActiveTab('candidate');
          if (loggedInUser.role === 'RECRUITER') setActiveTab('recruiter');
          if (loggedInUser.role === 'ADMIN') setActiveTab('admin');
        }}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onJobPosted={() => {
          fetchJobs();
          addToast('New job opportunity created successfully!', 'success');
        }}
      />

      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        userRole={user?.role || 'CANDIDATE'}
        isSaved={selectedJob ? savedJobs.some((j) => j.id === selectedJob.id) : false}
        onToggleSave={handleToggleSaveJob}
        onApply={handleApplyJob}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmColor={confirmConfig.confirmColor}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
      />
    </div>
  );
}

// Helpers & Styles
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-color)' };
const navLinkStyle = { fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s ease' };
const heroSectionStyle = { textAlign: 'center', padding: '40px 0 20px 0' };
const pillBadgeStyle = { display: 'inline-block', backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '20px' };
const heroTitleStyle = { fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '800', letterSpacing: '-0.02em', margin: '0 0 16px 0', lineHeight: '1.2' };
const roleGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' };
const roleBadgeStyle = (color, bg) => ({ display: 'inline-block', color: color, backgroundColor: bg, fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' });
const searchInputStyle = { padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '280px' };