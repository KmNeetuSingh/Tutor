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

const getTutorRequests = async (req, res) => {
  try {
    console.log("Fetching tutor requests for:", req.user.id);
    const requests = await Request.find({ tutor: req.user.id })
      .populate("student", "name")
      .populate("tutor", "name");
    console.log("Fetched tutor requests:", requests.length);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching tutor requests:", err);
    res.status(500).json({ message: "Server error while fetching tutor requests" });
  }
};

const acceptRequest = async (req, res) => {
  try {
    console.log("Accepting request - User:", req.user, "Request ID:", req.params.id);
    const request = await Request.findById(req.params.id);

    if (!request) {
      console.warn("Request not found for ID:", req.params.id);
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not in pending status' });
    }

    request.status = "accepted";
    await request.save();

    await createNotification(
      request.student,
      "request_accepted",
      "Request Accepted",
      `Your tutoring request for ${request.subject} has been accepted`,
      req.user.id,
      request._id
    );

    console.log("Request accepted successfully:", request);
    res.json(request);
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).json({ message: "Server error while accepting request", error: err.message });
  }
};

const rejectRequest = async (req, res) => {
  try {
    console.log("Rejecting request - User:", req.user, "Request ID:", req.params.id);
    const request = await Request.findById(req.params.id);

    if (!request) {
      console.warn("Request not found for ID:", req.params.id);
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.tutor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not in pending status' });
    }

    request.status = "rejected";
    await request.save();

    await createNotification(
      request.student,
      "request_rejected",
      "Request Rejected",
      `Your tutoring request for ${request.subject} has been rejected. Please be available at the requested time or find another tutor.`,
      req.user.id,
      request._id
    );

    console.log("Request rejected successfully:", request);
    res.json(request);
  } catch (err) {
    console.error("Error rejecting request:", err);
    res.status(500).json({ message: "Server error while rejecting request", error: err.message });
  }
};

const applyToRequest = async (req, res) => {
  try {
    console.log("Applying to request - User:", req.user, "Request ID:", req.params.id);
    const request = await Request.findById(req.params.id);
    if (!request) {
      console.warn("Request not found for ID:", req.params.id);
      return res.status(404).json({ message: "Request not found" });
    }

    request.tutor = req.user.id;
    request.status = "applied";

    await request.save();
    console.log("Applied to request successfully:", request);
    res.json(request);
  } catch (err) {
    console.error("Error applying to request:", err);
    res.status(500).json({ message: "Server error while applying to request" });
  }
};

const scheduleSession = async (req, res) => {
  try {
    console.log("Scheduling session - Request ID:", req.params.id, "Body:", req.body);
    const request = await Request.findById(req.params.id);
    if (!request) {
      console.warn("Request not found for scheduling:", req.params.id);
      return res.status(404).json({ message: "Request not found" });
    }

    request.scheduledDate = req.body.scheduledDate;
    request.status = "scheduled";

    await request.save();
    console.log("Session scheduled successfully:", request);
    res.json(request);
  } catch (err) {
    console.error("Error scheduling session:", err);
    res.status(500).json({ message: "Server error while scheduling session" });
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

const getOpenRequests = async (req, res) => {
  try {
    console.log("Fetching open requests...");
    const requests = await Request.find({ status: 'pending' })
      .populate("student", "name")
      .populate("tutor", "name");
    console.log("Fetched open requests:", requests.length);
    res.json(requests);
  } catch (err) {
    console.error("Error fetching open requests:", err);
    res.status(500).json({ message: "Server error while fetching open requests" });
  }
};

module.exports = {
  createRequest,
  getRequests,
  getTutorRequests,
  acceptRequest,
  rejectRequest,
  applyToRequest,
  scheduleSession,
  getMyRequests,
  deleteRequest,
  getOpenRequests,
};
