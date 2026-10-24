import React, { useState } from 'react';

export default function CompaniesView({ jobs = [], onSelectCompany }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample verified partner companies
  const sampleCompanies = [
    {
      id: 'c1',
      name: 'TechCorp Solutions',
      shortKey: 'techcorp',
      industry: 'Software & Cloud Engineering',
      location: 'San Francisco, CA / Remote',
      size: '500-1,000 employees',
      logo: '🚀',
      description: 'Building next-generation distributed systems, cloud infrastructure, and AI tools for enterprise teams worldwide.',
      defaultJobCount: 4
    },
    {
      id: 'c2',
      name: 'AIG Innovations',
      shortKey: 'aig',
      industry: 'Healthcare Technology',
      location: 'Hyderabad, India',
      size: '1,000+ employees',
      logo: '🏥',
      description: 'Pioneering smart healthcare platforms, AI-assisted diagnostics, and integrated hospital management systems.',
      defaultJobCount: 3
    },
    {
      id: 'c3',
      name: 'FinFlow Global',
      shortKey: 'finflow',
      industry: 'Fintech & Digital Banking',
      location: 'New York, NY / Hybrid',
      size: '250-500 employees',
      logo: '💳',
      description: 'Transforming financial technology through secure payment APIs, real-time analytics, and automated compliance.',
      defaultJobCount: 2
    }
  ];

  const filteredCompanies = sampleCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main style={{ marginTop: '30px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', color: 'var(--text-primary)' }}>Partner Companies</h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
            Explore verified organizations hiring talent on TalentBridge.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by company name or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Grid */}
      <div style={gridStyle}>
        {filteredCompanies.map((company) => {
          // 1. Calculate live job count from database matching
          const liveMatchedJobs = jobs.filter((job) => {
            if (!job.companyName) return false;
            const jName = job.companyName.toLowerCase();
            const cName = company.name.toLowerCase();
            const shortK = company.shortKey.toLowerCase();
            return jName.includes(cName) || cName.includes(jName) || jName.includes(shortK);
          });

          // 2. Use live count if available, otherwise fallback to default count
          const companyJobCount = liveMatchedJobs.length > 0 ? liveMatchedJobs.length : company.defaultJobCount;

          return (
            <div key={company.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={logoContainerStyle}>{company.logo}</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>{company.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--primary-accent)', fontWeight: '600' }}>
                      {company.industry}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 15px 0' }}>
                  {company.description}
                </p>

                <div style={metaGroupStyle}>
                  <span style={metaItemStyle}>📍 {company.location}</span>
                  <span style={metaItemStyle}>👥 {company.size}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-green)' }}>
                  ● {companyJobCount} Active {companyJobCount === 1 ? 'Opening' : 'Openings'}
                </span>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => onSelectCompany(company.shortKey || company.name)}
                >
                  View Company Jobs →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' };
const logoContainerStyle = { width: '44px', height: '44px', borderRadius: '10px', backgroundColor: 'var(--badge-bg)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px' };
const metaGroupStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' };
const metaItemStyle = { display: 'flex', alignItems: 'center', gap: '6px' };
const searchInputStyle = { padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', width: '300px' };