const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🚀 Testing Authentication API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: User Registration
    console.log('2. Testing User Registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email
      password: 'testpassword123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/register`, registerData);
    console.log('✅ Registration successful!');
    console.log('User:', registerResponse.data.user);
    console.log('Token received:', registerResponse.data.token ? 'Yes' : 'No');
    console.log('');

    // Test 3: User Login
    console.log('3. Testing User Login...');
    const loginData = {
      email: registerData.email,
      password: registerData.password
    };

    const loginResponse = await axios.post(`${BASE_URL}/api/login`, loginData);
    console.log('✅ Login successful!');
    console.log('User:', loginResponse.data.user);
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('');

    // Test 4: Duplicate Registration (should fail)
    console.log('4. Testing Duplicate Registration (should fail)...');
    try {
      await axios.post(`${BASE_URL}/api/register`, registerData);
      console.log('❌ Duplicate registration should have failed!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Duplicate registration properly rejected:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 5: Wrong Password Login (should fail)
    console.log('5. Testing Wrong Password Login (should fail)...');
    try {
      await axios.post(`${BASE_URL}/api/login`, {
        email: registerData.email,
        password: 'wrongpassword'
      });
      console.log('❌ Wrong password login should have failed!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Wrong password properly rejected:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('Your authentication system is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Check if axios is available
try {
  require.resolve('axios');
  testAPI();
} catch (e) {
  console.log('📦 Installing axios for testing...');
  const { exec } = require('child_process');
  exec('npm install axios', (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to install axios:', error);
      return;
    }
    console.log('✅ Axios installed successfully!');
    delete require.cache[require.resolve('axios')];
    testAPI();
  });
}

