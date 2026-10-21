// src/components/JobRecommendations.jsx
import React, { useMemo } from 'react';
import { Card } from './ui-kit';

export const JobRecommendations = ({ candidateSkills = '', allJobs = [] }) => {
  const recommendedJobs = useMemo(() => {
    if (!candidateSkills) return allJobs.slice(0, 3);
    const skillsList = candidateSkills.toLowerCase().split(',').map(s => s.trim());

    return allJobs
      .map(job => {
        const jobDesc = (job.description + ' ' + job.title).toLowerCase();
        const matchCount = skillsList.filter(skill => jobDesc.includes(skill)).length;
        return { ...job, matchCount };
      })
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3); // Top 3 matches
  }, [candidateSkills, allJobs]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recommended For You 🔥</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedJobs.map(job => (
          <Card key={job.id} className="p-4 border shadow-sm hover:shadow-md transition">
            <h4 className="font-bold text-lg text-primary-600">{job.title}</h4>
            <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
            <p className="mt-2 text-xs text-green-600 font-semibold">
              {job.matchCount > 0 ? `${job.matchCount} matching skills` : 'General recommendation'}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};