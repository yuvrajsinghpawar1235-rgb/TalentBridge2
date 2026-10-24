import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talentbridge2-5.onrender.com';

export default function LoginModal({ isOpen, onClose, onLoginSuccess, initialRole = 'CANDIDATE', isGenericHeader = false }) {
  const [view, setView] = useState('LOGIN');
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setRole(initialRole);
    setView('LOGIN');
    setError('');
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRoleTheme = () => {
    switch (role) {
      case 'RECRUITER':
        return { color: 'var(--accent-green, #10b981)', bg: 'rgba(16, 185, 129, 0.1)', title: 'Employer / Recruiter' };
      case 'ADMIN':
        return { color: 'var(--accent-purple, #a855f7)', bg: 'rgba(168, 85, 247, 0.1)', title: 'Platform Administrator' };
      default:
        return { color: 'var(--primary-accent, #2563eb)', bg: 'var(--badge-bg)', title: 'Job Seeker / Candidate' };
    }
  };

  const theme = getRoleTheme();

  const handleDemoLogin = (demoRole) => {
    const demoUsers = {
      CANDIDATE: { id: 10, name: 'Alex Morgan (Demo)', email: 'alex.demo@talentbridge.app', role: 'CANDIDATE' },
      RECRUITER: { id: 20, name: 'Sarah Recruiter (Demo)', email: 'sarah.recruiter@talentbridge.app', role: 'RECRUITER' },
      ADMIN: { id: 30, name: 'Master Admin (Demo)', email: 'admin@talentbridge.com', role: 'ADMIN' }
    };
    const user = demoUsers[demoRole];
    localStorage.setItem('user', JSON.stringify(user));
    onLoginSuccess(user);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (view === 'FORGOT') {
      setView('FORGOT_SUCCESS');
      return;
    }

    // Strict Single Master Admin Check
    if (role === 'ADMIN') {
      const masterAdminEmail = 'admin@talentbridge.com';
      if (formData.email.toLowerCase() !== masterAdminEmail) {
        setError(`Access Denied: Only master administrator (${masterAdminEmail}) can access the admin workspace.`);
        return;
      }
    }

    const endpoint = view === 'REGISTER'
      ? `${API_BASE_URL}/api/auth/register`
      : `${API_BASE_URL}/api/auth/login`;

    const payload = view === 'REGISTER'
      ? { ...formData, role }
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('user', JSON.stringify(data));
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, borderTop: `6px solid ${theme.color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: theme.color, backgroundColor: theme.bg, padding: '4px 10px', borderRadius: '12px' }}>
            ● {isGenericHeader ? 'Portal Authentication' : theme.title}
          </span>
          <button onClick={onClose} style={closeXStyle}>✕</button>
        </div>

        {view === 'FORGOT' && (
          <div>
            <h2 style={modalTitleStyle}>Reset Your Password</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Enter your registered email address and we will send you a password reset link.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={inputStyle}
                  placeholder="user@example.com"
                />
              </div>
              <button type="submit" style={{ ...submitBtnStyle, backgroundColor: theme.color }}>
                Send Reset Link
              </button>
            </form>
            <button onClick={() => setView('LOGIN')} style={linkBtnStyle}>
              ← Back to Sign In
            </button>
          </div>
        )}

        {view === 'FORGOT_SUCCESS' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <span style={{ fontSize: '32px' }}>📧</span>
            <h3 style={{ margin: '10px 0 6px 0', color: 'var(--text-primary)' }}>Reset Link Sent!</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              We sent password recovery instructions to <strong>{resetEmail || 'your email'}</strong>.
            </p>
            <button onClick={() => setView('LOGIN')} style={{ ...submitBtnStyle, backgroundColor: theme.color }}>
              Back to Login
            </button>
          </div>
        )}

        {(view === 'LOGIN' || view === 'REGISTER') && (
          <div>
            <h2 style={modalTitleStyle}>
              {view === 'REGISTER' ? `Create ${role} Account` : `${role} Sign In`}
            </h2>

            {error && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '13px' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {view === 'REGISTER' && (
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" style={inputStyle} placeholder="Jane Doe" />
                </div>
              )}

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="username" style={inputStyle} placeholder="user@example.com" />
              </div>

              <div style={inputGroupStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={labelStyle}>Password</label>
                  {view === 'LOGIN' && (
                    <span onClick={() => setView('FORGOT')} style={{ fontSize: '11px', color: theme.color, cursor: 'pointer', fontWeight: 'bold' }}>
                      Forgot?
                    </span>
                  )}
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required autoComplete="current-password" style={inputStyle} placeholder="••••••••" />
              </div>

              {view === 'REGISTER' && (
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Role Workspace</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                    <option value="CANDIDATE">Candidate / Job Seeker</option>
                    <option value="RECRUITER">Recruiter / Employer</option>
                    <option value="ADMIN">Platform Administrator</option>
                  </select>
                </div>
              )}

              <button type="submit" style={{ ...submitBtnStyle, backgroundColor: theme.color }}>
                {view === 'REGISTER' ? `Register as ${role}` : `Sign In as ${role}`}
              </button>
            </form>

            <div style={{ marginTop: '18px', paddingTop: '15px', borderTop: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' }}>
                ✦ Instant Demo Access
              </div>

              {isGenericHeader ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => handleDemoLogin('CANDIDATE')} style={stylishDemoBtnStyle('var(--primary-accent)', 'var(--badge-bg)')}>
                    👤 Candidate
                  </button>
                  <button type="button" onClick={() => handleDemoLogin('RECRUITER')} style={stylishDemoBtnStyle('var(--accent-green)', 'rgba(16, 185, 129, 0.12)')}>
                    💼 Recruiter
                  </button>
                  <button type="button" onClick={() => handleDemoLogin('ADMIN')} style={stylishDemoBtnStyle('var(--accent-purple)', 'rgba(168, 85, 247, 0.12)')}>
                    🛡️ Admin
                  </button>
                </div>
              ) : (
                <div>
                  {role === 'CANDIDATE' && (
                    <button type="button" onClick={() => handleDemoLogin('CANDIDATE')} style={stylishSingleDemoBtnStyle('var(--primary-accent)', 'var(--badge-bg)')}>
                      👤 Launch Candidate Demo →
                    </button>
                  )}
                  {role === 'RECRUITER' && (
                    <button type="button" onClick={() => handleDemoLogin('RECRUITER')} style={stylishSingleDemoBtnStyle('var(--accent-green)', 'rgba(16, 185, 129, 0.12)')}>
                      💼 Launch Recruiter Demo →
                    </button>
                  )}
                  {role === 'ADMIN' && (
                    <button type="button" onClick={() => handleDemoLogin('ADMIN')} style={stylishSingleDemoBtnStyle('var(--accent-purple)', 'rgba(168, 85, 247, 0.12)')}>
                      🛡️ Launch Master Admin Demo →
                    </button>
                  )}
                </div>
              )}
            </div>

            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 0 }}>
              {view === 'REGISTER' ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span
                onClick={() => setView(view === 'REGISTER' ? 'LOGIN' : 'REGISTER')}
                style={{ color: theme.color, cursor: 'pointer', fontWeight: 'bold' }}
              >
                {view === 'REGISTER' ? 'Log In' : 'Sign Up'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'var(--bg-card, #ffffff)', padding: '26px', borderRadius: '14px', width: '390px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-color)' };
const modalTitleStyle = { margin: '0 0 15px 0', color: 'var(--text-primary)', fontSize: '20px', fontWeight: '800' };
const inputGroupStyle = { marginBottom: '14px', display: 'flex', flexDirection: 'column' };
const labelStyle = { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' };
const inputStyle = { padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input, #ffffff)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' };
const submitBtnStyle = { width: '100%', padding: '10px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', marginTop: '6px' };
const linkBtnStyle = { marginTop: '12px', width: '100%', padding: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontSize: '13px', textAlign: 'center' };

const stylishDemoBtnStyle = (color, bg) => ({
  flex: 1,
  padding: '7px 4px',
  fontSize: '11px',
  fontWeight: '700',
  color: color,
  backgroundColor: bg,
  border: `1px solid ${color}`,
  borderRadius: '20px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '4px'
});

const stylishSingleDemoBtnStyle = (color, bg) => ({
  width: '100%',
  padding: '9px',
  fontSize: '12px',
  fontWeight: '700',
  color: color,
  backgroundColor: bg,
  border: `1px solid ${color}`,
  borderRadius: '20px',
  cursor: 'pointer'
});

const closeXStyle = { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '16px', cursor: 'pointer' };