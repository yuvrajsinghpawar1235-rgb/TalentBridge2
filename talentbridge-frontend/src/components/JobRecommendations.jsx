// src/components/JobRecommendations.jsx
import React, { useMemo } from 'react';
import { Card } from './ui-kit';

export const JobRecommendations = ({ candidateSkills = '', allJobs = [] }) => {
  const recommendedJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];

    // Standardize skills into a lowercase array whether passed as an array or comma-separated string
    let skillsList = [];
    if (Array.isArray(candidateSkills)) {
      skillsList = candidateSkills.map(s => s.toLowerCase().trim());
    } else if (typeof candidateSkills === 'string' && candidateSkills.trim().length > 0) {
      skillsList = candidateSkills.toLowerCase().split(',').map(s => s.trim());
    }

    if (skillsList.length === 0) return allJobs.slice(0, 3);

    return allJobs
      .map(job => {
        const jobDesc = `${job.title || ''} ${job.description || ''} ${
          Array.isArray(job.skills) ? job.skills.join(' ') : job.skills || ''
        }`.toLowerCase();

        const matchCount = skillsList.filter(skill => skill && jobDesc.includes(skill)).length;
        return { ...job, matchCount };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3); // Top 3 matches
  }, [candidateSkills, allJobs]);

  if (!allJobs || allJobs.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recommended For You 🔥</h3>
        <Card className="p-6 text-center text-gray-500 dark:text-gray-400">
          No job listings currently available in the database for recommendations.
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recommended For You 🔥</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedJobs.map(job => (
          <Card key={job.id || job.title} className="p-4 border shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-lg text-primary-600">{job.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              📍 {job.location || 'Remote'} • 💼 {job.type || 'Full-Time'}
            </p>
            <p className="mt-2 text-xs text-green-600 font-semibold">
              {job.matchCount > 0 ? `${job.matchCount} matching skills` : 'General recommendation'}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};