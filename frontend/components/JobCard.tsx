"use client";

import React from "react";

interface JobCardProps {
  title: string;
  description: string;
  skills: string[];
  postedBy?: string;
  onApply?: () => void;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  title,
  description,
  skills,
  postedBy,
  onApply,
  showApplyButton = false,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border mb-4">
      <h2 className="text-xl font-bold text-blue-700">{title}</h2>
      <p className="text-gray-700 my-2">{description}</p>
      <div className="text-sm text-gray-600">
        <strong>Skills:</strong> {skills.join(", ")}
      </div>
      {postedBy && <p className="text-sm text-gray-500 mt-1">Posted by: {postedBy}</p>}
      {showApplyButton && (
        <button
          onClick={onApply}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Apply
        </button>
      )}
    </div>
  );
};

export default JobCard;
