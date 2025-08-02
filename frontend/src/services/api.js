import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (userData) => api.post('/users/register', userData),
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data && response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
};

export const issueService = {
  createIssue: (issueData) => api.post('/issues', issueData),
  getIssues: (params) => api.get('/issues', { params }),
  /**
   * Updates the status of a specific issue.
   * @param {string} issueId - The ID of the issue to update.
   * @param {string} status - The new status ('REPORTED', 'IN_PROGRESS', 'RESOLVED').
   * @returns {Promise<object>} The updated issue data.
   */
  updateIssueStatus: (issueId, status) => api.patch(`/issues/${issueId}/status`, { status }),
};
