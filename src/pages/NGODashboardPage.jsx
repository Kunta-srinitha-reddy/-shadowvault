// src/pages/NGODashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileTab from '../components/ngoDashboard/ProfileTab';
import EmergencyTab from '../components/ngoDashboard/EmergencyTab';
import DecryptEvidenceTab from '../components/ngoDashboard/DecryptEvidenceTab';
import ChatTab from '../components/ngoDashboard/ChatTab';
import CaseUpdatesTab from '../components/ngoDashboard/CaseUpdatesTab';
import {
  dashboardPage,
  dashboardHeader,
  dashboardShell,
  tabBar,
  tabButton,
  heading,
  subtext,
  smallButton,
  colors,
} from '../styles/ngoTheme';

const TABS = [
  { key: 'profile', label: 'Profile', Component: ProfileTab },
  { key: 'emergency', label: 'Emergency alerts', Component: EmergencyTab },
  { key: 'decrypt', label: 'Decrypt evidence', Component: DecryptEvidenceTab },
  { key: 'chat', label: 'Counselor chat', Component: ChatTab },
  { key: 'cases', label: 'Case updates', Component: CaseUpdatesTab },
];

export default function NGODashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!isAuthenticated) navigate('/ngo-login');
  }, [isAuthenticated, navigate]);

  const handleSignOut = () => {
    logout();
    navigate('/ngo');
  };

  if (!isAuthenticated) return null;

  const ActiveComponent = TABS.find((t) => t.key === activeTab)?.Component;

  return (
    <div style={dashboardPage}>
      <div style={dashboardHeader}>
        <div>
          <h1 style={{ ...heading, fontSize: '22px' }}>NGO partner dashboard</h1>
          <p style={subtext}>Signed in as {user?.email}{user?.demo ? ' (demo session)' : ''}</p>
        </div>
        <button style={{ ...smallButton, borderColor: colors.border }} onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div style={dashboardShell}>
        <div style={tabBar}>
          {TABS.map((t) => (
            <button key={t.key} style={tabButton(activeTab === t.key)} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}