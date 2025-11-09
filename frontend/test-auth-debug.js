// Test script to debug authentication issues
const loginData = {
  email: 'testuser@example.com',
  password: 'password123'
};

console.log('Testing authentication flow...');

// Simulate login and check the response
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData)
})
.then(response => response.json())
.then(data => {
  console.log('Login response:', JSON.stringify(data, null, 2));
  
  if (data.token) {
    // Decode the JWT token to see what's inside
    const tokenParts = data.token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('Token payload:', JSON.stringify(payload, null, 2));
    
    // Check the user data
    console.log('User data from response:', JSON.stringify(data.user, null, 2));
    console.log('User role:', data.user.role);
  }
})
.catch(error => {
  console.error('Error during login:', error);
});