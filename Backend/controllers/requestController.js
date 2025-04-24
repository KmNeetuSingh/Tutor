const Request = require("../models/Request");

const createRequest = async (req, res) => {
  try {
    const request = new Request({
      student: req.user.id,
      subject: req.body.subject,
      description: req.body.description,
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("student", "name");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const applyToRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.tutor = req.user.id;
    request.status = "applied";

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const scheduleSession = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.scheduledDate = req.body.scheduledDate;
    request.status = "scheduled";

    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRequest,
  getRequests,
  applyToRequest,
  scheduleSession
};
