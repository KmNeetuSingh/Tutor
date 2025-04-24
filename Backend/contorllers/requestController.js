import Request from "../models/Request.js";

export const createRequest = async (req, res) => {
  const request = await Request.create({
    subject: req.body.subject,
    description: req.body.description,
    student: req.user._id,
  });
  res.status(201).json(request);
};

export const getRequests = async (req, res) => {
  const requests = await Request.find().populate("student", "name email");
  res.json(requests);
};

export const getRequestById = async (req, res) => {
  const request = await Request.findById(req.params.id).populate("applicants", "name");
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.json(request);
};

export const applyToRequest = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (!request.applicants.includes(req.user._id)) {
    request.applicants.push(req.user._id);
    await request.save();
  }

  res.json({ message: "Applied successfully", request });
};

export const scheduleSession = async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.scheduledAt = req.body.scheduledAt;
  await request.save();

  res.json({ message: "Session scheduled", request });
};
