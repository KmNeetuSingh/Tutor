const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api'; // 👉 Adjust if your server runs somewhere else

// Register New User
const userData = {
  name: 'Test User',
  email: 'testuser123@gmail.com',  // 👈 Change if needed
  password: 'password123',         // 👈 Change if needed
  role: 'student',                 // student or tutor
};

// Login User
const userLoginData = {
  email: 'testuser123@gmail.com',   // 👈 Must match registered email
  password: 'password123',          // 👈 Must match registered password
};

// Register user
const registerUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, userData);
    console.log('✅ User registered successfully:', response.data);
  } catch (error) {
    console.error('❌ Error registering user:', error.response ? error.response.data : error.message);
  }
};

// Login user
const loginUser = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, userLoginData);
    console.log('✅ User logged in successfully');
    return response.data.token;
  } catch (error) {
    console.error('❌ Error logging in user:', error.response ? error.response.data : error.message);
  }
};

// Get profile
const getProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ User profile fetched:', response.data);
  } catch (error) {
    console.error('❌ Error fetching profile:', error.response ? error.response.data : error.message);
  }
};

// Update profile
const updateProfile = async (token) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/profile`, {
      name: 'Updated Test User',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ User profile updated:', response.data);
  } catch (error) {
    console.error('❌ Error updating profile:', error.response ? error.response.data : error.message);
  }
};

// Create a tutoring request
const createTutoringRequest = async (token) => {
  try {
    const response = await axios.post(`${BASE_URL}/requests`, {
      subject: 'Mathematics',
      description: 'Need help with calculus',
      availability: 'Weekends only',
      level: 'Intermediate',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ Tutoring request created:', response.data);
    return response.data._id;
  } catch (error) {
    console.error('❌ Error creating tutoring request:', error.response ? error.response.data : error.message);
  }
};

// Fetch single request
const getSingleRequest = async (requestId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/requests/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ Tutoring request fetched:', response.data);
  } catch (error) {
    console.error('❌ Error fetching request:', error.response ? error.response.data : error.message);
  }
};

// Update a tutoring request
const updateTutoringRequest = async (requestId, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/requests/${requestId}`, {
      subject: 'Advanced Mathematics',
      description: 'Need help with integration techniques',
      availability: 'Weekdays after 6 PM',
      level: 'Advanced',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ Tutoring request updated:', response.data);
  } catch (error) {
    console.error('❌ Error updating tutoring request:', error.response ? error.response.data : error.message);
  }
};

// Save a tutoring request
const saveRequest = async (requestId, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/requests/${requestId}/save`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ Request saved successfully:', response.data);
  } catch (error) {
    console.error('❌ Error saving request:', error.response ? error.response.data : error.message);
  }
};

// Unsave a tutoring request
const unsaveRequest = async (requestId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/requests/${requestId}/save`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✅ Request unsaved successfully:', response.data);
  } catch (error) {
    console.error('❌ Error unsaving request:', error.response ? error.response.data : error.message);
  }
};

// Main function to run all tests
const testAPI = async () => {
  try {
    console.log('\n1. Registering User...');
    await registerUser();

    console.log('\n2. Logging in User...');
    const userToken = await loginUser();

    console.log('\n3. Fetching User Profile...');
    await getProfile(userToken);

    console.log('\n4. Updating User Profile...');
    await updateProfile(userToken);

    console.log('\n5. Creating Tutoring Request...');
    const requestId = await createTutoringRequest(userToken);

    console.log('\n6. Fetching Tutoring Request...');
    await getSingleRequest(requestId, userToken);

    console.log('\n7. Updating Tutoring Request...');
    await updateTutoringRequest(requestId, userToken);

    console.log('\n8. Saving Tutoring Request...');
    await saveRequest(requestId, userToken);

    console.log('\n9. Unsaving Tutoring Request...');
    await unsaveRequest(requestId, userToken);

    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test run failed:', error.message);
  }
};

// Run the test
testAPI();
