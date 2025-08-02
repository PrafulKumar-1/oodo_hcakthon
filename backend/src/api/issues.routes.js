const express = require('express');
const { createIssue, getIssues } = require('../controllers/issues.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// @route   POST /api/issues
// @desc    Create a new civic issue
// @access  Private (requires authentication)
router.post('/', protect, createIssue);

// @route   GET /api/issues
// @desc    Get civic issues within a radius
// @access  Private (requires authentication)
router.get('/', protect, getIssues);


module.exports = router;
