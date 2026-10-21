import React from 'react';

export default function NotFound({ onGoHome }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '60px 20px', marginTop: '40px' }}>
      <span style={{ fontSize: '54px', display: 'block', marginBottom: '10px' }}>🚀</span>
      <h2 style={{ fontSize: '32px', margin: '0 0 10px 0', color: 'var(--text-primary)' }}>404 - Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 24px auto', fontSize: '15px' }}>
        The workspace tab or route you are looking for does not exist or has been moved.
      </p>
      <button className="btn-primary" onClick={onGoHome} style={{ padding: '10px 24px' }}>
        Return to Overview Feed
      </button>
    </div>
  );
}