const express = require("express");
const {
  createRequest,
  getRequests,
  getMyRequests,
  deleteRequest
} = require("../controllers/requestController");

const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const Request = require("../models/Request");
const User = require("../models/User");

const router = express.Router();

router.use(authMiddleware);

// Route for creating a new request (only accessible by students)
router.post("/", roleMiddleware(["student"]), createRequest);

// Route for getting all requests (accessible by anyone)
router.get("/", getRequests);

// Route for getting the requests of the logged-in user
router.get("/my-requests", getMyRequests);

// Route for deleting a request (accessible by the student or tutor who created the request)
router.delete("/:id", deleteRequest);

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
