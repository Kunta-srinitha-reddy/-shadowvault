// src/components/ngoDashboard/DecryptEvidenceTab.jsx
import React, { useEffect, useState } from 'react';
import { fetchEvidenceList, decryptEvidence } from '../../services/ngoDashboardApi';
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

export default function DecryptEvidenceTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [decrypting, setDecrypting] = useState(null);
  const [decrypted, setDecrypted] = useState({}); // token -> decrypted payload

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, demo } = await fetchEvidenceList();
      if (!active) return;
      setItems(data);
      setDemoMode(demo);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const handleDecrypt = async (token) => {
    if (decrypted[token]) {
      // already decrypted — toggle hide
      setDecrypted((prev) => {
        const next = { ...prev };
        delete next[token];
        return next;
      });
      return;
    }
    setDecrypting(token);
    const { data } = await decryptEvidence(token);
    setDecrypted((prev) => ({ ...prev, [token]: data }));
    setDecrypting(null);
  };

  return (
    <div style={sectionCard}>
      <h2 style={sectionTitle}>Decrypt evidence</h2>
      <p style={sectionSubtext}>
        All submitted reports stay AES/RSA-encrypted at rest. Decrypt one to view its details — only do this when you're ready to act on it.
        {demoMode && <> <span style={{ color: colors.textFaint }}>(demo data)</span></>}
      </p>

      {loading && <div style={emptyState}>Loading evidence list…</div>}
      {!loading && items.length === 0 && <div style={emptyState}>No evidence submitted yet.</div>}

      {items.map((item) => {
        const isOpen = !!decrypted[item.token];
        return (
          <div key={item.token}>
            <div style={rowItem}>
              <div>
                <div style={mono}>{item.token}</div>
                <div style={{ fontSize: '12px', color: colors.textFaint, marginTop: '2px' }}>
                  {formatTime(item.submittedAt)} · {item.images} image{item.images === 1 ? '' : 's'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.emergency && <span style={badge('new')}>emergency</span>}
                <button
                  style={isOpen ? smallButton : smallButtonPrimary}
                  disabled={decrypting === item.token}
                  onClick={() => handleDecrypt(item.token)}
                >
                  {decrypting === item.token ? 'Decrypting…' : isOpen ? 'Hide' : 'Decrypt'}
                </button>
              </div>
            </div>

            {isOpen && (
              <div
                style={{
                  background: colors.bgInput,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '10px',
                  padding: '14px 16px',
                  margin: '0 0 12px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                }}
              >
                <div><strong>Description:</strong> {decrypted[item.token].description}</div>
                <div style={{ marginTop: '6px' }}><strong>City:</strong> {decrypted[item.token].city}</div>
                <div style={{ marginTop: '6px' }}><strong>Date:</strong> {decrypted[item.token].date}</div>
                <div style={{ marginTop: '6px' }}><strong>Contact hint:</strong> {decrypted[item.token].contactHint}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}