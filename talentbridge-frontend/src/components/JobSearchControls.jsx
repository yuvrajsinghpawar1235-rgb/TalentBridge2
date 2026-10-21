import React, { useState, useMemo } from 'react';

export default function JobSearchControls({ jobs = [], onApplyJob, onToggleSaveJob, savedJobs = [] }) {
  // 1. SEARCH & FILTER STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [workplaceType, setWorkplaceType] = useState('ALL');
  const [experienceLevel, setExperienceLevel] = useState('ALL');

  // 2. SORTING STATE
  const [sortBy, setSortBy] = useState('NEWEST');

  // 3. PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  // Filtering Logic
  const filteredJobs = useMemo(() => {
    return safeJobs.filter((job) => {
      const matchesSearch =
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.companyName && job.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation = locationFilter === 'ALL' || (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));
      const matchesType = typeFilter === 'ALL' || job.type === typeFilter;
      const matchesWorkplace = workplaceType === 'ALL' || job.workplaceType === workplaceType;
      const matchesExperience = experienceLevel === 'ALL' || job.experienceLevel === experienceLevel;

      return matchesSearch && matchesLocation && matchesType && matchesWorkplace && matchesExperience;
    });
  }, [safeJobs, searchTerm, locationFilter, typeFilter, workplaceType, experienceLevel]);

  // Sorting Logic
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...filteredJobs];
    if (sortBy === 'NEWEST') {
      return jobsCopy.sort((a, b) => new Date(b.postedDate || '2026-10-01') - new Date(a.postedDate || '2026-10-01'));
    }
    if (sortBy === 'SALARY_HIGH_LOW') {
      return jobsCopy.sort((a, b) => (b.salaryMin || 0) - (a.salaryMin || 0));
    }
    if (sortBy === 'TITLE_ASC') {
      return jobsCopy.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }
    return jobsCopy;
  }, [filteredJobs, sortBy]);

  // Pagination Calculations
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedJobs, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setLocationFilter('ALL');
    setTypeFilter('ALL');
    setWorkplaceType('ALL');
    setExperienceLevel('ALL');
    setSortBy('NEWEST');
    setCurrentPage(1);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="🔍 Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button className="btn-secondary" onClick={handleResetFilters} style={{ whiteSpace: 'nowrap', fontSize: '13px' }}>
            🔄 Reset Filters
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Job Type</label>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={selectStyle}>
              <option value="ALL">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Workplace Mode</label>
            <select value={workplaceType} onChange={(e) => { setWorkplaceType(e.target.value); setCurrentPage(1); }} style={selectStyle}>
              <option value="ALL">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Experience Level</label>
            <select value={experienceLevel} onChange={(e) => { setExperienceLevel(e.target.value); setCurrentPage(1); }} style={selectStyle}>
              <option value="ALL">All Experience</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
              <option value="NEWEST">📅 Newest First</option>
              <option value="SALARY_HIGH_LOW">💰 Highest Salary</option>
              <option value="TITLE_ASC">🔤 Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>
          Available Opportunities ({sortedJobs.length})
        </h3>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Listings */}
      {paginatedJobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          🔍 No jobs found matching your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
          {paginatedJobs.map((job) => {
            const isSaved = Array.isArray(savedJobs) && savedJobs.some((s) => s.id === job.id);
            return (
              <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span style={badgeStyle}>{job.type || 'Full-Time'}</span>
                    <span style={{ ...badgeStyle, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)' }}>
                      {job.workplaceType || 'Remote'}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: 'var(--primary-accent)' }}>{job.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                    🏢 {job.companyName || 'TalentBridge Partner'} • 📍 {job.location} • 💰 {job.salaryRange || '$100k - $120k'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {onToggleSaveJob && (
                    <button className="btn-secondary" onClick={() => onToggleSaveJob(job)}>
                      {isSaved ? '⭐ Saved' : 'Bookmark ⭐'}
                    </button>
                  )}
                  {onApplyJob && (
                    <button className="btn-primary" onClick={() => onApplyJob(job)}>
                      Apply Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <button
            className="btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: pageNum === currentPage ? 'var(--primary-accent)' : 'var(--bg-card)',
                color: pageNum === currentPage ? '#fff' : 'var(--text-primary)',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {pageNum}
            </button>
          ))}

          <button
            className="btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

const labelStyle = { fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' };
const selectStyle = { width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' };
const badgeStyle = { backgroundColor: 'var(--badge-bg)', color: 'var(--primary-accent)', fontSize: '11px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '10px' };