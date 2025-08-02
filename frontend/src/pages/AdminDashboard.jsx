import React, { useState, useEffect } from 'react';
import { issueService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiRefreshCw, FiFilter, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

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

  // Animation and UI state
  const [isVisible, setIsVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAllIssues();
  };

  const filteredIssues = issues.filter(issue => {
    // Apply status filter
    if (statusFilter !== 'ALL' && issue.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchTerm && !issue.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'REPORTED':
        return <FiAlertTriangle className="text-yellow-500" />;
      case 'IN_PROGRESS':
        return <FiClock className="text-blue-500" />;
      case 'RESOLVED':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'REPORTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-16">
      <main className="container mx-auto px-4 py-8">
        <div className={`bg-white rounded-xl shadow-xl p-6 apple-card ${isVisible ? 'scale-in' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-4 md:mb-0 flex items-center">
              <span className="mr-2">🛡️</span> Admin Control Center
            </h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleRefresh} 
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 apple-button"
                disabled={loading}
              >
                <FiRefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-4">No issues found matching your filters.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-green-700 mb-6">All Reported Issues</h2>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredIssues.map(issue => (
                        <tr key={issue.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{new Date(issue.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {issue.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {issue.reporter?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(issue.status)}`}>
                              <span className="flex items-center">
                                {getStatusIcon(issue.status)}
                                <span className="ml-1">{issue.status.replace('_', ' ')}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select
                              value={issue.status}
                              onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
