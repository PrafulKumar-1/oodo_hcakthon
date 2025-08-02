import React, { useState, useEffect } from 'react';
import { issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();

  const fetchAllIssues = () => {
    // For admins, we fetch all issues without location constraints.
    // We can use the same getIssues endpoint by not providing location params.
    // A dedicated admin endpoint would be better for a larger app.
    issueService.getIssues({})
      .then(response => {
        setIssues(response.data);
      })
      .catch(() => setError('Failed to fetch issues.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issueService.updateIssueStatus(issueId, newStatus);
      // Update the status locally to reflect the change immediately
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button onClick={logout} className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-600">
          Logout
        </button>
      </header>
      <main className="p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Reported Issues</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {issues.map(issue => (
                  <tr key={issue.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.reporter?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="REPORTED">Reported</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
