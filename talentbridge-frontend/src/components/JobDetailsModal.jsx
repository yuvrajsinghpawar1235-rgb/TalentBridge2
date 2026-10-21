import React from 'react';

export default function JobDetailsModal({ job, isOpen, onClose, userRole, onApply, isSaved, onToggleSave }) {
  if (!isOpen || !job) return null;

  // Standardize skills array or split string
  const skillsList = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === 'string'
    ? job.skills.split(',').map((s) => s.trim())
    : ['Java', 'Spring Boot', 'React', 'MySQL'];

  // Standardize requirements array or split string
  const requirementsList = Array.isArray(job.requirements)
    ? job.requirements
    : typeof job.requirements === 'string'
    ? job.requirements.split('.').filter(Boolean).map((r) => r.trim())
    : [
        '3+ years of experience with software engineering',
        'Strong hands-on expertise in backend REST APIs or modern frontend frameworks',
        'Demonstrated ability to write clean, testable code and work in agile environments'
      ];

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <span style={companyBadgeStyle}>🏢 {job.companyName || 'TalentBridge Partner'}</span>
              <span style={statusBadgeStyle(job.status)}>{job.status || 'Active'}</span>
            </div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', color: 'var(--primary-accent)' }}>{job.title}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
              📍 {job.location || 'Remote'} • 📅 Posted {job.postedDate || '2026-10-15'}
            </p>
          </div>
          <button onClick={onClose} style={closeButtonStyle}>✕</button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

        {/* Quick Highlights Grid */}
        <div style={highlightGridStyle}>
          <div style={highlightBoxStyle}>
            <span style={highlightLabelStyle}>💰 Compensation</span>
            <span style={highlightValueStyle}>{job.salaryRange || '$100k - $130k'}</span>
          </div>
          <div style={highlightBoxStyle}>
            <span style={highlightLabelStyle}>📍 Location Mode</span>
            <span style={highlightValueStyle}>{job.workplaceType || 'Remote'}</span>
          </div>
          <div style={highlightBoxStyle}>
            <span style={highlightLabelStyle}>💼 Job Type</span>
            <span style={highlightValueStyle}>{job.type || 'Full-Time'}</span>
          </div>
        </div>

        {/* Body Content */}
        <div style={{ display: 'grid', gap: '20px', margin: '20px 0' }}>
          {/* Description */}
          <div>
            <h4 style={sectionTitleStyle}>📄 Role Overview</h4>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              {job.description || 'Join our team to build scalable full-stack software applications and collaborate with cross-functional engineering teams.'}
            </p>
          </div>

          {/* Key Requirements */}
          <div>
            <h4 style={sectionTitleStyle}>📋 Key Requirements</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6' }}>
              {requirementsList.map((req, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Required Skills Badges */}
          <div>
            <h4 style={sectionTitleStyle}>⚡ Technical Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skillsList.map((skill, index) => (
                <span key={index} style={skillPillStyle}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          {userRole === 'CANDIDATE' && onToggleSave && (
            <button className="btn-secondary" onClick={() => onToggleSave(job)}>
              {isSaved ? '⭐ Saved' : '☆ Save Job'}
            </button>
          )}

          {userRole === 'CANDIDATE' && onApply && (
            <button className="btn-primary" onClick={() => { onApply(job); onClose(); }}>
              Submit Application →
            </button>
          )}

          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline Styles
const backdropStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' };
const modalStyle = { backgroundColor: 'var(--bg-card)', borderRadius: '12px', padding: '28px', maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' };
const closeButtonStyle = { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-secondary)' };
const companyBadgeStyle = { fontSize: '12px', color: 'var(--accent-purple)', fontWeight: 'bold' };
const statusBadgeStyle = (status) => ({ backgroundColor: status === 'Closed' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: status === 'Closed' ? '#ef4444' : 'var(--accent-green)', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' });
const sectionTitleStyle = { fontSize: '15px', fontWeight: 'bold', color: 'var(--text-primary)', margin: '0 0 8px 0' };
const highlightGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', backgroundColor: 'var(--bg-input)', padding: '14px', borderRadius: '8px' };
const highlightBoxStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const highlightLabelStyle = { fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' };
const highlightValueStyle = { fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' };
const skillPillStyle = { backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '12px' };