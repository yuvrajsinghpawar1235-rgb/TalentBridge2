import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talentbridge2-5.onrender.com';

export default function RegisterCompanyModal({ isOpen, onClose, onCompanyRegistered }) {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Software & Engineering');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('10 - 50 Employees');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName.trim() || !location.trim()) {
      addToast('Please provide a company name and location!', 'error');
      return;
    }

    setIsSubmitting(true);

    const newCompanyPayload = {
      name: companyName.trim(),
      industry,
      location: location.trim(),
      size,
      verified: true,
      description: description.trim() || 'Verified recruiting partner active on TalentBridge.',
      perks: ['Growth Stage', 'Innovative Culture', 'Competitive Benefits']
    };

    try {
      // 1. Send POST request to backend API
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompanyPayload)
      });

      let savedCompany = { ...newCompanyPayload, id: Date.now() };
      if (response.ok) {
        savedCompany = await response.json();
      }

      if (onCompanyRegistered) {
        onCompanyRegistered(savedCompany);
      }

      addToast(`🎉 Company "${companyName}" registered successfully!`, 'success');
      setCompanyName('');
      setLocation('');
      setDescription('');
      onClose();
    } catch (err) {
      console.warn('Backend database POST failed for company registration, saving locally:', err);
      if (onCompanyRegistered) {
        onCompanyRegistered({ ...newCompanyPayload, id: Date.now() });
      }
      addToast(`🎉 Company "${companyName}" registered successfully!`, 'success');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>🏢 Register & Launch Company Profile</h3>
          <button onClick={onClose} style={closeXStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Innovations"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Industry Category</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} style={inputStyle}>
                <option value="Software & Engineering">Software & Engineering</option>
                <option value="FinTech Systems">FinTech Systems</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Healthcare Tech">Healthcare Tech</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Headquarters / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Company Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)} style={inputStyle}>
              <option value="1 - 10 Employees">1 - 10 Employees</option>
              <option value="10 - 50 Employees">10 - 50 Employees</option>
              <option value="50 - 250 Employees">50 - 250 Employees</option>
              <option value="500+ Employees">500+ Employees</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Company Overview</label>
            <textarea
              rows={3}
              placeholder="Briefly describe your company culture, mission, or key products..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--primary-accent)' }} disabled={isSubmitting}>
              {isSubmitting ? 'Launching...' : 'Launch Company Profile →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '24px', borderRadius: '14px', width: '500px', maxWidth: '90vw', color: 'var(--text-primary)' };
const labelStyle = { fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' };
const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' };
const closeXStyle = { background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '18px', cursor: 'pointer' };