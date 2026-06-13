import { createContext, useState, useContext } from 'react';

// Create the context object
const AuthContext = createContext();

// Provider component - wraps the whole app (see App.jsx)
export const AuthProvider = ({ children }) => {
  // Load token from localStorage so login persists across page refreshes
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);

  // Call this after a successful login
  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('token', jwtToken);
  };

  // Call this on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token, // true if a token exists
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook so any component can do: const { login, isAuthenticated } = useAuth();
export const useAuth = () => useContext(AuthContext);
