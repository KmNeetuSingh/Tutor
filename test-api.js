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

// Function to fetch tutor profile
const getTutorProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/tutors/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched Tutor Profile:', response.data);
  } catch (error) {
    console.error('Error fetching tutor profile:', error.response ? error.response.data : error.message);
  }
};

// Function to update tutor profile
const updateTutorProfile = async (token, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/tutors/profile`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Profile updated:', response.data);
  } catch (error) {
    console.error('Error updating tutor profile:', error.response ? error.response.data : error.message);
  }
};

// Test function to simulate actions
async function testAPI() {
  try {
    console.log('🚀 Starting API tests for /users and /tutors routes...\n');

    // === Testing /users route ===

    // 1. Register New User
    const userData = {
      name: 'Sriti3',
      email: 'sriti3@gmail.com', 
      password: 'sriti31234',
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
      email: 'sriti3@gmail.com', 
      password: 'sriti31234',
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

    // === Testing /tutors route ===

    // 1. Register New Tutor
    const tutorData = {
      name: 'Bittu',
      email: 'sriti3tututor@gmail.com', 
      password: 'sriti31234tutor',
      role: 'tutor',
    };

    console.log('\n1. Registering new tutor...');
    res = await safePost(`${BASE_URL}/auth/register`, tutorData);
    if (res.success) {
      console.log('✅ New tutor registered successfully:', res.data.message || res.data);
    } else if (res.error.status === 409) {
      console.log('⚠️ Tutor already exists, skipping registration...');
    } else {
      console.log('❌ Tutor registration failed:', res.error?.data || res.error.message);
      return;
    }

    // 2. Tutor Login
    const tutorLoginData = {
      email: 'sriti3tututor@gmail.com', 
      password: 'sriti31234tutor',
    };

    console.log('\n2. Logging in tutor...');
    res = await safePost(`${BASE_URL}/auth/login`, tutorLoginData);
    let tutorToken;
    if (res.success) {
      tutorToken = res.data.token;
      console.log('✅ Tutor login successful.');
    } else {
      console.log('❌ Tutor login failed:', res.error?.data || res.error.message);
      return;
    }

    // 3. Fetch Tutor Profile (Before Update)
    console.log('\n3. Fetching tutor profile before update...');
    await getTutorProfile(tutorToken);

    // 4. Update Tutor Profile
    const updatedTutorData = {
      name: 'Bittu Updated',
      email: 'sriti3tututor@gmail.com',  // <-- Important to add this!
      bio: 'Updated bio for Tutor Bittu.',
    };
    
    console.log('\n4. Updating tutor profile...');
    await updateTutorProfile(tutorToken, updatedTutorData);

    // 5. Fetch Tutor Profile (After Update)
    console.log('\n5. Fetching tutor profile after update...');
    await getTutorProfile(tutorToken);

    console.log('\n🎯 All API tests completed!');
  } catch (err) {
    console.error('Unexpected error in testAPI:', err.message);
  }
}

testAPI();
