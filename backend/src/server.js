const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors'); // <-- Import the cors package

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const userRoutes = require('./api/users.routes');
const issueRoutes = require('./api/issues.routes');

// --- Middleware Setup ---

// Enable CORS for all routes
app.use(cors()); // <-- Add this line

// Middleware to parse JSON bodies
app.use(express.json());

// Use morgan for request logging
app.use(morgan('dev'));


// --- API Routes ---

// A simple test route
app.get('/api', (req, res) => {
  res.send('Civic Track API is running!');
});

// Use the defined routes
app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
