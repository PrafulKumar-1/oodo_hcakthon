const express = require('express');
const { createIssue, getIssues } = require('../controllers/issues.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Assign controller functions to routes.
// The 'protect' middleware is used to secure these endpoints.
router.route('/').post(protect, createIssue).get(protect, getIssues);

module.exports = router;
