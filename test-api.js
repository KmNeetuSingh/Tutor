const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAPI() {
  try {
    console.log('🚀 Starting API tests...\n');

    // Utility function to safely post data
    const safePost = async (url, data, headers = {}) => {
      try {
        const response = await axios.post(url, data, { headers });
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error };
      }
    };

    // Utility function to safely get data
    const safeGet = async (url, headers = {}) => {
      try {
        const response = await axios.get(url, { headers });
        return { success: true, data: response.data };
      } catch (error) {
        return { success: false, error };
      }
    };

    // 1. Register Student
    const studentData = {
      name: 'Anjali',
      email: 'anjali@test.com',
      password: 'password123',
      role: 'student'
    };

    console.log('1. Registering student...');
    await delay(1000);
    let res = await safePost(`${BASE_URL}/auth/register`, studentData);
    if (res.success) {
      console.log('✅ Student registered successfully:', res.data.message || res.data);
    } else if (res.error.response?.status === 409) {
      console.log('⚠️ Student already exists, continuing...');
    } else {
      console.log('❌ Student registration failed:', res.error.response?.data || res.error.message);
      return;
    }

    // 2. Student Login
    const studentLoginData = {
      email: 'anjali@test.com',
      password: 'password123'
    };

    let studentToken;
    console.log('\n2. Logging in student...');
    await delay(1000);
    res = await safePost(`${BASE_URL}/users/login`, studentLoginData);
    if (res.success) {
      studentToken = res.data.token;
      console.log('✅ Student login successful.');
    } else {
      console.log('❌ Student login failed:', res.error.response?.data || res.error.message);
      return;
    }

    // 3. Create Request
    const requestData = {
      subject: 'Physics',
      description: 'Need help with mechanics',
      date: '2024-03-20',
      time: '14:00',
      duration: 2,
      budget: 50
    };

    console.log('\n3. Creating a request...');
    await delay(1000);
    res = await safePost(`${BASE_URL}/requests`, requestData, {
      Authorization: `Bearer ${studentToken}`
    });

    let requestId;
    if (res.success) {
      console.log('✅ Request created successfully:', res.data);
      requestId = res.data._id;
    } else {
      console.log('❌ Request creation failed:', res.error.response?.data || res.error.message);
      return;
    }

    // 4. Get All Requests
    console.log('\n4. Fetching all requests...');
    await delay(1000);
    res = await safeGet(`${BASE_URL}/requests`, {
      Authorization: `Bearer ${studentToken}`
    });

    if (res.success) {
      console.log('✅ Requests fetched successfully:', res.data);
    } else {
      console.log('❌ Fetching requests failed:', res.error.response?.data || res.error.message);
      return;
    }

    // 5. Register Tutor
    const tutorData = {
      name: 'Rahul Tutor',
      email: 'rahul@test.com',
      password: 'password123',
      role: 'tutor'
    };

    console.log('\n5. Registering tutor...');
    await delay(1000);
    res = await safePost(`${BASE_URL}/auth/register`, tutorData);
    if (res.success) {
      console.log('✅ Tutor registered successfully:', res.data.message || res.data);
    } else if (res.error.response?.status === 409) {
      console.log('⚠️ Tutor already exists, continuing...');
    } else {
      console.log('❌ Tutor registration failed:', res.error.response?.data || res.error.message);
      return;
    }

    // 6. Tutor Login
    const tutorLoginData = {
      email: 'rahul@test.com',
      password: 'password123'
    };

    let tutorToken;
    console.log('\n6. Logging in tutor...');
    await delay(1000);
    res = await safePost(`${BASE_URL}/auth/login`, tutorLoginData);

    if (res.success) {
      tutorToken = res.data.token;
      console.log('✅ Tutor login successful.');
    } else {
      console.log('❌ Tutor login failed:', res.error.response?.data || res.error.message);
      return;
    }

    console.log('\n🎯 All API tests completed successfully!');
  } catch (error) {
    console.error('❌ Fatal error in test script:', error.message);
    process.exit(1);
  }
}

testAPI();
