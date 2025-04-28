// tutorRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getTutorProfile,
  updateTutorProfile,
  getAllTutorProfiles,
  getTutorProfileById,
  deleteTutorProfile
} = require('../controllers/tutorController');
const { authMiddleware, checkRole } = require('../middleware/authMiddleware');  // Combined import

// Public route to get tutor profile by ID (no authentication required)
router.get('/profiles/:id', getTutorProfileById);

// Protected routes for tutors (authentication and role check required)
router.get('/profile', authMiddleware, checkRole(['tutor']), getTutorProfile);
router.put('/profile', authMiddleware, checkRole(['tutor']), updateTutorProfile);
router.delete('/profile', authMiddleware, checkRole(['tutor']), deleteTutorProfile);

// Admin route to get all tutor profiles (authentication and admin role required)
router.get('/profiles', authMiddleware, checkRole(['tutor']), getAllTutorProfiles);

module.exports = router;
