const express = require('express');
const router = express.Router();
const { addQuestion, getQuestions, deleteQuestion, bulkUploadStreakQuestions } = require('../controllers/adminController');
const { 
	bulkUploadProblems, 
	deleteAllProblems, 
	getAllProblemsAdmin 
} = require('../controllers/practiceAdminController');
const { auth, isAdmin } = require('../middleware/auth');

// ===============================
// STREAK QUESTIONS ADMIN ROUTES
// ===============================

// Add new streak question
router.post('/add-question', addQuestion);

// Bulk upload streak questions
router.post('/streak/bulk-upload', auth, isAdmin, bulkUploadStreakQuestions);

// Fetch all streak questions
router.get('/get-questions', getQuestions);

// Delete a streak question
router.delete('/delete-question/:id', deleteQuestion);

// ===============================
// PRACTICE PROBLEMS ADMIN ROUTES
// ===============================

// Bulk upload practice problems
router.post('/practice/bulk-upload', auth, isAdmin, bulkUploadProblems);

// Get all practice problems (admin view)
router.get('/practice/problems', auth, isAdmin, getAllProblemsAdmin);

// Delete all practice problems (use with caution!)
router.delete('/practice/delete-all', auth, isAdmin, deleteAllProblems);

module.exports = router;
