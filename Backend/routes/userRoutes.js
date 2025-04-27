const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const {authMiddleware} = require('../middleware/authMiddleware');

// Get all tutors
router.get('/tutors', authMiddleware, userController.getTutors);

// Get user profile
router.get('/:id', authMiddleware, userController.getUserProfile);

// Update user profile
router.put('/:id', authMiddleware, userController.updateUserProfile);

module.exports = router; 