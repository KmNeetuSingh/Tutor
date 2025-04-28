const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Utility function to safely post data with better error handling
const safePost = async (url, data, headers = {}) => {
  try {
    const response = await axios.post(url, data, { headers });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response || error };
  }
};

// Utility function to safely put data with better error handling
const safePut = async (url, data, headers = {}) => {
  try {
    const response = await axios.put(url, data, { headers });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response || error };
  }
};

// Function to fetch user profile
const getUserProfile = async (userId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('User Profile:', response.data);
  } catch (error) {
    console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
  }
};

// Function to fetch tutoring request
const getRequest = async (requestId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Request:', response.data);
  } catch (error) {
    console.error('Error fetching request:', error.response ? error.response.data : error.message);
  }
};

// Function to update tutoring request
const updateRequest = async (requestId, updatedData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/requests/${requestId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Request updated:', response.data);
  } catch (error) {
    console.error('Error updating request:', error.response ? error.response.data : error.message);
  }
};

// Test function to simulate actions
async function testAPI() {
  try {
    console.log('🚀 Starting API tests for /users and /requests routes...\n');

    // === Testing /users route ===

    // 1. Register New User
    const userData = {
      name: 'Sriti3',
      email: 'sriti13@gmail.com', 
      password: 'sriti131234',
      role: 'student',
    };

    console.log('1. Registering new user...');
    let res = await safePost(`${BASE_URL}/auth/register`, userData);
    if (res.success) {
      console.log('✅ New user registered successfully:', res.data.message || res.data);
    } else if (res.error.status === 409) {
      console.log('⚠️ User already exists, skipping registration...');
    } else {
      console.log('❌ User registration failed:', res.error?.data || res.error.message);
      return;
    }

    // 2. User Login
    const userLoginData = {
      email: 'sriti13@gmail.com', 
      password: 'sriti131234',
    };

    console.log('\n2. Logging in user...');
    res = await safePost(`${BASE_URL}/auth/login`, userLoginData);
    let userToken;
    let userId;
    if (res.success) {
      userToken = res.data.token;
      userId = res.data.user.id;
      console.log('✅ User login successful.');
    } else {
      console.log('❌ User login failed:', res.error?.data || res.error.message);
      return;
    }

    // 3. Fetch User Profile (Before Update)
    console.log('\n3. Fetching user profile before update...');
    await getUserProfile(userId, userToken);

    // 4. Update User Profile
    const updatedUserData = {
      name: 'Bittu Updated',
      bio: 'Updated bio for Bittu.',
    };

    console.log('\n4. Updating user profile...');
    res = await safePut(`${BASE_URL}/users/${userId}`, updatedUserData, {
      Authorization: `Bearer ${userToken}`,
    });

    if (res.success) {
      console.log('✅ User profile updated successfully:', res.data);
    } else {
      console.log('❌ User profile update failed:', res.error?.data || res.error.message);
      return;
    }

    // 5. Fetch User Profile (After Update)
    console.log('\n5. Fetching user profile after update...');
    await getUserProfile(userId, userToken);

    // === Testing /requests route ===

    // 1. Create New Request
    const requestData = {
      studentId: userId,
      subject: 'Math',
      description: 'Looking for help with algebra.',
      preferredTime: '2025-04-30T10:00:00Z',
    };

    console.log('\n1. Creating new tutoring request...');
    res = await safePost(`${BASE_URL}/requests`, requestData, {
      Authorization: `Bearer ${userToken}`,
    });
    let requestId;
    if (res.success) {
      requestId = res.data.id;
      console.log('✅ New tutoring request created successfully:', res.data);
    } else {
      console.log('❌ Tutoring request creation failed:', res.error?.data || res.error.message);
      return;
    }

    // 2. Fetch Request Details
    console.log('\n2. Fetching request details...');
    await getRequest(requestId, userToken);

    // 3. Update Request
    const updatedRequestData = {
      description: 'Looking for help with algebra and calculus.',
      preferredTime: '2025-05-01T10:00:00Z',
    };

    console.log('\n3. Updating tutoring request...');
    await updateRequest(requestId, updatedRequestData, userToken);

    // 4. Fetch Request Details After Update
    console.log('\n4. Fetching request details after update...');
    await getRequest(requestId, userToken);

    console.log('\n🎯 All API tests completed!');
  } catch (err) {
    console.error('Unexpected error in testAPI:', err.message);
  }
}

testAPI();
