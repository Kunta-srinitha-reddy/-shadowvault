// src/pages/NGOLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  page,
  card,
  eyebrow,
  heading,
  subtext,
  label,
  input,
  inputFocus,
  primaryButton,
  primaryButtonHover,
  linkRow,
  link,
  backLink,
  banner,
  errorText,
} from '../styles/ngoTheme';

export default function NGOLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');
  const [status, setStatus] = useState(null); // { type: 'demo' | 'error', message }
  const [loading, setLoading] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Organization email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser(form.email, form.password);
      // Backend currently only returns { token }. Until it also returns
      // user/org details, build a minimal user object from what we have.
      const userData = { email: form.email, role: 'ngo' };
      login(data.token, userData);
      navigate('/ngo-dashboard');
    } catch (err) {
      // Backend not reachable / not built yet — fall back to a demo
      // session so the flow stays demoable, same pattern as ChatPage.
      console.warn('NGO login backend unreachable, using demo mode:', err?.message);
      setStatus({
        type: 'demo',
        message: 'Backend not connected — signing in with demo NGO session.',
      });
      login('demo-token', { email: form.email, role: 'ngo', demo: true });
      setTimeout(() => navigate('/ngo-dashboard'), 900);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <a href="#/ngo" style={backLink}>← Back</a>

      <div style={card}>
        <div style={eyebrow}>NGO Partner Access</div>
        <h1 style={heading}>Sign in</h1>
        <p style={subtext}>Use the credentials issued after your organization was verified.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label style={label} htmlFor="ngo-email">Organization email</label>
          <input
            id="ngo-email"
            type="email"
            style={focused === 'email' ? { ...input, ...inputFocus } : input}
            value={form.email}
            onChange={update('email')}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused('')}
            placeholder="contact@yourngo.org"
            autoComplete="email"
          />
          {errors.email && <div style={errorText}>{errors.email}</div>}

          <label style={label} htmlFor="ngo-password">Password</label>
          <input
            id="ngo-password"
            type="password"
            style={focused === 'password' ? { ...input, ...inputFocus } : input}
            value={form.password}
            onChange={update('password')}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused('')}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <div style={errorText}>{errors.password}</div>}

          <button
            type="submit"
            disabled={loading}
            style={hoverBtn ? { ...primaryButton, ...primaryButtonHover } : primaryButton}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {status && <div style={banner('success')}>{status.message}</div>}

        <div style={linkRow}>
          Don't have access yet?{' '}
          <a href="#/ngo-register" style={link}>Register your organization</a>
        </div>
      </div>
    </div>
  );
}