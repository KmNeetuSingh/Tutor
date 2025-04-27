const Notification = require("../models/Notification");

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.user.id);
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("sender", "name")
      .populate("relatedRequest")
      .sort({ createdAt: -1 });
    
    console.log("Fetched notifications:", notifications.length);
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server error while fetching notifications" });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    console.log("Marking notification as read:", req.params.id);
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    // Check if the notification belongs to the user
    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    notification.read = true;
    await notification.save();
    
    console.log("Notification marked as read");
    res.json(notification);
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ message: "Server error while marking notification as read" });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    console.log("Marking all notifications as read for user:", req.user.id);
    await Notification.updateMany(
      { recipient: req.user.id, read: false },
      { read: true }
    );
    
    console.log("All notifications marked as read");
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ message: "Server error while marking all notifications as read" });
  }
};

// Create a notification (internal use)
const createNotification = async (recipientId, type, title, message, senderId = null, relatedRequestId = null) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      relatedRequest: relatedRequestId
    });
    
    await notification.save();
    console.log("Notification created:", notification._id);
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    return null;
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
}; 