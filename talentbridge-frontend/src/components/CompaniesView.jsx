import React, { useState, useMemo } from 'react';

// Rich standalone list of partner companies
const MOCK_PARTNER_COMPANIES = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    industry: 'Software & Cloud Engineering',
    location: 'San Francisco, CA / Remote',
    size: '500 - 1,000 Employees',
    verified: true,
    description: 'Empowering enterprises through distributed cloud architecture and intelligent AI platforms using React and Spring Boot.',
    perks: ['Remote-First', 'Flexible PTO', 'Health & Wellness', 'Equity / Stock Options']
  },
  {
    id: 2,
    name: 'FinFlow Global',
    industry: 'FinTech Systems',
    location: 'New York, NY',
    size: '1,000 - 5,000 Employees',
    verified: true,
    description: 'Building high-performance microservices and secure banking transaction pipelines with Spring Boot and MySQL.',
    perks: ['Competitive Salary', '401(k) Matching', 'Learning Stipend']
  },
  {
    id: 3,
    name: 'Neural Systems AI',
    industry: 'Artificial Intelligence & ML',
    location: 'Austin, TX',
    size: '100 - 500 Employees',
    verified: true,
    description: 'Developing deep learning pipelines, computer vision models, and LLM integration tools using Python and PyTorch.',
    perks: ['Cutting-edge Tech', 'Hybrid Work', 'Health Coverage']
  },
  {
    id: 4,
    name: 'CloudScale Inc.',
    industry: 'Cloud Infrastructure & DevOps',
    location: 'Seattle, WA',
    size: '250 - 500 Employees',
    verified: false,
    description: 'Managing global AWS infrastructure, Kubernetes clusters, and automated CI/CD deployment pipelines.',
    perks: ['Fully Remote', 'Home Office Stipend', 'Unlimited PTO']
  }
];

export default function CompaniesView({ jobs = [], onSelectCompany }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');

  // Compute active companies and dynamically count jobs assigned to each company name
  const companiesList = useMemo(() => {
    return MOCK_PARTNER_COMPANIES.map((company) => {
      const matchingJobs = jobs.filter((job) => {
        const jobCompany = (job.companyName || job.company || '').toLowerCase();
        return jobCompany.includes(company.name.toLowerCase());
      });

      return {
        ...company,
        activeJobsCount: matchingJobs.length > 0 ? matchingJobs.length : 1
      };
    });
  }, [jobs]);

  // Filter companies based on search input and industry filter
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
      {/* Header Banner */}
      <div style={bannerStyle}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', color: 'var(--text-primary)' }}>Partner Companies Directory</h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Explore verified employers, read company cultures, and browse open positions by organization.
          </p>
        </div>
        <span style={badgeStyle}>🏢 {companiesList.length} Partner Organizations</span>
      </div>

      {/* Search & Filter Controls */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search companies by name, industry, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
        />
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
        >
          <option value="ALL">All Industries</option>
          <option value="Software">Software & Cloud</option>
          <option value="FinTech">FinTech Systems</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Cloud Infrastructure">Cloud Infrastructure</option>
        </select>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          🔍 No companies found matching your search.
        </div>
      ) : (
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

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {comp.perks?.map((perk, idx) => (
                    <span key={idx} style={perkBadgeStyle}>
                      ✨ {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
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
      )}
    </div>
  );
}

// Helpers & Styles
const bannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const badgeStyle = { fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-accent)', backgroundColor: 'var(--badge-bg)', padding: '6px 14px', borderRadius: '20px' };
const perkBadgeStyle = { fontSize: '11px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-color)' };