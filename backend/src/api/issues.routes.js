const express = require('express');
const { createIssue, getIssues, updateIssueStatus } = require('../controllers/issues.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware'); // <-- Import the new admin middleware

const router = express.Router();

// @route   GET /api/issues & POST /api/issues
// @desc    Get issues by radius & Create a new issue
// @access  Private
router.route('/').get(protect, getIssues).post(protect, createIssue);


// @route   PATCH /api/issues/:id/status
// @desc    Update the status of an issue
// @access  Private/Admin
router.patch('/:id/status', protect, isAdmin, updateIssueStatus);


module.exports = router;
