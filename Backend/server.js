require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // separate MongoDB connect logic
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const userRoutes = require("./routes/userRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
