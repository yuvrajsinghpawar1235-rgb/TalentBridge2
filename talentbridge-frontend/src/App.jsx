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
import { SkeletonCard } from './components/SharedUI';
import { useToast } from './context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://talentbridge2-5.onrender.com";

const MOCK_DEMO_JOBS = [
  {
    id: 1,
    title: 'Full Stack Java Developer',
    companyName: 'TechCorp Solutions',
    location: 'Remote',
    type: 'Full-time',
    workplaceType: 'Remote',
    experienceLevel: 'Mid',
    salaryRange: '$120,000 - $145,000',
    description: 'Looking for a strong developer proficient in Spring Boot, React, and MySQL to build scalable enterprise modules.'
  },
  {
    id: 2,
    title: 'React Frontend Architect',
    companyName: 'TechCorp Solutions',
    location: 'Remote',
    type: 'Contract',
    workplaceType: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '$110,000 - $130,000',
    description: 'Lead frontend development using modern React, state management, and Tailwind CSS component systems.'
  },
  {
    id: 3,
    title: 'Backend Engineer',
    companyName: 'FinFlow Global',
    location: 'New York, NY',
    type: 'Full-time',
    workplaceType: 'Hybrid',
    experienceLevel: 'Mid',
    salaryRange: '$130,000 - $150,000',
    description: 'Build robust financial microservices using Spring Boot and high-throughput MySQL pipelines.'
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

  // Filter & Search State
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [searchTerm, setSearchTerm] = useState('');

  // Data Loading States
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Persist Custom Recruiter Postings Locally to prevent 0-job wipeouts
  const [customJobs, setCustomJobs] = useState(() => {
    try {
      const stored = localStorage.getItem('customPostedJobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('customPostedJobs', JSON.stringify(customJobs));
  }, [customJobs]);

  // Combined Active Jobs List
  const activeJobs = [
    ...customJobs,
    ...(Array.isArray(jobs) && jobs.length > 0 ? jobs : MOCK_DEMO_JOBS)
  ];

  // Saved Bookmarks Persistence
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const stored = localStorage.getItem('savedJobs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

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
        console.warn('Backend fetch fallback active:', err);
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
      message: 'Are you sure you want to sign out?',
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
    setSelectedCompanyFilter(companyName);
    setSearchTerm('');
    setActiveTab('jobs');
  };

  const handleToggleSaveJob = (jobToSave) => {
    if (!user) {
      addToast('Please sign in to bookmark job opportunities!', 'info');
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

  // Bulletproof Multi-Field Job Filter
  const filteredJobs = activeJobs.filter((job) => {
    const jobCompany = (job.companyName || job.company || job.company_name || '').toLowerCase();

    if (selectedCompanyFilter) {
      return jobCompany.includes(selectedCompanyFilter.toLowerCase());
    }

    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const title = (job.title || '').toLowerCase();
    const location = (job.location || '').toLowerCase();

    return title.includes(term) || location.includes(term) || jobCompany.includes(term);
  });

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Bar */}
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
                🛡️ Master Admin Portal
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
              Exclusive portals for Job Seekers, Employers, and Platform Administration.
            </p>
          </section>

          <section style={{ marginTop: '10px' }}>
            <div style={roleGridStyle}>
              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary-accent)' }}>
                <div>
                  <div style={roleBadgeStyle('var(--primary-accent)', 'var(--badge-bg)')}>Job Seeker</div>
                  <h4 style={{ fontSize: '20px', margin: '12px 0 8px 0', color: 'var(--text-primary)' }}>👤 Candidate Portal</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                    Discover tech positions, manage saved bookmarks, and track application stages.
                  </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => openAuthForRole('CANDIDATE', false)}>
                  Candidate Sign In
                </button>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent-green)' }}>
                <div>
                  <div style={roleBadgeStyle('var(--accent-green)', 'rgba(16, 185, 129, 0.15)')}>Employer</div>
                  <h4 style={{ fontSize: '20px', margin: '12px 0 8px 0', color: 'var(--text-primary)' }}>💼 Recruiter Workspace</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                    Access recruiter dashboard, publish new jobs, and manage candidate pipelines.
                  </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--accent-green)' }} onClick={() => openAuthForRole('RECRUITER', false)}>
                  Recruiter Sign In
                </button>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--accent-purple)' }}>
                <div>
                  <div style={roleBadgeStyle('var(--accent-purple)', 'rgba(168, 85, 247, 0.15)')}>Master Admin</div>
                  <h4 style={{ fontSize: '20px', margin: '12px 0 8px 0', color: 'var(--text-primary)' }}>🛡️ System Portal</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                    Single master administrator portal for managing system operations and platform moderation.
                  </p>
                </div>
                <button className="btn-primary" style={{ width: '100%', marginTop: '20px', backgroundColor: 'var(--accent-purple)' }} onClick={() => openAuthForRole('ADMIN', false)}>
                  Admin Sign In
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
        <CandidateDashboard jobs={activeJobs} user={user} savedJobs={savedJobs} onToggleSaveJob={handleToggleSaveJob} />
      )}

      {/* RECRUITER WORKSPACE TAB */}
      {activeTab === 'recruiter' && user?.role === 'RECRUITER' && (
        <RecruiterDashboard
          jobs={activeJobs}
          user={user}
          onOpenPostJob={() => setIsPostJobOpen(true)}
          onUpdateRecruiterCompany={(newCompName) => {
            const updatedUser = { ...user, companyName: newCompName, company: newCompName };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }}
        />
      )}

      {/* SINGLE ADMIN PORTAL */}
      {activeTab === 'admin' && user?.role === 'ADMIN' && (
        <AdminDashboard jobs={activeJobs} />
      )}

      {/* ABOUT PAGE */}
      {activeTab === 'about' && (
        <main style={{ marginTop: '30px' }}>
          <h2>About TalentBridge & Help Center</h2>
          <div className="card" style={{ marginTop: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-accent)' }}>🎯 Our Mission</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              TalentBridge streamlines technical recruiting with multi-tenant recruiter isolation and transparent applicant stage tracking.
            </p>
          </div>
        </main>
      )}

      {/* JOBS TAB */}
      {activeTab === 'jobs' && (
        <main style={{ marginTop: '30px' }}>
          {selectedCompanyFilter && (
            <div className="card" style={{ padding: '12px 20px', marginBottom: '20px', backgroundColor: 'var(--badge-bg)', border: '1px solid var(--primary-accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--primary-accent)', fontWeight: 'bold' }}>
                🏢 Showing jobs for: "{selectedCompanyFilter}"
              </span>
              <button className="btn-secondary" onClick={() => setSelectedCompanyFilter(null)} style={{ fontSize: '12px', padding: '4px 10px' }}>
                Clear Company Filter ✕
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>
              {selectedCompanyFilter
                ? `Jobs at ${selectedCompanyFilter} (${filteredJobs.length})`
                : `Available Opportunities (${filteredJobs.length})`}
            </h3>
            <input
              type="text"
              placeholder="Filter by title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          {isLoadingJobs && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {!isLoadingJobs && filteredJobs.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No matching jobs found.</p>
            </div>
          )}

          {!isLoadingJobs && filteredJobs.length > 0 && (
            <div style={{ display: 'grid', gap: '16px' }}>
              {filteredJobs.map((job, idx) => {
                const isSaved = savedJobs.some((j) => j.id === job.id);
                const compName = job.companyName || job.company || job.company_name || 'TechCorp Solutions';

                return (
                  <div key={job.id || idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div onClick={() => setSelectedJob(job)} style={{ cursor: 'pointer', flex: 1, paddingRight: '15px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
                        🏢 {compName}
                      </span>
                      <h4 style={{ margin: '4px 0 6px 0', color: 'var(--primary-accent)', fontSize: '18px' }}>{job.title}</h4>
                      <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        📍 {job.location || 'Remote'} • 💼 {job.type || 'Full-Time'} • 💰 {job.salaryRange || '$110k - $130k'}
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>{job.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button className="btn-secondary" onClick={() => handleToggleSaveJob(job)} style={{ fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap', color: isSaved ? '#f59e0b' : 'inherit' }}>
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

      {/* Catch-All 404 Page */}
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
        user={user}
        onClose={() => setIsPostJobOpen(false)}
        onJobPosted={(newJobPayload) => {
          const newJobWithId = {
            id: Date.now(),
            ...newJobPayload,
            companyName: newJobPayload.companyName || user?.companyName || user?.company || 'My Organization',
            status: 'Active',
            postedDate: new Date().toISOString().split('T')[0]
          };
          setCustomJobs((prev) => [newJobWithId, ...prev]);
          fetchJobs();
          addToast('🎉 New job opportunity published successfully!', 'success');
        }}
      />

      <JobDetailsModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        userRole={user?.role || 'CANDIDATE'}
        isSaved={selectedJob ? savedJobs.some((j) => j.id === selectedJob.id) : false}
        onToggleSave={handleToggleSaveJob}
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