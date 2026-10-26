import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talentbridge2-5.onrender.com';

// Loading Skeleton
export function SkeletonCard() {
  return (
    <div className="card" style={{ opacity: 0.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ width: '30%', height: '14px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} />
      <div style={{ width: '60%', height: '20px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} />
      <div style={{ width: '40%', height: '12px', backgroundColor: 'var(--border-color)', borderRadius: '4px' }} />
      <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginTop: '6px' }} />
    </div>
  );
}

// Error Banner with Retry
export function ErrorState({ message, onRetry }) {
  return (
    <div className="card" style={{ borderLeft: '4px solid #ef4444', textAlign: 'center', padding: '30px' }}>
      <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>⚠️</span>
      <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)' }}>Failed to load data</h4>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
        {message || `Could not connect to backend server at ${API_BASE_URL}.`}
      </p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry} style={{ fontSize: '12px' }}>
          🔄 Retry Connection
        </button>
      )}
    </div>
  );
}