import React, { useState } from 'react';

export default function RecruiterDashboard({ jobs, onOpenPostJob }) {
  const [activeTab, setActiveTab] = useState('pipeline');

  // 1. COMPANY PROFILE STATE
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

  // 2. APPLICANTS STATE WITH STAGE MOVEMENT
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
  const [activeInterviewRoom, setActiveInterviewRoom] = useState(null);

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

  // ANALYTICS COMPUTATIONS
  const totalApps = applicants.length;
  const appliedCount = applicants.filter(a => a.stage === 'APPLIED').length;
  const screeningCount = applicants.filter(a => a.stage === 'SCREENING').length;
  const interviewCount = applicants.filter(a => a.stage === 'INTERVIEW').length;
  const offerCount = applicants.filter(a => a.stage === 'OFFER').length;

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Sub-Navigation */}
      <div style={subnavStyle}>
        <button onClick={() => setActiveTab('pipeline')} style={subnavTabStyle(activeTab === 'pipeline')}>📋 Recruiter Pipeline</button>
        <button onClick={() => setActiveTab('jobs')} style={subnavTabStyle(activeTab === 'jobs')}>💼 Job Listings ({jobs.length})</button>
        <button onClick={() => setActiveTab('applicants')} style={subnavTabStyle(activeTab === 'applicants')}>👥 Applicants ({applicants.length})</button>
        <button onClick={() => setActiveTab('company')} style={subnavTabStyle(activeTab === 'company')}>🏢 Company Profile</button>
        <button onClick={() => setActiveTab('interviews')} style={subnavTabStyle(activeTab === 'interviews')}>📅 Interviews</button>
        <button onClick={() => setActiveTab('analytics')} style={subnavTabStyle(activeTab === 'analytics')}>📊 Hiring Analytics</button>
      </div>

      {/* 1. RECRUITER PIPELINE */}
      {activeTab === 'pipeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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

      {/* 2. JOB LISTINGS TAB */}
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
                <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* 3. APPLICANTS LIST */}
      {activeTab === 'applicants' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Candidate Applicants ({applicants.length})</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            {applicants.map(app => (
              <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={stageBadgeStyle(app.stage)}>{app.stage}</span>
                  <h4 style={{ margin: '6px 0 4px 0', color: 'var(--primary-accent)', fontSize: '18px' }}>{app.candidateName}</h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Applied for <strong>{app.jobTitle}</strong> • 🎓 {app.university} • 💼 {app.experienceLevel}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {app.skills.map((skill, i) => (
                      <span key={i} style={miniSkillStyle}>{skill}</span>
                    ))}
                  </div>
                </div>
                <button className="btn-primary" onClick={() => setSelectedCandidate(app)} style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>Review Full Profile →</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPANY PROFILE TAB */}
      {activeTab === 'company' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-purple)' }}>🏢 Official Employer Profile</span>
              <h3 style={{ margin: '4px 0 2px 0', color: 'var(--text-primary)', fontSize: '24px' }}>{companyProfile.name}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>"{companyProfile.tagline}"</p>
            </div>
            <button className="btn-secondary" onClick={() => setIsEditingCompany(!isEditingCompany)} style={{ fontSize: '12px' }}>
              {isEditingCompany ? 'Cancel Editing' : '✏️ Edit Profile'}
            </button>
          </div>

          {isEditingCompany ? (
            <form onSubmit={(e) => { e.preventDefault(); setIsEditingCompany(false); }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Company Name</label>
                <input type="text" value={companyProfile.name} onChange={e => setCompanyProfile({...companyProfile, name: e.target.value})} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Tagline / Mission Statement</label>
                <input type="text" value={companyProfile.tagline} onChange={e => setCompanyProfile({...companyProfile, tagline: e.target.value})} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Industry</label>
                  <input type="text" value={companyProfile.industry} onChange={e => setCompanyProfile({...companyProfile, industry: e.target.value})} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Global Headquarters</label>
                  <input type="text" value={companyProfile.location} onChange={e => setCompanyProfile({...companyProfile, location: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Company Size</label>
                  <input type="text" value={companyProfile.size} onChange={e => setCompanyProfile({...companyProfile, size: e.target.value})} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Founded Year</label>
                  <input type="text" value={companyProfile.founded} onChange={e => setCompanyProfile({...companyProfile, founded: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Company Overview & Mission</label>
                <textarea rows={3} value={companyProfile.description} onChange={e => setCompanyProfile({...companyProfile, description: e.target.value})} style={inputStyle} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px', backgroundColor: 'var(--accent-green)' }}>Save Employer Details</button>
            </form>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', margin: '20px 0' }}>
                <div style={infoTileStyle}>
                  <span style={infoTileLabel}>Industry</span>
                  <strong>{companyProfile.industry}</strong>
                </div>
                <div style={infoTileStyle}>
                  <span style={infoTileLabel}>Headquarters</span>
                  <strong>📍 {companyProfile.location}</strong>
                </div>
                <div style={infoTileStyle}>
                  <span style={infoTileLabel}>Company Size</span>
                  <strong>👥 {companyProfile.size}</strong>
                </div>
                <div style={infoTileStyle}>
                  <span style={infoTileLabel}>Founded</span>
                  <strong>🏛️ {companyProfile.founded}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={sectionHeaderStyle}>About {companyProfile.name}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{companyProfile.description}</p>
              </div>

              <div>
                <h4 style={sectionHeaderStyle}>Perks & Benefits</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {companyProfile.culturePerks.map((perk, idx) => (
                    <span key={idx} style={perkBadgeStyle}>✨ {perk}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. INTERVIEWS */}
      {activeTab === 'interviews' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Scheduled Candidate Interviews</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            {applicants.filter(a => a.stage === 'INTERVIEW').map(app => (
              <div key={app.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Interview with {app.candidateName}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Position: <strong>{app.jobTitle}</strong> • Scheduled Time: <strong>{app.interviewTime || 'Friday at 2:30 PM EST'}</strong>
                    </p>
                  </div>
                  <button className="btn-primary" onClick={() => setActiveInterviewRoom(`TalentBridge-Recruiter-${app.id}`)}>
                    🎥 Start Video Interview
                  </button>
                </div>

                {activeInterviewRoom === `TalentBridge-Recruiter-${app.id}` && (
                  <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>🔴 Live Recruiter Interview Session</strong>
                      <button className="btn-secondary" style={{ fontSize: '11px' }} onClick={() => setActiveInterviewRoom(null)}>End Session</button>
                    </div>
                    <iframe
                      src={`https://meet.jit.si/TalentBridge-Interview-${app.id}`}
                      style={{ width: '100%', height: '400px', border: 'none', borderRadius: '10px' }}
                      title="Recruiter Interview Call"
                      allow="camera; microphone; display-capture"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. ENHANCED HIRING ANALYTICS */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Top Key Performance Indicators */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="card" style={{ borderTop: '4px solid var(--primary-accent)' }}>
              <span style={statLabelStyle}>Total Applicants</span>
              <h3 style={statValueStyle}>{totalApps}</h3>
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold' }}>↑ 18% vs last month</span>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent-green)' }}>
              <span style={statLabelStyle}>Avg Time-to-Hire</span>
              <h3 style={{ ...statValueStyle, color: 'var(--accent-green)' }}>14 Days</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>⚡ 35% faster than industry benchmark</span>
            </div>

            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
              <span style={statLabelStyle}>Interview Pass Rate</span>
              <h3 style={{ ...statValueStyle, color: '#f59e0b' }}>
                {totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0}%
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Screening → Interview stage</span>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent-purple)' }}>
              <span style={statLabelStyle}>Offer Acceptance</span>
              <h3 style={{ ...statValueStyle, color: 'var(--accent-purple)' }}>100%</h3>
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold' }}>🎉 High offer conversion</span>
            </div>
          </div>

          {/* Full Width Pipeline Funnel & Hiring Goal Tracker */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Expanded Recruitment Pipeline Funnel */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Recruitment Funnel & Pipeline Breakdown</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Active Pipeline Velocity</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Applied Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>📥 Applied Stage</span>
                    <strong>{appliedCount} Candidates ({totalApps > 0 ? Math.round((appliedCount / totalApps) * 100) : 0}%)</strong>
                  </div>
                  <div style={chartBarBgStyle}>
                    <div style={chartBarFillStyle('var(--primary-accent)', (appliedCount / totalApps) * 100)} />
                  </div>
                </div>

                {/* Screening Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>🔍 Screening Stage</span>
                    <strong>{screeningCount} Candidates ({totalApps > 0 ? Math.round((screeningCount / totalApps) * 100) : 0}%)</strong>
                  </div>
                  <div style={chartBarBgStyle}>
                    <div style={chartBarFillStyle('#8b5cf6', (screeningCount / totalApps) * 100)} />
                  </div>
                </div>

                {/* Interview Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>📅 Interview Stage</span>
                    <strong>{interviewCount} Candidates ({totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0}%)</strong>
                  </div>
                  <div style={chartBarBgStyle}>
                    <div style={chartBarFillStyle('#f59e0b', (interviewCount / totalApps) * 100)} />
                  </div>
                </div>

                {/* Offer Extended Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>🎉 Offer Extended Stage</span>
                    <strong>{offerCount} Candidates ({totalApps > 0 ? Math.round((offerCount / totalApps) * 100) : 0}%)</strong>
                  </div>
                  <div style={chartBarBgStyle}>
                    <div style={chartBarFillStyle('var(--accent-green)', (offerCount / totalApps) * 100)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Q4 Hiring Target & Health Meter */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Q4 Hiring Goal</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                  Target: Fill <strong>4 Engineering Roles</strong> this quarter.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
                    <span>Progress to Quota</span>
                    <span style={{ color: 'var(--accent-green)' }}>75% Completed</span>
                  </div>
                  <div style={{ ...chartBarBgStyle, height: '14px' }}>
                    <div style={chartBarFillStyle('var(--accent-green)', 75)} />
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '4px solid var(--primary-accent)' }}>
                <strong style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>💡 Recruiter Insight</strong>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Candidates in the Interview stage respond within 24 hours on average. Schedule video calls quickly to maintain candidate engagement!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CANDIDATE MODAL */}
      {selectedCandidate && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <span style={stageBadgeStyle(selectedCandidate.stage)}>{selectedCandidate.stage}</span>
                <h3 style={{ margin: '6px 0 2px 0', color: 'var(--primary-accent)', fontSize: '22px' }}>{selectedCandidate.candidateName}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>
                  Applying for <strong>{selectedCandidate.jobTitle}</strong> • {selectedCandidate.email}
                </p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} style={closeXStyle}>✕</button>
            </div>

            <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={infoTileStyle}>
                <span style={infoTileLabel}>🎓 Education</span>
                <strong>{selectedCandidate.university}</strong>
              </div>
              <div style={infoTileStyle}>
                <span style={infoTileLabel}>💼 Experience Level</span>
                <strong>{selectedCandidate.experienceLevel}</strong>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <span style={infoTileLabel}>🚀 Recent Projects & Experience</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{selectedCandidate.latestWork}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <span style={infoTileLabel}>📝 Candidate Bio</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{selectedCandidate.bio}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <span style={infoTileLabel}>💡 Technical Skills</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {selectedCandidate.skills.map((skill, index) => (
                  <span key={index} style={skillBadgeStyle}>{skill}</span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-primary)' }}>Recruiter Stage & Feedback Controls</h4>

              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Move Candidate Stage</label>
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) => handleStageChange(selectedCandidate.id, e.target.value)}
                  style={inputStyle}
                >
                  {stages.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Recruiter Feedback & Review Notes</label>
                <textarea
                  rows={2}
                  value={selectedCandidate.notes}
                  onChange={(e) => {
                    const updatedNotes = e.target.value;
                    setSelectedCandidate(prev => ({ ...prev, notes: updatedNotes }));
                    setApplicants(prev => prev.map(a => a.id === selectedCandidate.id ? { ...a, notes: updatedNotes } : a));
                  }}
                  style={inputStyle}
                />
              </div>
            </div>

            <button className="btn-secondary" onClick={() => setSelectedCandidate(null)} style={{ width: '100%', marginTop: '16px' }}>Close Candidate Review</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers & Styles
const subnavStyle = { display: 'flex', gap: '8px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '6px' };
const subnavTabStyle = (isActive) => ({ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: isActive ? 'var(--accent-green)' : 'var(--bg-card)', color: isActive ? '#fff' : 'var(--text-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' });
const kanbanGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '15px' };
const kanbanColumnStyle = { backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', minHeight: '380px' };
const kanbanColumnHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' };
const counterBadgeStyle = { backgroundColor: 'var(--badge-bg)', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-primary)' };
const miniSkillStyle = { fontSize: '10px', fontWeight: 'bold', backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', padding: '2px 6px', borderRadius: '6px' };
const skillBadgeStyle = { backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px' };
const statLabelStyle = { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' };
const statValueStyle = { fontSize: '24px', fontWeight: '800', margin: '6px 0 0 0', color: 'var(--text-primary)' };
const inputGroupStyle = { marginBottom: '12px', display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '100%' };
const stageBadgeStyle = (stage) => ({ backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '10px' });
const infoTileStyle = { padding: '10px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' };
const infoTileLabel = { display: 'block', fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold', marginBottom: '2px' };
const perkBadgeStyle = { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px' };
const sectionHeaderStyle = { fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' };
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '14px', color: 'var(--text-primary)' };
const closeXStyle = { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' };

// Chart Bar Styles
const chartBarBgStyle = { width: '100%', height: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', overflow: 'hidden' };
const chartBarFillStyle = (color, pct) => ({ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '6px', transition: 'width 0.4s ease' });