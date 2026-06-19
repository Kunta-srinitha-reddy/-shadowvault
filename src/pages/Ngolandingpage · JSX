// src/pages/NGOLandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  page,
  card,
  eyebrow,
  heading,
  subtext,
  primaryButton,
  primaryButtonHover,
  secondaryButton,
  backLink,
  colors,
} from '../styles/ngoTheme';

export default function NGOLandingPage() {
  const navigate = useNavigate();
  const [hoverPrimary, setHoverPrimary] = React.useState(false);
  const [hoverSecondary, setHoverSecondary] = React.useState(false);

  return (
    <div style={page}>
      <a href="#/" style={backLink}>← Back to The Daily Mosaic</a>

      <div style={card}>
        <div style={eyebrow}>NGO Partner Access</div>
        <h1 style={heading}>Partner organization portal</h1>
        <p style={subtext}>
          This area is for verified NGO partners supporting ShadowVault
          survivors. Sign in if you already have access, or register your
          organization to apply.
        </p>

        <button
          style={hoverPrimary ? { ...primaryButton, ...primaryButtonHover } : primaryButton}
          onMouseEnter={() => setHoverPrimary(true)}
          onMouseLeave={() => setHoverPrimary(false)}
          onClick={() => navigate('/ngo-login')}
        >
          Sign in
        </button>

        <button
          style={hoverSecondary ? { ...secondaryButton, borderColor: colors.purple } : secondaryButton}
          onMouseEnter={() => setHoverSecondary(true)}
          onMouseLeave={() => setHoverSecondary(false)}
          onClick={() => navigate('/ngo-register')}
        >
          Register your organization
        </button>
      </div>
    </div>
  );
}