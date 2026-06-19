// src/pages/NGODashboardPlaceholder.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  page,
  card,
  eyebrow,
  heading,
  subtext,
  secondaryButton,
  colors,
} from '../styles/ngoTheme';

export default function NGODashboardPlaceholder() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/ngo-login');
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = () => {
    logout();
    navigate('/ngo');
  };

  if (!isAuthenticated) return null;

  return (
    <div style={page}>
      <div style={card}>
        <div style={eyebrow}>NGO Partner Access</div>
        <h1 style={heading}>Welcome, {user?.email}</h1>
        <p style={subtext}>
          The full case dashboard (incoming reports, chat queue, case
          status updates) is being built on the backend. You're signed in
          {user?.demo ? ' in demo mode' : ''} — this page is a placeholder
          until that work lands.
        </p>
        <button style={{ ...secondaryButton, borderColor: colors.border }} onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}