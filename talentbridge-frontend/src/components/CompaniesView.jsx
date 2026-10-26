import React, { useState, useEffect, useMemo } from 'react';
import RegisterCompanyModal from './RegisterCompanyModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talentbridge2-5.onrender.com';

export default function CompaniesView({ jobs = [], onSelectCompany }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [dbCompanies, setDbCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch registered companies dynamically from the MySQL backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/companies`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbCompanies(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to fetch companies from database:", err);
        setIsLoading(false);
      });
  }, []);

  const handleRegisterCompany = (newCompany) => {
    // Optimistically update list upon successful registration
    setDbCompanies((prev) => [newCompany, ...prev]);
  };

  const companiesList = useMemo(() => {
    const map = new Map();

    // Populate strictly from database companies
    dbCompanies.forEach((c) => {
      map.set(c.name.toLowerCase(), {
        id: c.id,
        name: c.name,
        industry: c.industry || 'Technology & Cloud Solutions',
        location: c.location || 'Remote',
        size: c.size || 'Growing Enterprise',
        verified: c.verified ?? true,
        description: c.description || 'Active recruiting partner offering innovative tech opportunities.',
        perks: c.perks || ['Growth Stage', 'Competitive Compensation']
      });
    });

    // Also account for companies found in active jobs if not already listed
    jobs.forEach((job) => {
      const companyName = job.companyName || job.company || job.company_name;
      if (companyName) {
        const key = companyName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            id: Date.now() + Math.random(),
            name: companyName,
            industry: 'Technology & Cloud Solutions',
            location: job.location || 'Remote',
            size: 'Growing Enterprise',
            verified: true,
            description: `Active recruiting partner offering innovative tech opportunities.`,
            perks: ['Growth Stage', 'Competitive Compensation']
          });
        }
      }
    });

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
  }, [jobs, dbCompanies]);

  const filteredCompanies = companiesList.filter((comp) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return comp.name.toLowerCase().includes(term) || (comp.industry && comp.industry.toLowerCase().includes(term));
  });

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={bannerStyle}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '24px', color: 'var(--text-primary)' }}>Partner Companies Directory</h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
            Explore verified employers and discover active openings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={() => setIsRegisterOpen(true)}
            style={{ backgroundColor: 'var(--primary-accent)', padding: '8px 16px', fontSize: '13px' }}
          >
            + Register New Company
          </button>
          <span style={badgeStyle}>🏢 {companiesList.length} Organizations</span>
        </div>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search companies by name or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Loading companies from database...
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No companies registered in the database yet. Click "+ Register New Company" to add one!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredCompanies.map((comp) => (
            <div key={comp.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: '4px solid var(--primary-accent)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--primary-accent)' }}>{comp.name}</h3>
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
      )}

      <RegisterCompanyModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onCompanyRegistered={handleRegisterCompany}
      />
    </div>
  );
}

const bannerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
const badgeStyle = { fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-accent)', backgroundColor: 'var(--badge-bg)', padding: '6px 14px', borderRadius: '20px' };