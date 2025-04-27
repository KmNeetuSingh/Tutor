import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.patch(
      `${API_URL}/notifications/read-all`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
}; 