import axios from 'axios';

// Placeholder base URL — teammate will update this
// to point to the actual Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login - calls POST /api/auth/login
// Body: { email, password }  ->  Response: { token: "JWT token" }
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// Register - calls POST /api/auth/register
// Body: { name, email, password } -> Response: { message: "User registered successfully" }
export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export default api;