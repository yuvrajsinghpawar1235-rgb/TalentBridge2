// src/components/CandidateComparisonModal.jsx
import React from 'react';
import { Modal, Button, Badge } from './ui-kit';

export const CandidateComparisonModal = ({ isOpen, onClose, candidateA, candidateB }) => {
  if (!isOpen || !candidateA || !candidateB) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Comparison">
      <div className="grid grid-cols-2 gap-4">
        {/* Candidate A */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-bold text-lg">{candidateA.name}</h3>
          <p className="text-sm text-gray-500">{candidateA.headline || 'No headline provided'}</p>
          <div className="mt-3">
            <span className="font-semibold text-xs uppercase text-gray-400">Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {candidateA.skills ? (
                Array.isArray(candidateA.skills) ? (
                  candidateA.skills.map((skill, i) => <Badge key={i} variant="primary">{skill.trim()}</Badge>)
                ) : (
                  candidateA.skills.split(',').map((skill, i) => <Badge key={i} variant="primary">{skill.trim()}</Badge>)
                )
              ) : (
                <span className="text-xs text-gray-400">No skills listed</span>
              )}
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="font-semibold text-xs uppercase text-gray-400">Profile Completion:</span>
            <p className="font-medium">{candidateA.profileCompletion ?? 0}%</p>
          </div>
        </div>

        {/* Candidate B */}
        <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-bold text-lg">{candidateB.name}</h3>
          <p className="text-sm text-gray-500">{candidateB.headline || 'No headline provided'}</p>
          <div className="mt-3">
            <span className="font-semibold text-xs uppercase text-gray-400">Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {candidateB.skills ? (
                Array.isArray(candidateB.skills) ? (
                  candidateB.skills.map((skill, i) => <Badge key={i} variant="primary">{skill.trim()}</Badge>)
                ) : (
                  candidateB.skills.split(',').map((skill, i) => <Badge key={i} variant="primary">{skill.trim()}</Badge>)
                )
              ) : (
                <span className="text-xs text-gray-400">No skills listed</span>
              )}
            </div>
          </div>
          <div className="mt-3 text-sm">
            <span className="font-semibold text-xs uppercase text-gray-400">Profile Completion:</span>
            <p className="font-medium">{candidateB.profileCompletion ?? 0}%</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onClose} variant="secondary">Close</Button>
      </div>
    </Modal>
  );
};