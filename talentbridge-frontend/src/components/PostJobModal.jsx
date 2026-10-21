import React, { useState } from 'react';

export default function PostJobModal({ isOpen, onClose, onJobPosted }) {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    companyDescription: '',
    description: '',
    requirements: '',
    location: '',
    type: 'Full-Time',
    salaryRange: '',
    experienceLevel: 'Entry-Level'
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to post job');
      }

      onJobPosted();
      onClose();
      setFormData({
        title: '',
        companyName: '',
        companyDescription: '',
        description: '',
        requirements: '',
        location: '',
        type: 'Full-Time',
        salaryRange: '',
        experienceLevel: 'Entry-Level'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Post a New Job Opening</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label>Job Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="e.g. Senior Frontend Engineer" />
          </div>

          <div style={inputGroupStyle}>
            <label>Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required style={inputStyle} placeholder="e.g. TechCorp Solutions" />
          </div>

          <div style={inputGroupStyle}>
            <label>About the Company</label>
            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows={2} style={inputStyle} placeholder="Brief company overview..." />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required style={inputStyle} placeholder="e.g. Remote / New York" />
            </div>

            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <label>Salary Range</label>
              <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} required style={inputStyle} placeholder="e.g. $100k - $130k" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <label>Job Type</label>
              <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div style={{ ...inputGroupStyle, flex: 1 }}>
              <label>Experience Level</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} style={inputStyle}>
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior-Level">Senior-Level</option>
              </select>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label>Role Summary & Overview</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} style={inputStyle} placeholder="General role responsibilities..." />
          </div>

          <div style={inputGroupStyle}>
            <label>Requirements & Qualifications</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} style={inputStyle} placeholder="Key technical skills, qualifications, degree requirements..." />
          </div>

          <button type="submit" style={submitBtnStyle}>Post Job Opportunity</button>
        </form>

        <button onClick={onClose} style={closeBtnStyle}>Cancel</button>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: 'var(--bg-card, #fff)', color: 'var(--text-primary)', padding: '25px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)' };
const inputGroupStyle = { marginBottom: '12px', display: 'flex', flexDirection: 'column' };
const inputStyle = { padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' };
const submitBtnStyle = { width: '100%', padding: '10px', backgroundColor: 'var(--accent-green, #10b981)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };
const closeBtnStyle = { marginTop: '8px', width: '100%', padding: '8px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' };