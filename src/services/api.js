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

// --- Added for NGO partner registration ---
// Calls the same POST /api/auth/register endpoint but with the fuller
// NGO partner payload (org name, contact person, phone, region).
// Spring/Jackson ignores unrecognized JSON fields by default, so this is
// safe to use even before the backend model is extended to store them —
// ask the backend teammate to add orgName/contactPerson/phone/region
// columns when ready, otherwise only name/email/password will persist.
// Body: { name, orgName, contactPerson, email, phone, region, password }
// -> Response: { message: "User registered successfully" }
export const registerNgo = async ({ orgName, contactPerson, email, phone, region, password }) => {
  const response = await api.post('/auth/register', {
    name: orgName, // reuse the existing `name` field the backend expects
    orgName,
    contactPerson,
    email,
    phone,
    region,
    password,
  });
  return response.data;
};

export default api;