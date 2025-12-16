// API configuration
// Use your computer's local IP address when testing on a physical device
// The IP shown in Expo is: 10.231.240.6
export const API_URL = 'http://10.231.240.6:4000'; // Your local network IP

// Alternative options:
// export const API_URL = 'http://10.0.2.2:4000'; // Android emulator only
// export const API_URL = 'http://localhost:4000'; // iOS simulator only

export const api = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  verifyOtp: `${API_URL}/auth/verify-otp`,
  resendOtp: `${API_URL}/auth/resend-otp`,
  profile: `${API_URL}/auth/profile`,
};
