// src/pages/NGORegisterPage.jsx
import React, { useState } from 'react';
import { registerNgo } from '../services/api';
import {
  page,
  card,
  eyebrow,
  heading,
  subtext,
  label,
  input,
  inputFocus,
  select,
  primaryButton,
  primaryButtonHover,
  linkRow,
  link,
  backLink,
  banner,
  errorText,
} from '../styles/ngoTheme';

const REGIONS = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other',
];

const initialForm = {
  orgName: '',
  contactPerson: '',
  email: '',
  phone: '',
  region: '',
  password: '',
  confirmPassword: '',
};

export default function NGORegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validate = () => {
    const next = {};
    if (!form.orgName.trim()) next.orgName = 'Organization name is required.';
    if (!form.contactPerson.trim()) next.contactPerson = 'Contact person is required.';
    if (!form.email.trim()) next.email = 'Official email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number.';
    if (!form.region) next.region = 'Select a region.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await registerNgo({
        orgName: form.orgName,
        contactPerson: form.contactPerson,
        email: form.email,
        phone: form.phone,
        region: form.region,
        password: form.password,
      });
      setSubmitted(true);
    } catch (err) {
      console.warn('NGO register backend unreachable, using demo mode:', err?.message);
      setStatus({
        type: 'demo',
        message: 'Backend not connected — request recorded in demo mode only.',
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={page}>
        <div style={card}>
          <div style={eyebrow}>NGO Partner Access</div>
          <h1 style={heading}>Request received</h1>
          <p style={subtext}>
            Thanks — we've recorded the registration for <strong>{form.orgName || 'your organization'}</strong>.
            Our team verifies new partners before granting access; you'll receive
            login details by email once approved.
          </p>
          {status && <div style={banner('success')}>{status.message}</div>}
          <div style={linkRow}>
            Already verified? <a href="#/ngo-login" style={link}>Sign in</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <a href="#/ngo" style={backLink}>← Back</a>

      <div style={card}>
        <div style={eyebrow}>NGO Partner Access</div>
        <h1 style={heading}>Register your organization</h1>
        <p style={subtext}>Submitted details are reviewed before access is granted.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label style={label} htmlFor="org-name">Organization name</label>
          <input
            id="org-name"
            style={focused === 'orgName' ? { ...input, ...inputFocus } : input}
            value={form.orgName}
            onChange={update('orgName')}
            onFocus={() => setFocused('orgName')}
            onBlur={() => setFocused('')}
            placeholder="e.g. Sahaara Trust"
          />
          {errors.orgName && <div style={errorText}>{errors.orgName}</div>}

          <label style={label} htmlFor="contact-person">Contact person</label>
          <input
            id="contact-person"
            style={focused === 'contactPerson' ? { ...input, ...inputFocus } : input}
            value={form.contactPerson}
            onChange={update('contactPerson')}
            onFocus={() => setFocused('contactPerson')}
            onBlur={() => setFocused('')}
            placeholder="Full name"
          />
          {errors.contactPerson && <div style={errorText}>{errors.contactPerson}</div>}

          <label style={label} htmlFor="ngo-reg-email">Official email</label>
          <input
            id="ngo-reg-email"
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

          <label style={label} htmlFor="ngo-phone">Phone number</label>
          <input
            id="ngo-phone"
            type="tel"
            style={focused === 'phone' ? { ...input, ...inputFocus } : input}
            value={form.phone}
            onChange={update('phone')}
            onFocus={() => setFocused('phone')}
            onBlur={() => setFocused('')}
            placeholder="+91 9XXXXXXXXX"
            autoComplete="tel"
          />
          {errors.phone && <div style={errorText}>{errors.phone}</div>}

          <label style={label} htmlFor="ngo-region">Region</label>
          <select
            id="ngo-region"
            style={focused === 'region' ? { ...select, ...inputFocus } : select}
            value={form.region}
            onChange={update('region')}
            onFocus={() => setFocused('region')}
            onBlur={() => setFocused('')}
          >
            <option value="">Select a state / region</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.region && <div style={errorText}>{errors.region}</div>}

          <label style={label} htmlFor="ngo-reg-password">Password</label>
          <input
            id="ngo-reg-password"
            type="password"
            style={focused === 'password' ? { ...input, ...inputFocus } : input}
            value={form.password}
            onChange={update('password')}
            onFocus={() => setFocused('password')}
            onBlur={() => setFocused('')}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          {errors.password && <div style={errorText}>{errors.password}</div>}

          <label style={label} htmlFor="ngo-confirm-password">Confirm password</label>
          <input
            id="ngo-confirm-password"
            type="password"
            style={focused === 'confirmPassword' ? { ...input, ...inputFocus } : input}
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            onFocus={() => setFocused('confirmPassword')}
            onBlur={() => setFocused('')}
            placeholder="Re-enter password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && <div style={errorText}>{errors.confirmPassword}</div>}

          <button
            type="submit"
            disabled={loading}
            style={hoverBtn ? { ...primaryButton, ...primaryButtonHover } : primaryButton}
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
          >
            {loading ? 'Submitting…' : 'Submit for verification'}
          </button>
        </form>

        <div style={linkRow}>
          Already verified? <a href="#/ngo-login" style={link}>Sign in</a>
        </div>
      </div>
    </div>
  );
}