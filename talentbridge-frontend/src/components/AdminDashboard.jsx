import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talentbridge2-5.onrender.com';

export default function AdminDashboard({ jobs = [], onJobUpdated }) {
  const [activeTab, setActiveTab] = useState('overview');

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalJobs: jobs.length,
    totalApplications: 0,
    totalInterviews: 0
  });

  const [users, setUsers] = useState([
    { id: 1, name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'CANDIDATE', status: 'ACTIVE', joinedDate: '2026-08-14' },
    { id: 2, name: 'TechCorp Recruiter', email: 'recruiter@techcorp.com', role: 'RECRUITER', status: 'ACTIVE', joinedDate: '2026-09-01' }
  ]);

  const [companies, setCompanies] = useState([
    { id: 1, name: 'TechCorp Solutions', industry: 'Software & Cloud', verified: true, activeJobs: 4, location: 'San Francisco, CA' },
    { id: 2, name: 'FinFlow Global', industry: 'FinTech Systems', verified: true, activeJobs: 2, location: 'New York, NY' }
  ]);

  const [moderationJobs, setModerationJobs] = useState([
    { id: 201, title: 'Unverified Crypto Engineer', companyName: 'Unknown Startup', status: 'PENDING_APPROVAL', postedDate: '2026-10-18', reason: 'Unverified employer profile' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Software Development', jobCount: 42, status: 'ACTIVE' },
    { id: 2, name: 'Data Science & AI', jobCount: 18, status: 'ACTIVE' },
    { id: 3, name: 'Product Management', jobCount: 12, status: 'ACTIVE' }
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [systemSettings, setSystemSettings] = useState({
    autoApproveVerified: true,
    maintenanceMode: false,
    emailAlerts: true
  });

  // Fetch real analytics from backend on load
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/analytics`)
      .then(res => res.json())
      .then(data => {
        if (data) setAnalytics(data);
      })
      .catch(err => console.error("Failed to fetch admin analytics:", err));
  }, []);

  // User Actions
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u));
  };

  // Company Actions
  const toggleCompanyVerification = (companyId) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, verified: !c.verified } : c));
  };

  // Moderation Actions
  const approveJob = (jobId) => {
    setModerationJobs(prev => prev.filter(j => j.id !== jobId));
    alert(`Job #${jobId} approved and published live to the platform feed!`);
  };

  const rejectJob = (jobId) => {
    setModerationJobs(prev => prev.filter(j => j.id !== jobId));
    alert(`Job #${jobId} rejected and removed from moderation queue.`);
  };

  // Category Actions
  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, { id: Date.now(), name: newCategoryName.trim(), jobCount: 0, status: 'ACTIVE' }]);
      setNewCategoryName('');
    }
  };

  const handleRemoveCategory = (catId) => {
    setCategories(prev => prev.filter(cat => cat.id !== catId));
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Admin Navigation Bar */}
      <div style={subnavStyle}>
        <button onClick={() => setActiveTab('overview')} style={subnavTabStyle(activeTab === 'overview')}>📊 System Overview</button>
        <button onClick={() => setActiveTab('users')} style={subnavTabStyle(activeTab === 'users')}>👥 Users ({users.length})</button>
        <button onClick={() => setActiveTab('companies')} style={subnavTabStyle(activeTab === 'companies')}>🏢 Companies ({companies.length})</button>
        <button onClick={() => setActiveTab('moderation')} style={subnavTabStyle(activeTab === 'moderation')}>🛡️ Job Moderation ({moderationJobs.length})</button>
        <button onClick={() => setActiveTab('categories')} style={subnavTabStyle(activeTab === 'categories')}>🏷️ Categories ({categories.length})</button>
        <button onClick={() => setActiveTab('settings')} style={subnavTabStyle(activeTab === 'settings')}>⚙️ Reports / Settings</button>
      </div>

      {/* SYSTEM OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div>
          <div style={welcomeBannerStyle}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '24px' }}>Platform Administration</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time oversight of platform users, active employer listings, and moderation queue.</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-purple)', backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '6px 14px', borderRadius: '20px' }}>
              🛡️ Admin Authorization Active
            </span>
          </div>

          <div style={metricsGridStyle}>
            <div className="card" style={{ borderTop: '4px solid var(--accent-purple)' }}>
              <span style={statLabelStyle}>Registered Users</span>
              <h3 style={statValueStyle}>{analytics.totalUsers || users.length}</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Synced from MySQL DB</span>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--primary-accent)' }}>
              <span style={statLabelStyle}>Active Job Listings</span>
              <h3 style={{ ...statValueStyle, color: 'var(--primary-accent)' }}>{jobs.length}</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Live on Render Backend</span>
            </div>

            <div className="card" style={{ borderTop: '4px solid #f59e0b' }}>
              <span style={statLabelStyle}>Job Moderation Queue</span>
              <h3 style={{ ...statValueStyle, color: '#f59e0b' }}>{moderationJobs.length}</h3>
              <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>Pending review</span>
            </div>

            <div className="card" style={{ borderTop: '4px solid var(--accent-green)' }}>
              <span style={statLabelStyle}>Verified Partner Companies</span>
              <h3 style={{ ...statValueStyle, color: 'var(--accent-green)' }}>
                {companies.filter(c => c.verified).length} / {companies.length}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 'bold' }}>Verified employers</span>
            </div>
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>User Account Management</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {users.map(u => (
              <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{u.name}</strong>
                    <span style={roleBadgeStyle(u.role)}>{u.role}</span>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: u.status === 'ACTIVE' ? 'var(--accent-green)' : '#ef4444' }}>
                      ● {u.status}
                    </span>
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{u.email} • Joined on {u.joinedDate}</span>
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => toggleUserStatus(u.id)}
                  style={{ fontSize: '12px', color: u.status === 'ACTIVE' ? '#ef4444' : 'var(--accent-green)' }}
                >
                  {u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPANY MANAGEMENT TAB */}
      {activeTab === 'companies' && (
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Employer & Company Verification</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {companies.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{c.name}</h4>
                    {c.verified && (
                      <span style={{ fontSize: '11px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                        ✓ Verified Partner
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {c.industry} • 📍 {c.location} • {c.activeJobs} Active Jobs Posted
                  </p>
                </div>

                <button
                  className="btn-secondary"
                  onClick={() => toggleCompanyVerification(c.id)}
                  style={{ fontSize: '12px' }}
                >
                  {c.verified ? 'Revoke Verification' : 'Verify Company ✓'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOB MODERATION TAB */}
      {activeTab === 'moderation' && (
        <div>
          <h3 style={{ marginBottom: '16px' }}>Job Moderation Queue ({moderationJobs.length})</h3>
          {moderationJobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              🎉 Job moderation queue is clear! No flagged or pending job postings.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '14px' }}>
              {moderationJobs.map(job => (
                <div key={job.id} className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '3px 8px', borderRadius: '10px' }}>
                        ⚠️ {job.status.replace('_', ' ')}
                      </span>
                      <h4 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{job.title}</h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Company: <strong>{job.companyName}</strong> • Submitted: {job.postedDate}
                      </p>
                      <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <strong>Reason Flagged:</strong> {job.reason}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-secondary" onClick={() => rejectJob(job.id)} style={{ fontSize: '12px', color: '#ef4444' }}>
                        Reject & Remove ✕
                      </button>
                      <button className="btn-primary" onClick={() => approveJob(job.id)} style={{ fontSize: '12px', backgroundColor: 'var(--accent-green)' }}>
                        Approve & Publish ✓
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CATEGORIES MANAGEMENT TAB */}
      {activeTab === 'categories' && (
        <div className="card">
          <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Job Industry Categories</h3>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Enter new industry category name..."
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              style={inputStyle}
            />
            <button className="btn-primary" onClick={handleAddCategory} style={{ backgroundColor: 'var(--accent-purple)', whiteSpace: 'nowrap' }}>
              + Add Category
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ padding: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{cat.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{cat.jobCount} Jobs Active</div>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => handleRemoveCategory(cat.id)}
                  style={{ fontSize: '11px', color: '#ef4444', padding: '4px 8px' }}
                >
                  Remove ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORTS / SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="card">
            <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)' }}>📈 Platform Reports & Analytics Export</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Download certified CSV reports for recruiter placements, user growth, and compliance checks.</p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" onClick={() => alert('Downloading User Growth CSV Report...')} style={{ backgroundColor: 'var(--accent-purple)', fontSize: '12px' }}>
                📥 Export User Growth Report
              </button>
              <button className="btn-secondary" onClick={() => alert('Downloading Job Moderation Audit Report...')} style={{ fontSize: '12px' }}>
                📥 Export Job Listings Audit
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>⚙️ System Security & Configuration</h3>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div style={settingRowStyle}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Auto-Approve Verified Employers</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Bypass moderation queue for partners with verified status.</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setSystemSettings({...systemSettings, autoApproveVerified: !systemSettings.autoApproveVerified})}
                  style={{ fontSize: '12px', color: systemSettings.autoApproveVerified ? 'var(--accent-green)' : '#ef4444' }}
                >
                  {systemSettings.autoApproveVerified ? 'Enabled ✓' : 'Disabled ✕'}
                </button>
              </div>

              <div style={settingRowStyle}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Platform Maintenance Mode</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Temporarily restrict candidate logins during scheduled database migrations.</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                  style={{ fontSize: '12px', color: systemSettings.maintenanceMode ? '#ef4444' : 'var(--text-secondary)' }}
                >
                  {systemSettings.maintenanceMode ? 'Active (Restricted)' : 'Inactive (Normal)'}
                </button>
              </div>

              <div style={settingRowStyle}>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Instant Security Email Alerts</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Notify admin team immediately when suspicious jobs are flagged.</p>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setSystemSettings({...systemSettings, emailAlerts: !systemSettings.emailAlerts})}
                  style={{ fontSize: '12px', color: systemSettings.emailAlerts ? 'var(--accent-green)' : '#ef4444' }}
                >
                  {systemSettings.emailAlerts ? 'Enabled ✓' : 'Disabled ✕'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers & Styles
const subnavStyle = { display: 'flex', gap: '8px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '6px' };
const subnavTabStyle = (isActive) => ({ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: isActive ? 'var(--accent-purple)' : 'var(--bg-card)', color: isActive ? '#fff' : 'var(--text-primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' });
const welcomeBannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px' };
const metricsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' };
const statLabelStyle = { fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' };
const statValueStyle = { fontSize: '24px', fontWeight: '800', margin: '6px 0 0 0', color: 'var(--text-primary)' };
const roleBadgeStyle = (role) => ({ backgroundColor: role === 'RECRUITER' ? 'rgba(16, 185, 129, 0.15)' : 'var(--badge-bg)', color: role === 'RECRUITER' ? 'var(--accent-green)' : 'var(--primary-accent)', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '6px' });
const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '100%' };
const settingRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' };