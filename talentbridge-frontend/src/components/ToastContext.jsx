import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={toastContainerStyle}>
        {toasts.map((toast) => (
          <div key={toast.id} style={toastStyle(toast.type)}>
            <span>{getToastIcon(toast.type)} {toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={toastCloseStyle}>✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Styles & Helpers
const getToastIcon = (type) => {
  switch (type) {
    case 'success': return '🎉';
    case 'error': return '⚠️';
    case 'warning': return '🔔';
    default: return 'ℹ️';
  }
};

const toastContainerStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  zIndex: 2000
};

const toastStyle = (type) => ({
  display: 'flex',
  alignItems: 'center',
  justify: 'space-between',
  gap: '12px',
  minWidth: '280px',
  padding: '12px 16px',
  borderRadius: '10px',
  backgroundColor: 'var(--bg-card)',
  color: 'var(--text-primary)',
  borderLeft: `5px solid ${type === 'success' ? 'var(--accent-green)' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : 'var(--primary-accent)'}`,
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  fontSize: '13px',
  fontWeight: '600',
  animation: 'slideIn 0.3s ease'
});

const toastCloseStyle = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontSize: '14px'
};