import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://talentbridge2-5.onrender.com";

// Base demo applications map
const DEMO_APPLICATIONS = [
  {
    id: 101,
    jobId: 1,
    candidateName: 'Alex Morgan',
    candidateEmail: 'alex.morgan@example.com',
    companyName: 'TechCorp Solutions',
    jobTitle: 'Full Stack Software Engineer',
    stage: 'APPLIED',
    appliedDate: '2026-10-20',
    notes: 'Strong background in Spring Boot & React.'
  },
  {
    id: 102,
    jobId: 2,
    candidateName: 'Jordan Lee',
    candidateEmail: 'jordan.lee@example.com',
    companyName: 'TechCorp Solutions',
    jobTitle: 'Senior Frontend Architect',
    stage: 'INTERVIEW',
    appliedDate: '2026-10-18',
    notes: 'Technical interview scheduled for Tuesday.'
  },
  {
    id: 103,
    jobId: 3,
    candidateName: 'Taylor Swift',
    candidateEmail: 'taylor.s@example.com',
    companyName: 'FinFlow Global',
    jobTitle: 'Java Backend Developer',
    stage: 'OFFER',
    appliedDate: '2026-10-15',
    notes: 'Offer letter generated.'
  }
];

export default function RecruiterDashboard({ jobs = [], user, onOpenPostJob }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStageFilter, setActiveStageFilter] = useState('ALL');
  const { addToast } = useToast();

  // Determine active recruiter company
  const recruiterCompany = user?.companyName || user?.company || 'TechCorp Solutions';

  // Fetch applications & filter strictly by recruiter company
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/applications`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Filter strictly for this recruiter's company or candidate submissions
          const companyApps = data.filter(
            (app) => (app.companyName || '').toLowerCase() === recruiterCompany.toLowerCase()
          );
          setApplications(companyApps);
        } else {
          // Fallback demo apps filtered strictly by recruiter company
          const companyDemoApps = DEMO_APPLICATIONS.filter(
            (app) => app.companyName.toLowerCase() === recruiterCompany.toLowerCase()
          );
          setApplications(companyDemoApps);
        }
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback filtering on network error
        const companyDemoApps = DEMO_APPLICATIONS.filter(
          (app) => app.companyName.toLowerCase() === recruiterCompany.toLowerCase()
        );
        setApplications(companyDemoApps);
        setIsLoading(false);
      });
  }, [recruiterCompany]);

  // Filter posted jobs strictly for this recruiter's company
  const myCompanyJobs = jobs.filter(
    (job) => (job.companyName || job.company || '').toLowerCase() === recruiterCompany.toLowerCase()
  );

  // Update applicant stage handler
  const handleStageChange = (appId, newStage) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
    );
    addToast(`Candidate stage updated to "${newStage}"`, 'info');
  };

  const filteredApplications = applications.filter(
    (app) => activeStageFilter === 'ALL' || app.stage === activeStageFilter
  );

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Recruiter Workspace Header */}
      <div style={headerBannerStyle}>
        <div>
          <span style={roleBadgeStyle}>💼 Recruiter Workspace</span>
          <h2 style={{ margin: '8px 0 4px 0', fontSize: '24px', color: 'var(--text-primary)' }}>
            {recruiterCompany} Hiring Dashboard
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage active job listings and track candidate pipelines for {recruiterCompany}.
          </p>
        </div>
        <button className="btn-primary" onClick={onOpenPostJob} style={{ backgroundColor: 'var(--accent-green)', padding: '10px 18px' }}>
          + Post New Job Opportunity
        </button>
      </div>

      {/* Analytics Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary-accent)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>ACTIVE LISTINGS</span>
          <h3 style={{ margin: '6px 0 0 0', fontSize: '28px', color: 'var(--primary-accent)' }}>{myCompanyJobs.length}</h3>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>TOTAL APPLICANTS</span>
          <h3 style={{ margin: '6px 0 0 0', fontSize: '28px', color: 'var(--accent-green)' }}>{applications.length}</h3>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>IN INTERVIEW</span>
          <h3 style={{ margin: '6px 0 0 0', fontSize: '28px', color: 'var(--accent-purple)' }}>
            {applications.filter((a) => a.stage === 'INTERVIEW').length}
          </h3>
        </div>
      </div>

      {/* Candidate Application Pipeline */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>Candidate Pipeline ({filteredApplications.length})</h3>

          {/* Stage Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED'].map((stage) => (
              <button
                key={stage}
                onClick={() => setActiveStageFilter(stage)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  backgroundColor: activeStageFilter === stage ? 'var(--primary-accent)' : 'var(--bg-secondary)',
                  color: activeStageFilter === stage ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>Loading applicant pipeline...</p>
        ) : filteredApplications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <p style={{ margin: 0, fontSize: '15px' }}>No candidates found in this pipeline stage.</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>New candidate applications submitted to {recruiterCompany} will automatically appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredApplications.map((app) => (
              <div key={app.id} style={applicantCardStyle}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-primary)' }}>{app.candidateName}</h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--primary-accent)' }}>
                    Applying for: <strong>{app.jobTitle}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    ✉️ {app.candidateEmail} • 📅 Applied {app.appliedDate || 'Recently'}
                  </p>
                  {app.notes && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-primary)', fontStyle: 'italic', backgroundColor: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: '6px' }}>
                      "{app.notes}"
                    </p>
                  )}
                </div>

                {/* Pipeline Stage Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>UPDATE STAGE</label>
                  <select
                    value={app.stage}
                    onChange={(e) => handleStageChange(app.id, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const headerBannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '20px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const roleBadgeStyle = { fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-green)', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px' };
const applicantCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', flexWrap: 'wrap', gap: '12px' };
const selectStyle = { padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', fontWeight: 'bold' };