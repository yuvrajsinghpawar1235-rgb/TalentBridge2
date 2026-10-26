import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talentbridge2-5.onrender.com';

export default function PostJobModal({ isOpen, onClose, onJobPosted, user }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [experienceLevel, setExperienceLevel] = useState('Mid');
  const [salaryRange, setSalaryRange] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !location.trim() || !description.trim()) {
      if (addToast) addToast('Please fill out all required fields!', 'error');
      return;
    }

    setIsSubmitting(true);

    const companyName = user?.companyName || user?.company || user?.name || 'Partner Company';

    const jobPayload = {
      title: title.trim(),
      companyName: companyName,
      location: location.trim(),
      type,
      workplaceType,
      experienceLevel,
      salaryRange: salaryRange.trim() || 'Competitive / Unspecified',
      description: description.trim(),
      status: 'Active',
      postedDate: new Date().toISOString().split('T')[0]
    };

    try {
      // Send POST request directly to MySQL Spring Boot backend
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to persist job listing to backend database.');
      }

      const savedJob = await response.json();

      // Trigger parent callback with live MySQL record
      if (onJobPosted) {
        onJobPosted(savedJob);
      }

      if (addToast) addToast('🎉 Job listing published successfully to live database!', 'success');

      // Reset form fields
      setTitle('');
      setLocation('');
      setSalaryRange('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error('Error posting job to database:', err);
      if (addToast) {
        addToast(`Error: ${err.message}`, 'error');
      } else {
        alert(`Error publishing job: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>💼 Post a New Job Opportunity</h3>
          <button onClick={onClose} style={closeXStyle}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Job Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Java Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Employment Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Workplace Setup</label>
              <select value={workplaceType} onChange={(e) => setWorkplaceType(e.target.value)} style={inputStyle}>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Experience Level</label>
              <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} style={inputStyle}>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior Level</option>
                <option value="Lead">Lead / Staff</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Location *</label>
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
            <label style={labelStyle}>Salary Range</label>
            <input
              type="text"
              placeholder="e.g. $120,000 - $145,000"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Job Description *</label>
            <textarea
              rows={4}
              required
              placeholder="Outline responsibilities, requirements, and qualifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--accent-green)' }} disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Job Listing →'}
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