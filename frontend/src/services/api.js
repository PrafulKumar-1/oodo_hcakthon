import axios from 'axios';

// The base URL for our backend API
const API_URL = 'http://localhost:5000/api';

// Create an Axios instance for making API requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor to add the auth token to every request if it exists.
 * This runs before each request is sent.
 */
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
      // Add the token to the Authorization header
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Service for user authentication.
 */
export const authService = {
  /**
   * Registers a new user.
   * @param {object} userData - { name, email, password }
   * @returns {Promise<object>} The registered user data.
   */
  register: (userData) => api.post('/users/register', userData),

  /**
   * Logs in a user.
   * @param {object} credentials - { email, password }
   * @returns {Promise<object>} The user data and token.
   */
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data && response.data.token) {
      // Store user details and token in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  /**
   * Logs out the user by removing their data from local storage.
   */
  logout: () => {
    localStorage.removeItem('user');
  },
};

/**
 * Service for managing civic issues.
 */
export const issueService = {
  /**
   * Creates a new issue.
   * @param {object} issueData - { title, description, category, latitude, longitude }
   * @returns {Promise<object>} The created issue data.
   */
  createIssue: (issueData) => api.post('/issues', issueData),

  /**
   * Fetches issues within a specified radius.
   * @param {object} params - { lat, lon, radius }
   * @returns {Promise<Array>} A list of issues.
   */
  getIssues: (params) => api.get('/issues', { params }),
};
