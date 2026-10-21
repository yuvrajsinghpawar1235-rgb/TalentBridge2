import React from 'react';

export default function ConfirmModal({ isOpen, title, message, confirmText = 'Confirm', confirmColor = 'var(--primary-accent)', onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: 'var(--text-primary)' }}>{title}</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{message}</p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ fontSize: '13px' }}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => { onConfirm(); onClose(); }}
            style={{ fontSize: '13px', backgroundColor: confirmColor }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 };
const modalStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '14px', width: '420px', color: 'var(--text-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' };