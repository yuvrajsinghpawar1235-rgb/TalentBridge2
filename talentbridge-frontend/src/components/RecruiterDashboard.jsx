import React, { useState } from 'react';

export default function RecruiterDashboard({ jobs = [], onOpenPostJob }) {
  const [activeTab, setActiveTab] = useState('pipeline');

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState({
    name: 'TechCorp Solutions',
    tagline: 'Empowering enterprises through distributed cloud architecture and intelligent AI platforms.',
    industry: 'Software & Cloud Engineering',
    location: 'San Francisco, CA / Remote',
    size: '500 - 1,000 Employees',
    founded: '2018',
    website: 'https://techcorp.example.com',
    description: 'TechCorp Solutions builds enterprise-grade microservice platforms, real-time analytics engines, and artificial intelligence infrastructure. Our distributed global team serves over 200 Fortune 500 clients with high-availability systems.',
    culturePerks: ['Remote-First Culture', 'Flexible PTO', '$2,000 Learning Stipend', 'Health & Wellness Coverage', 'Stock Options / Equity']
  });
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  // Applicants State with Stage Movement
  const [applicants, setApplicants] = useState([
    {
      id: 'app-1',
      candidateName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      jobTitle: 'Full Stack Developer',
      jobId: 1,
      stage: 'INTERVIEW',
      appliedDate: '2026-10-12',
      university: 'B.Tech in Computer Science',
      experienceLevel: 'Fresher / Entry-Level',
      latestWork: 'Built MedConnect Healthcare App (React, Spring Boot, WebRTC) & Ai-Shorts-Generator',
      bio: 'Passionate software engineering graduate specializing in full-stack web applications, Java backend systems, and clean modular React UI components.',
      skills: ['React', 'Spring Boot', 'Python', 'MySQL', 'Git', 'Java 22'],
      notes: 'Strong portfolio projects and excellent technical assessment performance.',
      interviewTime: 'Friday at 2:30 PM EST',
      salaryExpectation: '$110,000 - $125,000 / year'
    },
    {
      id: 'app-2',
      candidateName: 'Priya Sharma',
      email: 'priya.s@example.com',
      jobTitle: 'Senior Frontend Engineer',
      jobId: 1,
      stage: 'SCREENING',
      appliedDate: '2026-10-14',
      university: 'M.S. in Software Engineering',
      experienceLevel: '3+ Years Industry Experience',
      latestWork: 'Lead Frontend Developer at FinTech Systems — Scaled React dashboard to 500k monthly active users.',
      bio: 'Frontend architect with deep expertise in performance optimization, design systems, and TypeScript.',
      skills: ['React', 'TypeScript', 'Redux Context', 'CSS Modules', 'GraphQL'],
      notes: 'Reviewing code samples from public GitHub repository.',
      interviewTime: '',
      salaryExpectation: '$135,000 - $150,000 / year'
    },
    {
      id: 'app-3',
      candidateName: 'Rohan Verma',
      email: 'rohan.v@example.com',
      jobTitle: 'Java Backend Engineer',
      jobId: 2,
      stage: 'APPLIED',
      appliedDate: '2026-10-18',
      university: 'B.Tech in Information Technology',
      experienceLevel: '1 Year Experience',
      latestWork: 'Backend Engineer Intern — Microservices architecture using Spring Data JPA and MySQL Server.',
      bio: 'Backend developer focused on database optimization, RESTful API design, and JVM execution mechanics.',
      skills: ['Java 22', 'Spring Boot', 'MySQL', 'Docker', 'REST API'],
      notes: 'Initial application submitted. Awaiting recruiter review.',
      interviewTime: '',
      salaryExpectation: '$95,000 - $110,000 / year'
    }
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Stage change handler
  const handleStageChange = (appId, newStage) => {
    setApplicants(prev => prev.map(app => app.id === appId ? { ...app, stage: newStage } : app));
    if (selectedCandidate && selectedCandidate.id === appId) {
      setSelectedCandidate(prev => ({ ...prev, stage: newStage }));
    }
  };

  const stages = [
    { key: 'APPLIED', label: '📥 Applied', color: 'var(--primary-accent)' },
    { key: 'SCREENING', label: '🔍 Screening', color: '#8b5cf6' },
    { key: 'INTERVIEW', label: '📅 Interview', color: '#f59e0b' },
    { key: 'OFFER', label: '🎉 Offer Extended', color: 'var(--accent-green)' },
    { key: 'REJECTED', label: '✕ Rejected', color: '#ef4444' }
  ];

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Sub-Navigation */}
      <div style={subnavStyle}>
        <button onClick={() => setActiveTab('pipeline')} style={subnavTabStyle(activeTab === 'pipeline')}>📋 Recruiter Pipeline</button>
        <button onClick={() => setActiveTab('jobs')} style={subnavTabStyle(activeTab === 'jobs')}>💼 Job Listings ({jobs.length})</button>
        <button onClick={() => setActiveTab('applicants')} style={subnavTabStyle(activeTab === 'applicants')}>👥 Applicants ({applicants.length})</button>
        <button onClick={() => setActiveTab('company')} style={subnavTabStyle(activeTab === 'company')}>🏢 Company Profile</button>
        <button onClick={() => setActiveTab('analytics')} style={subnavTabStyle(activeTab === 'analytics')}>📊 Hiring Analytics</button>
      </div>

      {/* RECRUITER PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '22px', color: 'var(--text-primary)' }}>Recruiter Pipeline</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>Track candidate progress and advance applicants across hiring stages.</p>
            </div>
            <button className="btn-primary" onClick={onOpenPostJob} style={{ backgroundColor: 'var(--accent-green)' }}>+ Post New Opportunity</button>
          </div>

          <div style={kanbanGridStyle}>
            {stages.map(col => {
              const colApplicants = applicants.filter(a => a.stage === col.key);
              return (
                <div key={col.key} style={kanbanColumnStyle}>
                  <div style={{ ...kanbanColumnHeaderStyle, borderBottom: `3px solid ${col.color}` }}>
                    <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-primary)' }}>{col.label}</span>
                    <span style={counterBadgeStyle}>{colApplicants.length}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    {colApplicants.map(app => (
                      <div key={app.id} className="card" style={{ padding: '12px', borderLeft: `3px solid ${col.color}` }}>
                        <div onClick={() => setSelectedCandidate(app)} style={{ cursor: 'pointer' }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: 'var(--primary-accent)' }}>{app.candidateName}</h4>
                          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{app.jobTitle}</p>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                            {app.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} style={miniSkillStyle}>{s}</span>
                            ))}
                          </div>
                        </div>

                        {/* Quick Stage Movement */}
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                          <label style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Move Stage:</label>
                          <select
                            value={app.stage}
                            onChange={(e) => handleStageChange(app.id, e.target.value)}
                            style={{ ...inputStyle, padding: '4px 6px', fontSize: '11px', height: '28px' }}
                          >
                            {stages.map(s => (
                              <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* JOB LISTINGS TAB */}
      {activeTab === 'jobs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Active Posted Positions ({jobs.length})</h3>
            <button className="btn-primary" onClick={onOpenPostJob} style={{ backgroundColor: 'var(--accent-green)' }}>+ Create Job Post</button>
          </div>

          <div style={{ display: 'grid', gap: '14px' }}>
            {jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No active jobs posted yet. Click "+ Create Job Post" to add one!
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent-green)', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '10px' }}>
                      ● Active Listing
                    </span>
                    <h4 style={{ margin: '6px 0 4px 0', fontSize: '18px', color: 'var(--primary-accent)' }}>{job.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      📍 {job.location} • 💼 {job.type} • 💰 {job.salaryRange}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => setActiveTab('pipeline')}>Manage Candidates</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* APPLICANTS LIST TAB */}
      {activeTab === 'applicants' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Candidate Applicants ({applicants.length})</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            {applicants.map(app => (
              <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <span style={stageBadgeStyle(app.stage)}>{app.stage}</span>
                  <h4 style={{ margin: '6px 0 4px 0', color: 'var(--primary-accent)', fontSize: '18px' }}>{app.candidateName}</h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Applied for <strong>{app.jobTitle}</strong> • 🎓 {app.university} • 💼 {app.experienceLevel}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {app.skills.map((s, idx) => (
                      <span key={idx} style={miniSkillStyle}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setSelectedCandidate(app)}
                    style={{ fontSize: '12px' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPANY PROFILE TAB */}
      {activeTab === 'company' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Company Profile Overview</h3>
            <button
              className="btn-secondary"
              onClick={() => setIsEditingCompany(!isEditingCompany)}
              style={{ fontSize: '12px' }}
            >
              {isEditingCompany ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Company Name</label>
              <h4 style={{ margin: '4px 0 0 0', fontSize: '20px', color: 'var(--text-primary)' }}>{companyProfile.name}</h4>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Tagline</label>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-primary)' }}>{companyProfile.tagline}</p>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>About</label>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{companyProfile.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* HIRING ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Hiring Pipeline Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Total Applicants</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '6px 0 0 0', color: 'var(--primary-accent)' }}>{applicants.length}</h3>
            </div>
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Openings</span>
              <h3 style={{ fontSize: '24px', fontWeight: '800', margin: '6px 0 0 0', color: 'var(--accent-green)' }}>{jobs.length}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers & Styles specific to Recruiter Dashboard
const subnavStyle = { display: 'flex', gap: '8px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '6px' };
const subnavTabStyle = (isActive) => ({ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: isActive ? 'var(--accent-green)' : 'var(--bg-card)', color: isActive ? '#fff' : 'var(--text-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' });
const kanbanGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'start' };
const kanbanColumnStyle = { backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-color)' };
const kanbanColumnHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' };
const counterBadgeStyle = { fontSize: '11px', fontWeight: 'bold', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', padding: '2px 6px', borderRadius: '6px', border: '1px solid var(--border-color)' };
const miniSkillStyle = { fontSize: '10px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-color)' };
const stageBadgeStyle = (stage) => ({ fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', backgroundColor: stage === 'OFFER' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)', color: stage === 'OFFer' ? 'var(--accent-green)' : '#8b5cf6' });
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '100%' };