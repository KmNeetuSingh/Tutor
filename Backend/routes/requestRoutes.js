const express = require("express");
const {
  createRequest,
  getRequests,
  getTutorRequests,
  acceptRequest,
  rejectRequest,
  applyToRequest,
  scheduleSession,
  getMyRequests,
  deleteRequest,
  getOpenRequests
} = require("../controllers/requestController");

const {authMiddleware} = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Request = require("../models/Request");
const User = require("../models/User");

const router = express.Router();

router.use(authMiddleware);
router.post("/", roleMiddleware(["student"]), createRequest);
router.get("/", getRequests);
router.get("/my-requests", getMyRequests);
router.get("/tutor", roleMiddleware(["tutor"]), getTutorRequests);
router.post("/:id/accept", roleMiddleware(["tutor"]), acceptRequest);
router.post("/:id/reject", roleMiddleware(["tutor"]), rejectRequest);
router.post("/apply/:id", roleMiddleware(["tutor"]), applyToRequest);
router.post("/schedule/:id", roleMiddleware(["tutor"]), scheduleSession);
router.delete("/:id", deleteRequest);

// Get all open requests (for tutors)
router.get("/open", roleMiddleware(["tutor"]), getOpenRequests);

// Save a request
router.post('/:id/save', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user.savedRequests.includes(request._id)) {
      user.savedRequests.push(request._id);
      await user.save();
    }

    res.json({ message: 'Request saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unsave a request
router.delete('/:id/save', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedRequests = user.savedRequests.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.json({ message: 'Request unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
