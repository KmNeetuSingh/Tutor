const TutorProfile = require("../models/TutorProfile");
const User = require("../models/User");

// Get tutor profile
const getTutorProfile = async (req, res) => {
  try {
    console.log('=== GET Tutor Profile ===');
    console.log('User ID:', req.user.id);

    const profile = await TutorProfile.findOne({ user: req.user.id })
      .populate('user', 'name email')
      .populate('education')
      .populate('experience')
      .populate('availability');

    if (!profile) {
      const user = await User.findById(req.user.id).select('name email role');
      if (!user || user.role !== 'tutor') {
        return res.status(404).json({ message: "Tutor not found" });
      }
      return res.json({
        user,
        message: "No Tutor Profile created yet."
      });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error getting tutor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create or update tutor profile
const updateTutorProfile = async (req, res) => {
  try {
    console.log('=== UPDATE Tutor Profile ===');
    console.log('User ID:', req.user.id);
    console.log('Request Body:', req.body);

    const {
      name,
      email,
      subjects,
      bio,
      hourlyRate,
      education,
      experience,
      availability,
      documents
    } = req.body;

    // Ensure that only the owner or admin can update the profile
    let profile = await TutorProfile.findOne({ user: req.user.id });

    if (!profile && req.user.role !== 'tutor') {
      return res.status(403).json({ message: "You are not authorized to update this profile" });
    }

    if (!profile) {
      // Create a new profile if it doesn't exist
      profile = new TutorProfile({
        user: req.user.id,
        name,
        email,
        subjects,
        bio,
        hourlyRate,
        education,
        experience,
        availability,
        documents
      });
    } else {
      // Update existing profile with the new data
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.subjects = subjects || profile.subjects;
      profile.bio = bio || profile.bio;
      profile.hourlyRate = hourlyRate || profile.hourlyRate;
      profile.education = education || profile.education;
      profile.experience = experience || profile.experience;
      profile.availability = availability || profile.availability;
      profile.documents = documents || profile.documents;
    }

    // Validate the profile before saving
    try {
      await profile.validate();
    } catch (validationError) {
      return res.status(400).json({
        message: "Validation error",
        errors: validationError.errors
      });
    }

    // Save the profile to the database
    await profile.save();

    // Populate and return the updated profile
    const updatedProfile = await TutorProfile.findById(profile._id)
      .populate('user', 'name email')
      .populate('education')
      .populate('experience')
      .populate('availability')
      .lean();  // Use lean() for better performance if necessary

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tutor profiles (for admin)
const getAllTutorProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'rating', sortOrder = -1 } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: parseInt(sortOrder) },
      populate: [
        { path: 'user', select: 'name email' },
        'education',
        'experience',
        'availability'
      ]
    };

    const profiles = await TutorProfile.paginate({}, options);
    res.json(profiles);
  } catch (error) {
    console.error("Error getting all tutor profiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tutor profile by ID (public)
const getTutorProfileById = async (req, res) => {
  try {
    const profile = await TutorProfile.findById(req.params.id)
      .populate('user', 'name email')
      .populate('education')
      .populate('experience')
      .populate('availability');

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error getting tutor profile by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete tutor profile
const deleteTutorProfile = async (req, res) => {
  try {
    const profile = await TutorProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.remove();
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTutorProfile,
  updateTutorProfile,
  getAllTutorProfiles,
  getTutorProfileById,
  deleteTutorProfile
};
