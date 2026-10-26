import React, { useState } from 'react';

export default function HeaderProfileMenu({ user, onLogout, onNavigate, notifications = [] }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Directly calculate unread count from passed live database notifications
  const unreadCount = notifications.filter(n => n.unread !== false).length;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
      {/* Notification Bell */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
          className="btn-secondary"
          style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '14px', position: 'relative' }}
        >
          🔔 {unreadCount > 0 && <span style={notifBadgeStyle}>{unreadCount}</span>}
        </button>

        {isNotifOpen && (
          <div style={dropdownStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong style={{ fontSize: '13px' }}>Notifications</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{notifications.length} updates</span>
            </div>
            <hr style={{ borderColor: 'var(--border-color)', margin: '0 0 10px 0' }} />

            {notifications.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', margin: '10px 0' }}>
                No notifications yet.
              </p>
            ) : (
              notifications.map((n, index) => (
                <div
                  key={n.id || index}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: n.unread !== false ? 'var(--bg-secondary)' : 'transparent',
                    marginBottom: '6px'
                  }}
                >
                  <strong style={{ fontSize: '12px', color: 'var(--primary-accent)', display: 'block' }}>{n.title}</strong>
                  <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>{n.message || n.text}</p>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{n.time || n.date}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* User Profile Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
        >
          👤 {user?.name || 'User'} <span style={{ fontSize: '10px' }}>▼</span>
        </button>

        {isProfileOpen && (
          <div style={dropdownStyle}>
            <div style={{ marginBottom: '10px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>{user?.name || 'User'}</strong>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Role: {user?.role || 'Guest'}</span>
            </div>
            <hr style={{ borderColor: 'var(--border-color)', margin: '8px 0' }} />
            <button
              onClick={() => {
                setIsProfileOpen(false);
                if (user?.role === 'CANDIDATE') onNavigate('candidate');
                if (user?.role === 'RECRUITER') onNavigate('recruiter');
                if (user?.role === 'ADMIN') onNavigate('admin');
              }}
              style={menuItemStyle}
            >
              📋 Workspace Dashboard
            </button>
            <button onClick={onLogout} style={{ ...menuItemStyle, color: '#ef4444' }}>
              🚪 Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const dropdownStyle = {
  position: 'absolute',
  top: '40px',
  right: 0,
  width: '240px',
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  padding: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  zIndex: 1000
};

const notifBadgeStyle = {
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  backgroundColor: '#ef4444',
  color: '#fff',
  fontSize: '10px',
  borderRadius: '10px',
  padding: '1px 5px',
  fontWeight: 'bold'
};

const menuItemStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '8px',
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  fontSize: '13px',
  cursor: 'pointer',
  borderRadius: '6px'
};