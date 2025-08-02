const express = require('express');
require('dotenv').config();
const morgan = require('morgan'); // <-- Import morgan

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const userRoutes = require('./api/users.routes');
const issueRoutes = require('./api/issues.routes');

// Middleware to parse JSON bodies
app.use(express.json());

// Use morgan for request logging in development
app.use(morgan('dev')); // <-- Add this line

// A simple test route
app.get('/api', (req, res) => {
  res.send('Civic Track API is running!');
});

// Use the defined routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
