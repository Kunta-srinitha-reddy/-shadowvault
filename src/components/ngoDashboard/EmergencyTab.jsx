// src/components/ngoDashboard/EmergencyTab.jsx
import React, { useEffect, useState } from 'react';
import { fetchEmergencyAlerts, acknowledgeAlert } from '../../services/ngoDashboardApi';
import {
  sectionCard,
  sectionTitle,
  sectionSubtext,
  rowItem,
  mono,
  badge,
  smallButton,
  smallButtonPrimary,
  emptyState,
  colors,
} from '../../styles/ngoTheme';

const formatTime = (iso) => new Date(iso).toLocaleString();

export default function EmergencyTab() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [busyToken, setBusyToken] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, demo } = await fetchEmergencyAlerts();
      if (!active) return;
      setAlerts(data);
      setDemoMode(demo);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const handleAcknowledge = async (token) => {
    setBusyToken(token);
    const { data } = await acknowledgeAlert(token);
    setAlerts((prev) => prev.map((a) => (a.token === token ? { ...a, status: data.status } : a)));
    setBusyToken(null);
  };

  const newCount = alerts.filter((a) => a.status === 'new').length;

  return (
    <div style={sectionCard}>
      <h2 style={sectionTitle}>Emergency alerts</h2>
      <p style={sectionSubtext}>
        Panic-button triggers from victims, most urgent first.
        {newCount > 0 && <> <span style={badge('new')}>{newCount} new</span></>}
        {demoMode && <> · <span style={{ color: colors.textFaint }}>demo data</span></>}
      </p>

      {loading && <div style={emptyState}>Loading alerts…</div>}
      {!loading && alerts.length === 0 && <div style={emptyState}>No emergency alerts right now.</div>}

      {alerts.map((a) => (
        <div key={a.token} style={rowItem}>
          <div>
            <div style={mono}>{a.token}</div>
            <div style={{ fontSize: '13px', marginTop: '2px' }}>{a.location}</div>
            <div style={{ fontSize: '12px', color: colors.textFaint, marginTop: '2px' }}>
              {formatTime(a.triggeredAt)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={badge(a.status === 'new' ? 'new' : a.status === 'acknowledged' ? 'active' : 'resolved')}>
              {a.status}
            </span>
            {a.status === 'new' && (
              <button
                style={smallButtonPrimary}
                disabled={busyToken === a.token}
                onClick={() => handleAcknowledge(a.token)}
              >
                {busyToken === a.token ? 'Acknowledging…' : 'Acknowledge'}
              </button>
            )}
            {a.status !== 'new' && <button style={smallButton} disabled>Acknowledged</button>}
          </div>
        </div>
      ))}
    </div>
  );
}