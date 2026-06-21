// src/components/ngoDashboard/CaseUpdatesTab.jsx
import React, { useEffect, useState } from 'react';
import { fetchCases, updateCaseStatus } from '../../services/ngoDashboardApi';
import {
  sectionCard,
  sectionTitle,
  sectionSubtext,
  rowItem,
  mono,
  badge,
  select,
  textarea,
  smallButtonPrimary,
  emptyState,
  colors,
} from '../../styles/ngoTheme';

const STATUS_OPTIONS = ['new', 'pending', 'active', 'resolved'];
const formatTime = (iso) => new Date(iso).toLocaleString();

export default function CaseUpdatesTab() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [draftStatus, setDraftStatus] = useState({});
  const [draftNote, setDraftNote] = useState({});
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, demo } = await fetchCases();
      if (!active) return;
      setCases(data);
      setDemoMode(demo);
      const statusInit = {};
      data.forEach((c) => { statusInit[c.token] = c.status; });
      setDraftStatus(statusInit);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const handleSave = async (token) => {
    setSaving(token);
    const status = draftStatus[token];
    const note = draftNote[token] || '';
    const { data } = await updateCaseStatus(token, status, note);
    setCases((prev) => prev.map((c) => (c.token === token ? { ...c, status: data.status, updatedAt: data.updatedAt } : c)));
    setDraftNote((prev) => ({ ...prev, [token]: '' }));
    setSaving(null);
  };

  return (
    <div style={sectionCard}>
      <h2 style={sectionTitle}>Case updates</h2>
      <p style={sectionSubtext}>
        Update where each case stands. Victims can check this with their anonymous token on the Case Status page.
        {demoMode && <> <span style={{ color: colors.textFaint }}>(demo data)</span></>}
      </p>

      {loading && <div style={emptyState}>Loading cases…</div>}
      {!loading && cases.length === 0 && <div style={emptyState}>No cases yet.</div>}

      {cases.map((c) => (
        <div key={c.token} style={{ borderTop: `1px solid ${colors.border}`, padding: '14px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={mono}>{c.token}</span>
              <span style={{ fontSize: '12px', color: colors.textFaint, marginLeft: '10px' }}>
                updated {formatTime(c.updatedAt)}
              </span>
            </div>
            <span style={badge(c.status === 'resolved' ? 'resolved' : c.status === 'active' ? 'active' : c.status === 'new' ? 'new' : 'pending')}>
              {c.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <select
              style={{ ...select, width: '160px' }}
              value={draftStatus[c.token] || c.status}
              onChange={(e) => setDraftStatus((prev) => ({ ...prev, [c.token]: e.target.value }))}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <textarea
              style={{ ...textarea, flex: 1, minWidth: '220px', minHeight: '40px' }}
              placeholder="Optional note for this update…"
              value={draftNote[c.token] || ''}
              onChange={(e) => setDraftNote((prev) => ({ ...prev, [c.token]: e.target.value }))}
            />
            <button
              style={smallButtonPrimary}
              disabled={saving === c.token}
              onClick={() => handleSave(c.token)}
            >
              {saving === c.token ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}