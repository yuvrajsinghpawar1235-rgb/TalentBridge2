import React, { useState } from 'react';

export default function CandidateDashboard({ jobs, user, savedJobs, onToggleSaveJob }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // 1. PROFILE STATE
  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@example.com',
    title: 'Full Stack Software Engineer',
    university: 'B.Tech in Computer Science',
    isFresher: true,
    latestExperience: 'Open Source Contributor & Projects',
    bio: 'Passionate computer science graduate experienced in React, Spring Boot, Python, and cloud deployments.',
    skills: ['React', 'JavaScript', 'Spring Boot', 'Python', 'MySQL', 'Git']
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // 2. RESUME STATE
  const [resumeFile, setResumeFile] = useState({
    name: 'Alex_Morgan_Resume_2026.pdf',
    size: '245 KB',
    updatedAt: 'Oct 2026'
  });
  const [uploadMessage, setUploadMessage] = useState('');

  // 3. APPLICATIONS STATE (Expanded stages up to OFFER and ACCEPTED)
  const [applications, setApplications] = useState([
    {
      id: 101,
      jobTitle: 'Full Stack Developer',
      companyName: 'TechCorp Solutions',
      stage: 'OFFER',
      appliedDate: '2026-10-12',
      salary: '$110k - $130k',
      notes: 'Official employment offer extended! Review details and accept when ready.',
      timeline: [
        { date: '2026-10-12', event: 'Application Submitted' },
        { date: '2026-10-14', event: 'Passed Initial Screening' },
        { date: '2026-10-18', event: 'Final Interview Completed' },
        { date: '2026-10-20', event: 'Job Offer Extended' }
      ]
    },
    {
      id: 102,
      jobTitle: 'Java Backend Engineer',
      companyName: 'FinFlow Global',
      stage: 'INTERVIEW',
      appliedDate: '2026-10-05',
      salary: '$125k - $145k',
      notes: 'System design interview scheduled. Check interview tab for your video call link.',
      interviewTime: 'Friday at 2:30 PM EST',
      timeline: [
        { date: '2026-10-05', event: 'Application Submitted' },
        { date: '2026-10-08', event: 'Recruiter Screening Completed' },
        { date: '2026-10-10', event: 'Interview Scheduled' }
      ]
    }
  ]);

  const [selectedApp, setSelectedApp] = useState(null);

  // 4. INTERVIEWS STATE
  const [activeInterviewRoom, setActiveInterviewRoom] = useState(null);

  // 5. NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Job Offer Extended!', text: 'TechCorp Solutions has extended an official employment offer.', date: 'Just now', read: false },
    { id: 2, title: 'Interview Stage Advanced', text: 'FinFlow Global moved your application to Interview Stage.', date: '2 hours ago', read: true }
  ]);

  // Skill Handlers
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !profile.skills.includes(newSkillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkillInput.trim()] });
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  // Resume Upload Handler
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeKB = (file.size / 1024).toFixed(0);
      setResumeFile({
        name: file.name,
        size: `${fileSizeKB} KB`,
        updatedAt: 'Just now'
      });
      setUploadMessage(`✓ ${file.name} uploaded successfully!`);
      setTimeout(() => setUploadMessage(''), 4000);
    }
  };

  // Accept Offer Handler
  const handleAcceptOffer = (appId) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          stage: 'ACCEPTED',
          notes: 'Offer accepted successfully! Welcome aboard.',
          timeline: [...app.timeline, { date: '2026-10-20', event: 'Offer Accepted by Candidate' }]
        };
      }
      return app;
    }));
    if (selectedApp) {
      setSelectedApp(prev => ({
        ...prev,
        stage: 'ACCEPTED',
        notes: 'Offer accepted successfully! Welcome aboard.',
        timeline: [...prev.timeline, { date: '2026-10-20', event: 'Offer Accepted by Candidate' }]
      }));
    }
    alert('🎉 Congratulations! You have successfully accepted the job offer.');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Candidate Sub-Navigation */}
      <div style={subnavStyle}>
        <button onClick={() => setActiveTab('dashboard')} style={subnavTabStyle(activeTab === 'dashboard')}>📊 Overview</button>
        <button onClick={() => setActiveTab('profile')} style={subnavTabStyle(activeTab === 'profile')}>👤 Profile</button>
        <button onClick={() => setActiveTab('resume')} style={subnavTabStyle(activeTab === 'resume')}>📄 Resume</button>
        <button onClick={() => setActiveTab('applications')} style={subnavTabStyle(activeTab === 'applications')}>📋 Applications ({applications.length})</button>
        <button onClick={() => setActiveTab('saved')} style={subnavTabStyle(activeTab === 'saved')}>⭐ Saved Jobs ({savedJobs.length})</button>
        <button onClick={() => setActiveTab('interviews')} style={subnavTabStyle(activeTab === 'interviews')}>📅 Interviews</button>
        <button onClick={() => setActiveTab('notifications')} style={subnavTabStyle(activeTab === 'notifications')}>🔔 Notifications ({notifications.filter(n => !n.read).length})</button>
      </div>

      {/* 1. OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={welcomeBannerStyle}>
            <div>
              <h2 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '24px' }}>Welcome back, {profile.name}! 👋</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Track your active applications, interview schedules, and saved opportunities.</p>
            </div>
            <button className="btn-primary" onClick={() => setActiveTab('applications')}>View Applications →</button>
          </div>

          <div style={metricsGridStyle}>
            <div className="card" style={statCardStyle}>
              <span style={statLabelStyle}>Active Applications</span>
              <h3 style={statValueStyle}>{applications.length}</h3>
            </div>
            <div className="card" style={statCardStyle}>
              <span style={statLabelStyle}>Interviews Scheduled</span>
              <h3 style={{ ...statValueStyle, color: '#f59e0b' }}>
                {applications.filter(a => a.stage === 'INTERVIEW').length}
              </h3>
            </div>
            <div className="card" style={statCardStyle}>
              <span style={statLabelStyle}>Offers Received</span>
              <h3 style={{ ...statValueStyle, color: 'var(--accent-green)' }}>
                {applications.filter(a => a.stage === 'OFFER' || a.stage === 'ACCEPTED').length}
              </h3>
            </div>
            <div className="card" style={statCardStyle}>
              <span style={statLabelStyle}>Skill Match Rate</span>
              <h3 style={{ ...statValueStyle, color: 'var(--primary-accent)' }}>
                {Math.min(98, 70 + profile.skills.length * 4)}%
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROFILE TAB (Enhanced with Character & Design Polish) */}
      {activeTab === 'profile' && (
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={avatarCircleStyle}>
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '20px' }}>Candidate Profile Overview</h3>
                <span style={{ fontSize: '12px', color: 'var(--accent-green)', fontWeight: 'bold' }}>● Verified Talent Profile</span>
              </div>
            </div>
            <button className="btn-secondary" onClick={() => setIsEditingProfile(!isEditingProfile)} style={{ fontSize: '12px' }}>
              {isEditingProfile ? 'Cancel Editing' : '✏️ Edit Profile'}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={(e) => { e.preventDefault(); setIsEditingProfile(false); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Professional Title</label>
                  <input type="text" value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>University / Degree</label>
                <input type="text" value={profile.university} onChange={(e) => setProfile({ ...profile, university: e.target.value })} style={inputStyle} placeholder="e.g. B.Tech in Computer Science" />
              </div>

              <div style={{ margin: '15px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input type="checkbox" checked={profile.isFresher} onChange={(e) => setProfile({ ...profile, isFresher: e.target.checked })} />
                  <strong>I am a Fresher / Recent Graduate</strong>
                </label>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>{profile.isFresher ? 'Latest Academic Projects / Internships' : 'Latest Work Experience'}</label>
                <textarea rows={2} value={profile.latestExperience} onChange={(e) => setProfile({ ...profile, latestExperience: e.target.value })} style={inputStyle} />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>About / Bio Summary</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} style={inputStyle} />
              </div>

              {/* Skills Editor */}
              <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Skills & Technologies</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <input type="text" value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} placeholder="Add skill (e.g. React, Java)..." style={inputStyle} />
                  <button type="button" className="btn-primary" onClick={handleAddSkill}>+ Add</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {profile.skills.map((skill, i) => (
                    <span key={i} style={skillBadgeStyle}>
                      {skill} <span onClick={() => handleRemoveSkill(skill)} style={{ cursor: 'pointer', marginLeft: '4px' }}>✕</span>
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Save Profile Changes</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile Header Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '22px', color: 'var(--primary-accent)' }}>{profile.name}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700' }}>{profile.title}</p>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>✉️ {profile.email}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', fontSize: '11px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '20px' }}>
                    {profile.isFresher ? '🎓 Fresher / Graduate' : '💼 Experienced'}
                  </span>
                </div>
              </div>

              {/* Stat Pill Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={subCardStyle}>
                  <strong style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>EDUCATION</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 'bold' }}>{profile.university}</p>
                </div>
                <div style={subCardStyle}>
                  <strong style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>EXPERIENCE TRACK</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 'bold' }}>{profile.isFresher ? 'Entry-Level / 2026 Batch' : 'Mid-Level'}</p>
                </div>
                <div style={subCardStyle}>
                  <strong style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>VERIFIED SKILLS</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 'bold', color: 'var(--primary-accent)' }}>{profile.skills.length} Technologies</p>
                </div>
              </div>

              {/* Bio Summary Card */}
              <div style={{ ...subCardStyle, borderLeft: '4px solid var(--primary-accent)' }}>
                <strong style={{ fontSize: '12px', color: 'var(--primary-accent)', display: 'block', marginBottom: '6px' }}>💡 Professional Bio Summary</strong>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{profile.bio}</p>
              </div>

              {/* Projects / Experience Card */}
              <div style={{ ...subCardStyle, borderLeft: '4px solid var(--accent-green)' }}>
                <strong style={{ fontSize: '12px', color: 'var(--accent-green)', display: 'block', marginBottom: '6px' }}>🚀 {profile.isFresher ? 'Key Projects & Academic Work' : 'Recent Work Experience'}</strong>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{profile.latestExperience}</p>
              </div>

              {/* Technical Stack Tags */}
              <div>
                <strong style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>CORE TECHNICAL STACK</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {profile.skills.map((skill, index) => (
                    <span key={index} style={skillBadgeStyle}>{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. RESUME TAB WITH WORKING FILE UPLOAD */}
      {activeTab === 'resume' && (
        <div className="card">
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Resume Management</h3>

          {uploadMessage && (
            <div style={{ marginBottom: '15px', padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', fontSize: '13px', fontWeight: 'bold' }}>
              {uploadMessage}
            </div>
          )}

          <div style={resumeBoxStyle}>
            <span style={{ fontSize: '36px' }}>📄</span>
            <div>
              <strong>{resumeFile.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PDF / Word Document • Uploaded {resumeFile.updatedAt} ({resumeFile.size})</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert(`Downloading ${resumeFile.name}...`)}>
              📥 Download Resume
            </button>

            {/* Real File Upload Input */}
            <label className="btn-primary" style={{ flex: 1, textAlign: 'center', cursor: 'pointer', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
              📤 Upload New Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* 4. APPLICATIONS */}
      {activeTab === 'applications' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Application Tracking Pipeline</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            {applications.map((app) => (
              <div key={app.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={stageBadgeStyle(app.stage)}>{app.stage.replace('_', ' ')}</span>
                  <h4 style={{ margin: '6px 0 4px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{app.jobTitle}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    🏢 {app.companyName} • 💰 {app.salary} • Applied on {app.appliedDate}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {app.stage === 'OFFER' && (
                    <button className="btn-primary" onClick={() => handleAcceptOffer(app.id)} style={{ backgroundColor: 'var(--accent-green)', fontSize: '12px' }}>
                      ✓ Accept Offer
                    </button>
                  )}
                  <button className="btn-secondary" onClick={() => setSelectedApp(app)} style={{ fontSize: '12px' }}>
                    View Application Journey →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Descriptive Application Journey Modal */}
          {selectedApp && (
            <div style={overlayStyle}>
              <div style={{ ...modalStyle, width: '540px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div>
                    <span style={stageBadgeStyle(selectedApp.stage)}>{selectedApp.stage.replace('_', ' ')}</span>
                    <h3 style={{ margin: '6px 0 2px 0', color: 'var(--primary-accent)' }}>{selectedApp.jobTitle}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '13px' }}>🏢 {selectedApp.companyName} • Applied on {selectedApp.appliedDate}</p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} style={closeXStyle}>✕</button>
                </div>

                <hr style={{ borderColor: 'var(--border-color)', margin: '15px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={sectionHeaderStyle}>Application Progress Pipeline</h4>
                  <div style={trackerBarStyle5}>
                    <div style={trackerStepStyle(true)}>1. Applied</div>
                    <div style={trackerStepStyle(selectedApp.stage !== 'IN_REVIEW')}>2. Screening</div>
                    <div style={trackerStepStyle(['INTERVIEW', 'OFFER', 'ACCEPTED'].includes(selectedApp.stage))}>3. Interview</div>
                    <div style={trackerStepStyle(['OFFER', 'ACCEPTED'].includes(selectedApp.stage))}>4. Offer</div>
                    <div style={trackerStepStyle(selectedApp.stage === 'ACCEPTED')}>5. Accepted</div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={sectionHeaderStyle}>Recruiter Feedback & Status</h4>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', borderLeft: '4px solid var(--primary-accent)', fontSize: '13px', lineHeight: '1.5' }}>
                    {selectedApp.notes}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={sectionHeaderStyle}>Activity History</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedApp.timeline.map((item, index) => (
                      <div key={index} style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.event}</span>
                        <strong>{item.date}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {selectedApp.stage === 'OFFER' && (
                    <button className="btn-primary" onClick={() => handleAcceptOffer(selectedApp.id)} style={{ flex: 1, backgroundColor: 'var(--accent-green)' }}>
                      🎉 Accept Job Offer Now
                    </button>
                  )}
                  <button className="btn-secondary" onClick={() => setSelectedApp(null)} style={{ flex: 1 }}>Close View</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. SAVED JOBS */}
      {activeTab === 'saved' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Saved Jobs ({savedJobs.length})</h3>
          {savedJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No saved jobs yet. You can bookmark listings directly from the Jobs tab!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {savedJobs.map((job) => (
                <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary-accent)', fontSize: '18px' }}>{job.title}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                      🏢 {job.companyName || 'TalentBridge Partner'} • 📍 {job.location} • 💰 {job.salaryRange}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={() => onToggleSaveJob(job)}>Remove ⭐</button>
                    <button className="btn-primary" onClick={() => alert(`Applying for ${job.title}`)}>Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. INTERVIEWS (SIMPLIFIED "Join Meeting" BUTTON) */}
      {activeTab === 'interviews' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Upcoming Interview Schedule</h3>
          <div style={{ display: 'grid', gap: '14px' }}>
            {applications.filter(a => a.stage === 'INTERVIEW').length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                No interviews scheduled at the moment.
              </div>
            ) : (
              applications.filter(a => a.stage === 'INTERVIEW').map((app) => (
                <div key={app.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '3px 8px', borderRadius: '10px' }}>
                        📅 Interview Scheduled
                      </span>
                      <h4 style={{ margin: '6px 0 4px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{app.jobTitle} at {app.companyName}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                        ⏰ <strong>Scheduled Time:</strong> {app.interviewTime || 'Friday at 2:30 PM EST'}
                      </p>
                    </div>
                    <button className="btn-primary" onClick={() => setActiveInterviewRoom(`TalentBridge-${app.id}`)}>
                      🎥 Join Meeting
                    </button>
                  </div>

                  {activeInterviewRoom === `TalentBridge-${app.id}` && (
                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong>🔴 Live Video Interview Room</strong>
                        <button className="btn-secondary" style={{ fontSize: '11px' }} onClick={() => setActiveInterviewRoom(null)}>Leave Room</button>
                      </div>
                      <iframe
                        src={`https://meet.jit.si/TalentBridge-Interview-${app.id}`}
                        style={{ width: '100%', height: '400px', border: 'none', borderRadius: '10px' }}
                        title="Interview Call"
                        allow="camera; microphone; display-capture"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. REAL-TIME RECRUITER NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Application & Recruiter Updates</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {notifications.map((n) => (
              <div key={n.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: n.read ? 'var(--bg-card)' : 'var(--badge-bg)' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{n.title}</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{n.text}</p>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{n.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers & Styles
const subnavStyle = { display: 'flex', gap: '8px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '6px' };
const subnavTabStyle = (isActive) => ({ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: isActive ? 'var(--primary-accent)' : 'var(--bg-card)', color: isActive ? '#fff' : 'var(--text-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' });
const welcomeBannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' };
const metricsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' };
const statCardStyle = { padding: '16px' };
const statLabelStyle = { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' };
const statValueStyle = { fontSize: '24px', fontWeight: '800', margin: '6px 0 0 0', color: 'var(--text-primary)' };
const inputGroupStyle = { marginBottom: '12px', display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' };
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' };
const skillBadgeStyle = { backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', fontSize: '12px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center' };
const resumeBoxStyle = { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)' };
const stageBadgeStyle = (stage) => ({
  backgroundColor: stage === 'ACCEPTED' ? 'rgba(16, 185, 129, 0.15)' : stage === 'OFFER' ? 'rgba(16, 185, 129, 0.15)' : stage === 'INTERVIEW' ? 'rgba(245, 158, 11, 0.15)' : 'var(--badge-bg)',
  color: stage === 'ACCEPTED' ? 'var(--accent-green)' : stage === 'OFFER' ? 'var(--accent-green)' : stage === 'INTERVIEW' ? '#f59e0b' : 'var(--primary-accent)',
  fontSize: '11px',
  fontWeight: 'bold',
  padding: '4px 10px',
  borderRadius: '12px'
});
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '14px', width: '420px', color: 'var(--text-primary)' };
const sectionHeaderStyle = { fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' };
const trackerBarStyle5 = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' };
const trackerStepStyle = (active) => ({ textAlign: 'center', padding: '6px 2px', fontSize: '10px', fontWeight: 'bold', borderRadius: '6px', backgroundColor: active ? 'var(--primary-accent)' : 'transparent', color: active ? '#fff' : 'var(--text-secondary)' });
const closeXStyle = { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' };
const avatarCircleStyle = { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' };
const subCardStyle = { backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' };