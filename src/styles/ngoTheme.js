// src/styles/ngoTheme.js
// Shared design tokens for the NGO Partner Portal (login / register / landing).
// Kept consistent with the existing ShadowVault dark theme used across
// LandingPage / PortalPage / EvidencePage / ChatPage.

export const colors = {
  bg: '#0a0a0f',
  bgPanel: '#13131a',
  bgInput: '#1a1a24',
  border: '#26262f',
  borderFocus: '#7c3aed',
  text: '#f4f4f6',
  textDim: '#9999a8',
  textFaint: '#6b6b78',
  purple: '#7c3aed',
  purpleSoft: 'rgba(124, 58, 237, 0.12)',
  cyan: '#06b6d4',
  green: '#10b981',
  red: '#ef4444',
  redSoft: 'rgba(239, 68, 68, 0.12)',
};

export const fonts = {
  body: "'Inter', 'Segoe UI', sans-serif",
};

export const page = {
  minHeight: '100vh',
  width: '100%',
  background: `radial-gradient(ellipse 80% 50% at 50% -10%, ${colors.purpleSoft}, transparent), ${colors.bg}`,
  fontFamily: fonts.body,
  color: colors.text,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '64px 20px',
  boxSizing: 'border-box',
};

export const card = {
  width: '100%',
  maxWidth: '420px',
  background: colors.bgPanel,
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  padding: '36px 32px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  boxSizing: 'border-box',
};

export const eyebrow = {
  fontSize: '12px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: colors.cyan,
  fontWeight: 600,
  marginBottom: '10px',
};

export const heading = {
  fontSize: '26px',
  fontWeight: 700,
  margin: '0 0 8px 0',
  letterSpacing: '-0.01em',
};

export const subtext = {
  fontSize: '14px',
  color: colors.textDim,
  lineHeight: 1.6,
  margin: 0,
};

export const label = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: colors.textDim,
  marginBottom: '6px',
  marginTop: '18px',
};

export const input = {
  width: '100%',
  background: colors.bgInput,
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  padding: '12px 14px',
  fontSize: '14px',
  color: colors.text,
  fontFamily: fonts.body,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};

export const inputFocus = {
  borderColor: colors.borderFocus,
};

export const select = {
  ...input,
  appearance: 'none',
  cursor: 'pointer',
};

export const primaryButton = {
  width: '100%',
  marginTop: '26px',
  padding: '13px 16px',
  borderRadius: '10px',
  border: 'none',
  background: colors.purple,
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: fonts.body,
  transition: 'background 0.15s ease, transform 0.1s ease',
};

export const primaryButtonHover = {
  background: '#6d28d9',
};

export const secondaryButton = {
  width: '100%',
  marginTop: '12px',
  padding: '13px 16px',
  borderRadius: '10px',
  border: `1px solid ${colors.border}`,
  background: 'transparent',
  color: colors.text,
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: fonts.body,
  transition: 'border-color 0.15s ease',
};

export const linkRow = {
  marginTop: '22px',
  textAlign: 'center',
  fontSize: '13px',
  color: colors.textFaint,
};

export const link = {
  color: colors.cyan,
  textDecoration: 'none',
  fontWeight: 600,
  cursor: 'pointer',
};

export const backLink = {
  fontSize: '13px',
  color: colors.textFaint,
  textDecoration: 'none',
  marginBottom: '28px',
  display: 'inline-block',
};

export const banner = (variant) => ({
  marginTop: '18px',
  padding: '12px 14px',
  borderRadius: '10px',
  fontSize: '13px',
  lineHeight: 1.5,
  background: variant === 'error' ? colors.redSoft : 'rgba(16, 185, 129, 0.12)',
  color: variant === 'error' ? colors.red : colors.green,
  border: `1px solid ${variant === 'error' ? colors.red : colors.green}`,
});

export const errorText = {
  fontSize: '12px',
  color: colors.red,
  marginTop: '6px',
};