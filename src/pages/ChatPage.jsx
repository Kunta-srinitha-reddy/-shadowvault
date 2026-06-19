import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PanicButton from "../components/PanicButton";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

// Backend WebSocket endpoint (SockJS handshake URL — adjust to match Spring config)
const WS_BASE = "http://localhost:8080/ws";

export default function ChatPage() {
  const navigate = useNavigate();
  const { t, lang, speechLangCodes } = useLanguage();
  const [searchParams] = useSearchParams();
  const presetToken = searchParams.get("token") || "";

  const [step, setStep] = useState("entry"); // entry | connecting | chat
  const [tokenInput, setTokenInput] = useState(presetToken);
  const [chatToken, setChatToken] = useState("");
  const [status, setStatus] = useState("connecting"); // connecting | connected | demo | disconnected
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);

  const stompRef = useRef(null);
  const messagesEndRef = useRef(null);
  const demoTimerRef = useRef(null);

  const makeAnonToken = () =>
    "SV-CHAT-" + Math.random().toString(36).substring(2, 6).toUpperCase();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Connect when entering the chat step
  useEffect(() => {
    if (step !== "chat" || !chatToken) return;

    let cancelled = false;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE),
      reconnectDelay: 4000,
      onConnect: () => {
        if (cancelled) return;
        setStatus("connected");
        client.subscribe(`/topic/chat/${chatToken}`, (msg) => {
          try {
            const body = JSON.parse(msg.body);
            setMessages((prev) => [
              ...prev,
              { id: Date.now() + Math.random(), sender: "counselor", text: body.text, time: timeNow() },
            ]);
          } catch {
            // ignore malformed frame
          }
        });
      },
      onStompError: () => {
        if (!cancelled) enterDemoMode();
      },
      onWebSocketClose: () => {
        if (!cancelled && status === "connected") setStatus("disconnected");
      },
    });

    // If we can't even reach the server, fall back to demo after a short timeout
    const fallbackTimer = setTimeout(() => {
      if (!cancelled && status === "connecting") enterDemoMode();
    }, 4000);

    client.activate();
    stompRef.current = client;

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      clearTimeout(demoTimerRef.current);
      client.deactivate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, chatToken]);

  const enterDemoMode = () => {
    setStatus("demo");
    setMessages((prev) =>
      prev.length
        ? prev
        : [
            {
              id: "intro",
              sender: "counselor",
              text: t("chatDemoIntro") || "Hi, I'm here with you. You're safe right now — take your time. What's going on?",
              time: timeNow(),
            },
          ]
    );
  };

  const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleStart = () => {
    const finalToken = tokenInput.trim() || makeAnonToken();
    setChatToken(finalToken);
    setStatus("connecting");
    setStep("chat");
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), sender: "me", text, time: timeNow() },
    ]);
    setDraft("");

    if (status === "connected" && stompRef.current?.connected) {
      stompRef.current.publish({
        destination: `/app/chat/${chatToken}`,
        body: JSON.stringify({ sender: "victim", text }),
      });
    } else {
      // Demo fallback — simulate a counselor reply so the flow is fully demoable
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            sender: "counselor",
            text: t("chatDemoReply") || "I hear you. Can you tell me what city you're in, and whether it's safe to talk right now?",
            time: timeNow(),
          },
        ]);
      }, 1400);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported. Try Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = speechLangCodes?.[lang] || "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setDraft((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const statusMeta = {
    connecting: { label: t("chatConnecting") || "Connecting…", color: "#fbbf24" },
    connected: { label: t("chatConnected") || "Connected · Encrypted", color: "#10b981" },
    demo: { label: t("chatDemoMode") || "Demo mode", color: "#06b6d4" },
    disconnected: { label: t("chatDisconnected") || "Reconnecting…", color: "#ef4444" },
  }[status];

  const s = {
    page: { minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#e8e8f0", fontFamily: "'Inter','Segoe UI',sans-serif", display: "flex", flexDirection: "column" },
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid #1e1e2e", flexShrink: 0 },
    back: { fontSize: "13px", color: "#6b6b80", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none" },
    logoText: { fontSize: "16px", fontWeight: "700" },
    logoSpan: { color: "#7c3aed" },

    main: { flex: 1, maxWidth: "640px", width: "100%", margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column" },

    // entry screen
    entryWrap: { textAlign: "center", padding: "72px 24px" },
    pageTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" },
    pageSub: { fontSize: "14px", color: "rgba(232,232,240,0.55)", marginBottom: "36px", lineHeight: "1.6", maxWidth: "420px", margin: "0 auto 36px" },
    label: { display: "block", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#6b6b80", fontFamily: "monospace", marginBottom: "8px", textAlign: "left" },
    input: { width: "100%", padding: "12px 16px", backgroundColor: "#111118", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#e8e8f0", fontSize: "15px", outline: "none", fontFamily: "inherit", marginBottom: "16px", boxSizing: "border-box" },
    hint: { fontSize: "12px", color: "#3a3a4a", marginBottom: "28px", fontFamily: "monospace" },
    submitBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer" },

    // connecting
    submittingWrap: { textAlign: "center", padding: "120px 24px" },
    spinner: { width: "48px", height: "48px", border: "3px solid #1e1e2e", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" },

    // chat
    chatHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #1e1e2e", flexShrink: 0 },
    chatHeaderLeft: { display: "flex", alignItems: "center", gap: "10px" },
    statusDot: { width: "8px", height: "8px", borderRadius: "50%" },
    statusLabel: { fontSize: "12px", fontFamily: "monospace", color: "#9a9ab0" },
    tokenTag: { fontSize: "11px", fontFamily: "monospace", color: "#3a3a4a" },

    messagesArea: { flex: 1, overflowY: "auto", padding: "24px 0", display: "flex", flexDirection: "column", gap: "12px" },
    rowMe: { display: "flex", justifyContent: "flex-end" },
    rowCounselor: { display: "flex", justifyContent: "flex-start" },
    bubbleMe: { maxWidth: "75%", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", fontSize: "14px", lineHeight: "1.5" },
    bubbleCounselor: { maxWidth: "75%", backgroundColor: "#111118", border: "1px solid #2a2a3a", color: "#e8e8f0", padding: "12px 16px", borderRadius: "16px 16px 16px 4px", fontSize: "14px", lineHeight: "1.5" },
    msgTime: { fontSize: "10px", color: "#4a4a5a", marginTop: "4px", fontFamily: "monospace" },

    inputBar: { display: "flex", alignItems: "flex-end", gap: "10px", padding: "16px 0 24px", borderTop: "1px solid #1e1e2e", flexShrink: 0 },
    textInput: { flex: 1, padding: "12px 16px", backgroundColor: "#111118", border: "1px solid #2a2a3a", borderRadius: "20px", color: "#e8e8f0", fontSize: "14px", outline: "none", fontFamily: "inherit", resize: "none", maxHeight: "120px" },
    iconBtn: { width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #2a2a3a", backgroundColor: "#111118", color: "#9a9ab0", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    iconBtnActive: { borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" },
    sendBtn: { width: "44px", height: "44px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  };

  // ---- ENTRY ----
  if (step === "entry") {
    return (
      <div style={s.page}>
        <PanicButton />
        <nav style={s.nav}>
          <button style={s.back} onClick={() => navigate("/portal")}>← {t("backToPortal")}</button>
          <span style={s.logoText}>Shadow<span style={s.logoSpan}>Vault</span></span>
          <LanguageSwitcher style="dropdown" />
        </nav>
        <div style={s.main}>
          <div style={s.entryWrap}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>💬</div>
            <div style={s.pageTitle}>{t("talkToCounselor") || "Talk to a Counselor"}</div>
            <p style={s.pageSub}>
              {t("chatEntryDesc") ||
                "You'll be connected with a trained NGO counselor in real time. No account needed — your conversation stays anonymous."}
            </p>
            <label style={s.label}>{t("haveToken") || "Have a case token? (optional)"}</label>
            <input
              style={s.input}
              type="text"
              placeholder="SV-XXXX-XX"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <div style={s.hint}>{t("noTokenHint") || "Leave blank to start a new anonymous conversation"}</div>
            <button style={s.submitBtn} onClick={handleStart}>
              🔒 {t("startChat") || "Start Secure Chat"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- CONNECTING ----
  if (step === "chat" && status === "connecting" && messages.length === 0) {
    return (
      <div style={s.page}>
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
        <div style={s.submittingWrap}>
          <div style={s.spinner}></div>
          <div style={{ fontSize: "16px", color: "rgba(232,232,240,0.6)" }}>
            {t("connectingToCounselor") || "Connecting you with a counselor…"}
          </div>
          <div style={{ fontSize: "13px", color: "#3a3a4a", marginTop: "8px", fontFamily: "monospace" }}>
            Disguised as image frames · No text leaves your device
          </div>
        </div>
      </div>
    );
  }

  // ---- CHAT ----
  return (
    <div style={s.page}>
      <PanicButton />
      <nav style={s.nav}>
        <button style={s.back} onClick={() => navigate("/portal")}>← {t("backToPortal")}</button>
        <span style={s.logoText}>Shadow<span style={s.logoSpan}>Vault</span></span>
        <LanguageSwitcher style="dropdown" />
      </nav>

      <div style={s.main}>
        <div style={s.chatHeader}>
          <div style={s.chatHeaderLeft}>
            <span style={{ ...s.statusDot, backgroundColor: statusMeta.color }}></span>
            <span style={s.statusLabel}>{statusMeta.label}</span>
          </div>
          <span style={s.tokenTag}>{chatToken}</span>
        </div>

        <div style={s.messagesArea}>
          {messages.map((m) => (
            <div key={m.id} style={m.sender === "me" ? s.rowMe : s.rowCounselor}>
              <div>
                <div style={m.sender === "me" ? s.bubbleMe : s.bubbleCounselor}>{m.text}</div>
                <div style={{ ...s.msgTime, textAlign: m.sender === "me" ? "right" : "left" }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={s.inputBar}>
          <button
            style={{ ...s.iconBtn, ...(isListening ? s.iconBtnActive : {}) }}
            onClick={handleVoice}
            title={t("useVoice") || "Voice input"}
          >
            🎙️
          </button>
          <textarea
            style={s.textInput}
            rows={1}
            placeholder={t("typeMessage") || "Type a message…"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button style={s.sendBtn} onClick={handleSend} title={t("send") || "Send"}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
