const User = require('../models/User');

// Get all tutors
const getTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: 'tutor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Error fetching tutors' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, subjects, hourlyRate, bio, education, experience, availability } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.subjects = subjects || user.subjects;
    user.hourlyRate = hourlyRate || user.hourlyRate;
    user.bio = bio || user.bio;
    user.education = education || user.education;
    user.experience = experience || user.experience;
    user.availability = availability || user.availability;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// Export all controller functions
module.exports = {
  getTutors,
  getUserProfile,
  updateUserProfile
}; 