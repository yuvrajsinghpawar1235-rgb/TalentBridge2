import React, { useState } from 'react';

export default function KanbanPreview() {
  const [pipeline, setPipeline] = useState({
    Sourced: [
      { id: 1, name: 'Alex Morgan', role: 'Senior Frontend Engineer' },
      { id: 2, name: 'David Miller', role: 'Lead Product Designer' }
    ],
    InReview: [
      { id: 3, name: 'Sarah Chen', role: 'Fullstack Specialist' }
    ],
    OfferExtended: [
      { id: 4, name: 'Jessica Taylor', role: 'Backend Engineer' }
    ]
  });

  return (
    <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', marginTop: '30px' }}>
      {/* Mock Terminal Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>talentbridge.app/recruiter/pipeline</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '12px', backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)' }}>
          ● Live Interactive Mode
        </span>
      </div>

      {/* Kanban Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Sourced Column */}
        <div style={colStyle}>
          <div style={colHeaderStyle}>
            <span>Sourced</span>
            <span style={countBadgeStyle}>{pipeline.Sourced.length}</span>
          </div>
          {pipeline.Sourced.map(candidate => (
            <div key={candidate.id} style={candidateCardStyle}>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{candidate.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{candidate.role}</div>
            </div>
          ))}
        </div>

        {/* In Technical Review Column */}
        <div style={colStyle}>
          <div style={colHeaderStyle}>
            <span>In Technical Review</span>
            <span style={{ ...countBadgeStyle, backgroundColor: 'rgba(168, 85, 247, 0.2)', color: 'var(--accent-purple)' }}>{pipeline.InReview.length}</span>
          </div>
          {pipeline.InReview.map(candidate => (
            <div key={candidate.id} style={candidateCardStyle}>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{candidate.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{candidate.role}</div>
            </div>
          ))}
        </div>

        {/* Offer Extended Column */}
        <div style={colStyle}>
          <div style={colHeaderStyle}>
            <span>Offer Extended</span>
            <span style={{ ...countBadgeStyle, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)' }}>{pipeline.OfferExtended.length}</span>
          </div>
          {pipeline.OfferExtended.map(candidate => (
            <div key={candidate.id} style={candidateCardStyle}>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{candidate.name}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{candidate.role}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const colStyle = { backgroundColor: 'var(--bg-main)', borderRadius: '12px', padding: '14px', border: '1px solid var(--border-color)' };
const colHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '700', fontSize: '13px', marginBottom: '12px', color: 'var(--text-primary)' };
const countBadgeStyle = { backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', borderRadius: '10px', padding: '2px 8px', fontSize: '11px' };
const candidateCardStyle = { backgroundColor: 'var(--bg-card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '10px' };