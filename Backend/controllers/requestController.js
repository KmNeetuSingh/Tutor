const mongoose = require("mongoose");
const Request = require("../models/Request");
const { createNotification } = require("./notificationController");

const createRequest = async (req, res) => {
  try {
    console.log("Creating request - User:", req.user, "Body:", req.body);

    const { subject, description, date, time, duration, budget, tutor: tutorId } = req.body;

    if (tutorId && !mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).send("Invalid tutorId");
    }

    const request = new Request({
      student: req.user.id,
      tutor: tutorId ? new  mongoose.Types.ObjectId(tutorId) : null,
      subject,
      description,
      date,
      time,
      duration,
      budget,
      status: "pending"
    });

    await request.save();
    console.log("Request created successfully:", request);

    // Create notification for the tutor
    await createNotification(
      tutorId,
      "new_request",
      "New Tutoring Request",
      `You have received a new tutoring request for ${subject}`,
      req.user.id,
      request._id
    );

    res.status(201).json(request);
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ message: "Server error while creating request" });
  }
};

const getRequests = async (req, res) => {
  try {
    console.log("Fetching all requests...");
    const requests = await Request.find()
      .populate("student", "name")
      .populate("tutor", "name");
    console.log("Fetched requests:", requests.length);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Server error while fetching requests" });
  }
};

const getMyRequests = async (req, res) => {
  try {
    console.log("Fetching requests for user:", req.user.id);
    let requests;

    if (req.user.role === 'student') {
      requests = await Request.find({ student: req.user.id })
        .populate('tutor', 'name email')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'tutor') {
      requests = await Request.find({ tutor: req.user.id })
        .populate('student', 'name email')
        .sort({ createdAt: -1 });
    }

    console.log("Fetched user requests:", requests.length);
    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: 'Error fetching requests', error: error.message });
  }
};

const deleteRequest = async (req, res) => {
  try {
    console.log("Deleting request - User:", req.user, "Request ID:", req.params.id);
    const request = await Request.findById(req.params.id);

    if (!request) {
      console.warn("Request not found for ID:", req.params.id);
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.student.toString() !== req.user.id && request.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this request" });
    }

    await Request.findByIdAndDelete(req.params.id);

    const notificationRecipient = request.student.toString() === req.user.id ? request.tutor : request.student;
    await createNotification(
      notificationRecipient,
      "request_deleted",
      "Request Deleted",
      `A tutoring request for ${request.subject} has been deleted`,
      req.user.id,
      request._id
    );

    console.log("Request deleted successfully:", req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error("Error deleting request:", err);
    res.status(500).json({ message: "Server error while deleting request" });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getMyRequests,
  deleteRequest,
};
