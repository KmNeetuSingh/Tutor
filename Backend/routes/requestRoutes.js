const express = require("express");
const {
  createRequest,
  getRequests,
  applyToRequest,
  scheduleSession
} = require("../controllers/requestController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.post("/", roleMiddleware("student"), createRequest);
router.get("/", getRequests);
router.post("/apply/:id", roleMiddleware("tutor"), applyToRequest);
router.post("/schedule/:id", roleMiddleware("tutor"), scheduleSession);

module.exports = router;
