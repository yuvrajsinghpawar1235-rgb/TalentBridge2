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

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState('CANDIDATE');
  const [isGenericHeader, setIsGenericHeader] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Data, Loading, & Error States
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [savedJobs, setSavedJobs] = useState([]);
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
        setJobs(data);
        setIsLoadingJobs(false);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
        setFetchError(`Could not fetch jobs from backend at ${API_BASE_URL}`);
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

  const handleSelectCompanyJobs = (companyName) => {
    setSearchTerm(companyName);
    setActiveTab('jobs');
  };

  const handleToggleSaveJob = (jobToSave) => {
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

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Navigation Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1
            onClick={() => setActiveTab('landing')}
            style={{ color: 'var(--text-primary)', margin: 0, fontSize: '22px', fontWeight: '800', cursor: 'pointer' }}
          >
            Talent<span style={{ color: 'var(--primary-accent)' }}>Bridge</span>
          </h1>

          <nav style={{ display: 'flex', gap: '15px' }}>
            <span onClick={() => setActiveTab('landing')} style={{ ...navLinkStyle, color: activeTab === 'landing' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              Overview
            </span>
            <span onClick={() => setActiveTab('jobs')} style={{ ...navLinkStyle, color: activeTab === 'jobs' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              Jobs ({jobs.length})
            </span>
            <span onClick={() => setActiveTab('companies')} style={{ ...navLinkStyle, color: activeTab === 'companies' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              Companies
            </span>
            <span onClick={() => setActiveTab('about')} style={{ ...navLinkStyle, color: activeTab === 'about' ? 'var(--primary-accent)' : 'var(--text-secondary)' }}>
              About / Help
            </span>

            {/* Role-Exclusive Navigation Links */}
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
              {/* Candidate Card */}
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

              {/* Recruiter Card */}
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

              {/* Admin Card */}
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
        <CompaniesView jobs={jobs} onSelectCompany={handleSelectCompanyJobs} />
      )}

      {/* CANDIDATE DASHBOARD TAB */}
      {activeTab === 'candidate' && user?.role === 'CANDIDATE' && (
        <CandidateDashboard
          jobs={jobs}
          user={user}
          savedJobs={savedJobs}
          onToggleSaveJob={handleToggleSaveJob}
        />
      )}

      {/* RECRUITER PIPELINE TAB */}
      {activeTab === 'recruiter' && user?.role === 'RECRUITER' && (
        <RecruiterDashboard jobs={jobs} onOpenPostJob={() => setIsPostJobOpen(true)} />
      )}

      {/* ADMIN DASHBOARD TAB */}
      {activeTab === 'admin' && user?.role === 'ADMIN' && (
        <AdminDashboard jobs={jobs} />
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

      {/* JOBS FEED TAB WITH SKELETON LOADERS & ERROR BANNERS */}
      {activeTab === 'jobs' && (
        <main style={{ marginTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>
              {searchTerm ? `Jobs matching "${searchTerm}"` : 'Available Opportunities'} ({filteredJobs.length})
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

          {/* Error Banner */}
          {!isLoadingJobs && fetchError && (
            <ErrorState message={fetchError} onRetry={fetchJobs} />
          )}

          {/* Jobs List */}
          {!isLoadingJobs && !fetchError && filteredJobs.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No matching jobs found.</p>
            </div>
          )}

          {!isLoadingJobs && !fetchError && filteredJobs.length > 0 && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredJobs.map((job) => {
                const isSaved = savedJobs.some((j) => j.id === job.id);
                return (
                  <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div onClick={() => setSelectedJob(job)} style={{ cursor: 'pointer', flex: 1, paddingRight: '15px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                        🏢 {job.companyName || 'TalentBridge Partner'}
                      </span>
                      <h4 style={{ margin: '4px 0 6px 0', color: 'var(--primary-accent)', fontSize: '18px' }}>{job.title}</h4>
                      <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        📍 {job.location} • 💼 {job.type} • 💰 {job.salaryRange}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>{job.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {user?.role === 'CANDIDATE' && (
                        <button
                          className="btn-secondary"
                          onClick={() => handleToggleSaveJob(job)}
                          style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
                        >
                          {isSaved ? '⭐ Saved' : '☆ Save Job'}
                        </button>
                      )}
                      <button className="btn-secondary" onClick={() => setSelectedJob(job)} style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        View Details →
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
        userRole={user?.role}
        onApply={(job) => addToast(`Application submitted for ${job.title}!`, 'success')}
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