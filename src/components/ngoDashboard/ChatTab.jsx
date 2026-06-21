// src/components/ngoDashboard/ChatTab.jsx
import React, { useEffect, useState } from 'react';
import { fetchChatThreads } from '../../services/ngoDashboardApi';
import {
  sectionCard,
  sectionTitle,
  sectionSubtext,
  rowItem,
  mono,
  badge,
  smallButtonPrimary,
  emptyState,
  colors,
} from '../../styles/ngoTheme';

const formatTime = (iso) => new Date(iso).toLocaleString();

export default function ChatTab() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, demo } = await fetchChatThreads();
      if (!active) return;
      setThreads(data);
      setDemoMode(demo);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return (
    <div style={sectionCard}>
      <h2 style={sectionTitle}>Counselor chat</h2>
      <p style={sectionSubtext}>
        Active threads with victims, by anonymous token.
        {demoMode && <> <span style={{ color: colors.textFaint }}>(demo data)</span></>}
      </p>

      {loading && <div style={emptyState}>Loading threads…</div>}
      {!loading && threads.length === 0 && <div style={emptyState}>No active chats right now.</div>}

      {threads.map((t) => (
        <div key={t.token} style={rowItem}>
          <div style={{ minWidth: 0 }}>
            <div style={mono}>{t.token}</div>
            <div
              style={{
                fontSize: '13px',
                marginTop: '2px',
                maxWidth: '420px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {t.lastMessage}
            </div>
            <div style={{ fontSize: '12px', color: colors.textFaint, marginTop: '2px' }}>
              {formatTime(t.lastActive)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {t.unread && <span style={badge('new')}>unread</span>}
            <a href="#/chat" style={{ textDecoration: 'none' }}>
              <button style={smallButtonPrimary}>Open chat</button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}