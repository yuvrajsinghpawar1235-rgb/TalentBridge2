import React, { useState, useMemo } from 'react';

// Default base companies
const BASE_COMPANIES = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Software & Cloud Engineering',
    location: 'San Francisco, CA / Remote',
    size: '500 - 1,000 Employees',
    verified: true,
    description: 'Empowering enterprises through distributed cloud architecture.',
    perks: ['Remote-First', 'Flexible PTO', 'Equity']
  },
  {
    id: 2,
    name: 'FinFlow Global',
    industry: 'FinTech Systems',
    location: 'New York, NY',
    size: '1,000 - 5,000 Employees',
    verified: true,
    description: 'High-performance microservices and secure banking transaction pipelines.',
    perks: ['Competitive Salary', '401(k) Matching']
  }
];

export default function CompaniesView({ jobs = [], onSelectCompany }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');

  // Extract all unique companies dynamically from published jobs
  const companiesList = useMemo(() => {
    const map = new Map();

    // 1. Add base companies
    BASE_COMPANIES.forEach((c) => map.set(c.name.toLowerCase(), { ...c }));

    // 2. Discover new companies dynamically from posted jobs
    jobs.forEach((job) => {
      const companyName = job.companyName || job.company || job.company_name;
      if (companyName) {
        const key = companyName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            id: Date.now() + Math.random(),
            name: companyName,
            industry: 'Technology & Services',
            location: job.location || 'Remote',
            size: 'Growing Company',
            verified: true,
            description: `Active recruiting partner offering high-impact roles.`,
            perks: ['Growth Stage', 'Competitive Benefits']
          });
        }
      }
    });

    // 3. Attach accurate active job count
    return Array.from(map.values()).map((comp) => {
      const activeCount = jobs.filter((job) => {
        const jobComp = (job.companyName || job.company || job.company_name || '').toLowerCase();
        return jobComp === comp.name.toLowerCase();
      }).length;

      return {
        ...comp,
        activeJobsCount: activeCount
      };
    });
  }, [jobs]);

  const filteredCompanies = useMemo(() => {
    return companiesList.filter((comp) => {
      const matchesSearch =
        !searchTerm ||
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry =
        industryFilter === 'ALL' || comp.industry.toLowerCase().includes(industryFilter.toLowerCase());

      return matchesSearch && matchesIndustry;
    });
  }, [companiesList, searchTerm, industryFilter]);

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={bannerStyle}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', color: 'var(--text-primary)' }}>Partner Companies Directory</h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Explore verified employers and discover open positions.
          </p>
        </div>
        <span style={badgeStyle}>🏢 {companiesList.length} Partner Organizations</span>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredCompanies.map((comp) => (
          <div key={comp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary-accent)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--primary-accent)' }}>{comp.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{comp.industry}</span>
                </div>
                {comp.verified && (
                  <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)', fontWeight: 'bold', padding: '3px 8px', borderRadius: '10px' }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                📍 {comp.location} • 👥 {comp.size}
              </p>

              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                {comp.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-purple)' }}>
                💼 {comp.activeJobsCount} Active Job{comp.activeJobsCount === 1 ? '' : 's'}
              </span>
              <button
                className="btn-primary"
                onClick={() => onSelectCompany && onSelectCompany(comp.name)}
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                View Open Jobs →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const bannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const badgeStyle = { fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-accent)', backgroundColor: 'var(--badge-bg)', padding: '6px 14px', borderRadius: '20px' };