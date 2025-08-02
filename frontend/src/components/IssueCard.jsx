import React from 'react';

const IssueCard = ({ issue }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'REPORTED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-lg text-gray-800">{issue.title}</h4>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
          {issue.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-gray-600 mt-2">{issue.description}</p>
      <div className="text-sm text-gray-500 mt-3">
        <span>Category: <span className="font-medium text-gray-700">{issue.category}</span></span>
      </div>
    </div>
  );
};

export default IssueCard;
