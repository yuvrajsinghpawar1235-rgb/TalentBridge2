import React, { useState, useEffect } from 'react';
import RegisterCompanyModal from './RegisterCompanyModal';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://talentbridge2-5.onrender.com";

export default function RecruiterDashboard({ jobs = [], user, onOpenPostJob, onUpdateRecruiterCompany }) {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStageFilter, setActiveStageFilter] = useState('ALL');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isRegisterCompanyOpen, setIsRegisterCompanyOpen] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState(user?.companyName || user?.company || 'Partner Company');
  const { addToast } = useToast();

  const recruiterCompany = user?.companyName || user?.company || companyNameInput;

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/applications`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applications');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter candidate applications matching this recruiter's company from MySQL
          const companyApps = data.filter(
            (app) => (app.companyName || app.company || '').toLowerCase() === recruiterCompany.toLowerCase()
          );
          setApplications(companyApps);
        } else {
          setApplications([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn('Error loading recruiter applications from database:', err);
        setApplications([]);
        setIsLoading(false);
      });
  }, [recruiterCompany]);

  // Filter jobs strictly matching this recruiter's company
  const myCompanyJobs = jobs.filter(
    (job) => (job.companyName || job.company || '').toLowerCase() === recruiterCompany.toLowerCase()
  );

  const handleSaveCompanyName = (e) => {
    e.preventDefault();
    if (!companyNameInput.trim()) return;
    if (onUpdateRecruiterCompany) {
      onUpdateRecruiterCompany(companyNameInput.trim());
    }
    setIsEditingCompany(false);
    if (addToast) addToast(`Company name updated to "${companyNameInput.trim()}"`, 'success');
  };

  const handleCompanyRegistered = (newCompany) => {
    if (onUpdateRecruiterCompany) {
      onUpdateRecruiterCompany(newCompany.name);
    }
    setCompanyNameInput(newCompany.name);
  };

  const handleStageChange = async (appId, newStage) => {
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications/${appId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });

      if (!response.ok) {
        console.warn('Backend stage update failed, relying on local state.');
      }
      if (addToast) addToast(`Candidate stage updated to "${newStage}"`, 'info');
    } catch (err) {
      console.error('Network error during stage update:', err);
      if (addToast) addToast(`Candidate stage updated to "${newStage}"`, 'info');
    }
  };

  const filteredApplications = applications.filter(
    (app) => activeStageFilter === 'ALL' || app.stage === activeStageFilter
  );

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Header Banner */}
      <div style={headerBannerStyle}>
        <div>
          <span style={roleBadgeStyle}>💼 Recruiter Workspace</span>

          {isEditingCompany ? (
            <form onSubmit={handleSaveCompanyName} style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
              <input
                type="text"
                value={companyNameInput}
                onChange={(e) => setCompanyNameInput(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '16px', outline: 'none' }}
                autoFocus
              />
              <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}>Save</button>
              <button type="button" className="btn-secondary" onClick={() => setIsEditingCompany(false)} style={{ padding: '4px 12px', fontSize: '12px' }}>Cancel</button>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0 4px 0' }}>
              <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}>{recruiterCompany}</h2>
              <button onClick={() => setIsEditingCompany(true)} className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}>
                ✏️ Edit Name
              </button>
            </div>
          )}

          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            Manage job openings and applicant pipelines for {recruiterCompany}.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn-secondary"
            onClick={() => setIsRegisterCompanyOpen(true)}
            style={{ padding: '10px 16px', fontWeight: 'bold' }}
          >
            🏢 Register / Launch Company
          </button>

          <button
            className="btn-primary"
            onClick={onOpenPostJob}
            style={{ backgroundColor: 'var(--accent-green)', padding: '10px 18px' }}
          >
            + Post New Job Opportunity
          </button>
        </div>
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

      {/* Candidate Pipeline */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>Candidate Pipeline ({filteredApplications.length})</h3>

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
            <p style={{ margin: 0, fontSize: '15px' }}>No candidate applications in the database yet.</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>When job seekers apply to listings posted by {recruiterCompany}, their live applications will populate here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredApplications.map((app) => (
              <div key={app.id} style={applicantCardStyle}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-primary)' }}>{app.candidateName || `Candidate #${app.candidateId || app.id}`}</h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--primary-accent)' }}>
                    Applying for: <strong>{app.jobTitle || `Job #${app.jobId}`}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                    ✉️ {app.candidateEmail || 'No email specified'} • 📅 Applied {app.appliedDate || app.appliedAt ? new Date(app.appliedDate || app.appliedAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>UPDATE STAGE</label>
                  <select
                    value={app.stage || 'APPLIED'}
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

      {/* Register Company Modal */}
      <RegisterCompanyModal
        isOpen={isRegisterCompanyOpen}
        onClose={() => setIsRegisterCompanyOpen(false)}
        onCompanyRegistered={handleCompanyRegistered}
      />
    </div>
  );
}

// Styles
const headerBannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '20px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const roleBadgeStyle = { fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-green)', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '12px' };
const applicantCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)', flexWrap: 'wrap', gap: '12px' };
const selectStyle = { padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '12px', outline: 'none', fontWeight: 'bold' };