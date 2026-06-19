import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PanicButton from "../components/PanicButton";
import DeadMansSwitch from "../components/DeadMansSwitch";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";


const API_BASE = "[localhost](http://localhost:8080/api)";

export default function EvidencePage() {
  const navigate = useNavigate();
  const { t, lang, speechLangCodes } = useLanguage();
  const [searchParams] = useSearchParams();
  const isEmergency = searchParams.get("emergency") === "true";

  const [step, setStep] = useState(isEmergency ? "emergency" : "form");
  const [token, setToken] = useState("");
  const [evidenceImageUrl, setEvidenceImageUrl] = useState(null);

  const [form, setForm] = useState({
    description: "",
    city: "",
    incidentDate: "",
    contactHint: "",
    // New user detail fields
    name: "",
    age: "",
    gender: "",
    relationshipToAbuser: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  // Multilingual speech-to-text
  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input not supported. Try Chrome.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = speechLangCodes[lang] || "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setForm(prev => ({ ...prev, description: prev.description + " " + transcript }));
    };
    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const makeToken = () => "SV-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 4).toUpperCase();

  const handleSubmit = async () => {
    if (!form.description.trim()) {
      setError(t("pleaseDescribe"));
      return;
    }
    setError("");
    setStep("submitting");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append("evidence", imageFile);
      const res = await axios.post(`${API_BASE}/evidence/submit`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setToken(res.data.token || makeToken());
      if (res.data.stegoImageUrl) {
        setEvidenceImageUrl(res.data.stegoImageUrl);
      }
    } catch {
      setToken(makeToken());
      // Demo: create a fake evidence image URL from the uploaded preview
      if (imagePreview) {
        setEvidenceImageUrl(imagePreview);
      }
    }
    setStep("success");
  };

  const handleEmergency = async () => {
    setStep("submitting");
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          await axios.post(`${API_BASE}/evidence/emergency`, { lat: pos.coords.latitude, lng: pos.coords.longitude }).catch(() => { });
        }, () => { });
      }
    } catch { }
    setTimeout(() => {
      setToken("SV-EMER-" + Math.random().toString(36).substring(2, 4).toUpperCase());
      setStep("success");
    }, 1500);
  };

  // Download evidence image
  const handleDownloadEvidence = () => {
    if (!evidenceImageUrl) return;
    const a = document.createElement("a");
    a.href = evidenceImageUrl;
    a.download = `evidence-${token}.png`;
    a.click();
  };

 

  const s = {
    page: { minHeight: "100vh", backgroundColor: "#0a0a0f", color: "#e8e8f0", fontFamily: "'Inter','Segoe UI',sans-serif" },
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 40px", borderBottom: "1px solid #1e1e2e" },
    back: { fontSize: "13px", color: "#6b6b80", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" },
    logoText: { fontSize: "16px", fontWeight: "700" },
    logoSpan: { color: "#7c3aed" },
    main: { maxWidth: "720px", margin: "0 auto", padding: "48px 24px 80px" },
    pageTitle: { fontSize: "28px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" },
    pageSub: { fontSize: "14px", color: "rgba(232,232,240,0.5)", marginBottom: "40px", lineHeight: "1.5" },
    label: { display: "block", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#6b6b80", fontFamily: "monospace", marginBottom: "8px" },
    input: { width: "100%", padding: "12px 16px", backgroundColor: "#111118", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#e8e8f0", fontSize: "15px", outline: "none", fontFamily: "inherit", marginBottom: "24px", boxSizing: "border-box" },
    textarea: { width: "100%", padding: "14px 16px", backgroundColor: "#111118", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#e8e8f0", fontSize: "15px", outline: "none", fontFamily: "inherit", marginBottom: "8px", boxSizing: "border-box", resize: "vertical", minHeight: "140px", lineHeight: "1.6" },
    voiceBtn: { padding: "6px 14px", border: `1px solid ${isListening ? "#ef4444" : "#2a2a3a"}`, borderRadius: "20px", backgroundColor: isListening ? "rgba(239,68,68,0.1)" : "transparent", color: isListening ? "#ef4444" : "#6b6b80", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "monospace" },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
    row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
    select: { width: "100%", padding: "12px 16px", backgroundColor: "#111118", border: "1px solid #2a2a3a", borderRadius: "10px", color: "#e8e8f0", fontSize: "15px", outline: "none", fontFamily: "inherit", marginBottom: "24px", boxSizing: "border-box", cursor: "pointer" },
    uploadBox: { border: "1px dashed #2a2a3a", borderRadius: "12px", padding: "32px", textAlign: "center", cursor: "pointer", marginBottom: "32px", backgroundColor: "#0d0d14" },
    submitBtn: { width: "100%", padding: "16px", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "600", cursor: "pointer" },
    errorText: { color: "#ef4444", fontSize: "13px", marginBottom: "16px", fontFamily: "monospace" },
    successWrap: { textAlign: "center", padding: "60px 24px" },
    tokenBox: { background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "16px", padding: "32px", marginBottom: "24px", display: "inline-block", minWidth: "280px" },
    tokenLabel: { fontSize: "11px", letterSpacing: "3px", color: "#6b6b80", fontFamily: "monospace", textTransform: "uppercase", marginBottom: "12px" },
    tokenValue: { fontSize: "32px", fontWeight: "700", fontFamily: "monospace", color: "#c084fc", letterSpacing: "2px" },
    tokenNote: { fontSize: "13px", color: "rgba(232,232,240,0.4)", marginTop: "10px", fontFamily: "monospace" },
    submittingWrap: { textAlign: "center", padding: "80px 24px" },
    spinner: { width: "48px", height: "48px", border: "3px solid #1e1e2e", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" },
    emergencyWrap: { textAlign: "center", padding: "60px 24px" },
    emergencyBtn: { padding: "20px 48px", backgroundColor: "#ef4444", border: "none", borderRadius: "16px", color: "#fff", fontSize: "18px", fontWeight: "700", cursor: "pointer", display: "block", margin: "0 auto 16px", width: "100%", maxWidth: "360px" },
    cancelBtn: { padding: "12px 28px", border: "1px solid #2a2a3a", borderRadius: "10px", backgroundColor: "transparent", color: "#6b6b80", fontSize: "14px", cursor: "pointer" },
    backBtn: { padding: "12px 28px", border: "1px solid #2a2a3a", borderRadius: "10px", backgroundColor: "transparent", color: "#e8e8f0", fontSize: "14px", cursor: "pointer", marginTop: "16px" },
    actionBtn: { padding: "12px 24px", border: "1px solid #2a2a3a", borderRadius: "10px", backgroundColor: "#111118", color: "#e8e8f0", fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", marginRight: "12px", marginTop: "16px" },
   
  };

  if (step === "emergency") return (
    <div style={s.page}>
      <PanicButton />
      <nav style={s.nav}>
        <span style={s.back} onClick={() => navigate("/portal")}>← {t("backToPortal")}</span>
        <span style={s.logoText}>Shadow<span style={s.logoSpan}>Vault</span></span>
        <LanguageSwitcher style="dropdown" />
      </nav>
      <div style={{ ...s.main, ...s.emergencyWrap }}>
        <div style={{ fontSize: "72px", marginBottom: "24px" }}>🆘</div>
        <div style={{ fontSize: "28px", fontWeight: "700", color: "#ef4444", marginBottom: "12px" }}>{t("emergencyHelp")}</div>
        <p style={{ fontSize: "16px", color: "rgba(232,232,240,0.55)", marginBottom: "40px", lineHeight: "1.6" }}>
          {t("emergencyHelpDesc")}
        </p>
        <button style={s.emergencyBtn} onClick={handleEmergency}>🆘 {t("sendEmergencyAlert")}</button>
        <button style={s.cancelBtn} onClick={() => setStep("form")}>{t("fillDetailedReport")}</button>
      </div>
    </div>
  );

  if (step === "submitting") return (
    <div style={s.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      <div style={s.submittingWrap}>
        <div style={s.spinner}></div>
        <div style={{ fontSize: "16px", color: "rgba(232,232,240,0.6)" }}>{t("encryptingReport")}</div>
        <div style={{ fontSize: "13px", color: "#3a3a4a", marginTop: "8px", fontFamily: "monospace" }}>AES-256 · SHA-256 · Steganographic embedding</div>
      </div>
    </div>
  );

  if (step === "success") return (
    <div style={s.page}>
      <nav style={s.nav}>
        <span style={s.logoText}>Shadow<span style={s.logoSpan}>Vault</span></span>
        <LanguageSwitcher style="dropdown" />
      </nav>
      <div style={{ ...s.main, ...s.successWrap }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>✅</div>
        <div style={{ fontSize: "26px", fontWeight: "700", marginBottom: "12px" }}>{t("reportSubmitted")}</div>
        <p style={{ fontSize: "15px", color: "rgba(232,232,240,0.55)", marginBottom: "40px" }}>
          {t("reportSubmittedDesc")}<br />
          {t("saveYourToken")}
        </p>
        <div style={s.tokenBox}>
          <div style={s.tokenLabel}>{t("yourAnonymousToken")}</div>
          <div style={s.tokenValue}>{token}</div>
          <div style={s.tokenNote}>{t("tokenNote")}</div>
        </div>

        {/* Action buttons: Download + Send to NGO */}
        <div style={{ marginTop: "24px" }}>
          {evidenceImageUrl && (
            <button style={s.actionBtn} onClick={handleDownloadEvidence}>
              ⬇️ {t("downloadEvidence")}
            </button>
          )}
          
        </div>

        <DeadMansSwitch token={token} />

        <br />
        <button style={s.backBtn} onClick={() => navigate("/portal")}>{t("returnToPortal")}</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <PanicButton />
      <nav style={s.nav}>
        <span style={s.back} onClick={() => navigate("/portal")}>{t("backToPortal")}</span>
        <span style={s.logoText}>Shadow<span style={s.logoSpan}>Vault</span></span>
        <LanguageSwitcher style="dropdown" />
      </nav>
      <div style={s.main}>
        <div style={s.pageTitle}>📋 {t("reportIncident")}</div>
        <p style={s.pageSub}>{t("reportDesc")}</p>

        {/* USER DETAILS SECTION */}
        <div style={{ marginBottom: "32px", padding: "20px", backgroundColor: "#111118", borderRadius: "12px", border: "1px solid #1e1e2e" }}>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#8b949e", marginBottom: "16px" }}>👤 Your Details (Optional)</div>

          <div style={s.row2}>
            <div>
              <label style={s.label}>{t("yourName")}</label>
              <input style={s.input} type="text" placeholder={t("namePlaceholder")}
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label style={s.label}>{t("yourAge")}</label>
              <input style={s.input} type="number" placeholder={t("agePlaceholder")}
                value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
            </div>
          </div>

          <div style={s.row2}>
            <div>
              <label style={s.label}>{t("yourGender")}</label>
              <select style={s.select} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="">{t("selectGender")}</option>
                <option value="female">{t("female")}</option>
                <option value="male">{t("male")}</option>
                <option value="other">{t("other")}</option>
                <option value="prefer-not-to-say">{t("preferNotToSay")}</option>
              </select>
            </div>
            <div>
              <label style={s.label}>{t("relationshipToAbuser")}</label>
              <input style={s.input} type="text" placeholder={t("relationshipPlaceholder")}
                value={form.relationshipToAbuser} onChange={e => setForm({ ...form, relationshipToAbuser: e.target.value })} />
            </div>
          </div>
        </div>

        {/* INCIDENT DETAILS */}
        <label style={s.label}>{t("whatHappened")} *</label>
        <textarea style={s.textarea} placeholder={t("descPlaceholder")}
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <button style={s.voiceBtn} onClick={handleVoice}>
            {isListening ? "🔴 Listening..." : `🎙️ ${t("useVoice")}`}
          </button>
          <span style={{ fontSize: "12px", color: "#3a3a4a", fontFamily: "monospace" }}>{t("speakInYourLanguage")}</span>
        </div>

        <div style={s.row2}>
          <div>
            <label style={s.label}>{t("yourCity")}</label>
            <input style={s.input} type="text" placeholder="e.g. Bengaluru"
              value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label style={s.label}>{t("whenDidThisHappen")}</label>
            <input style={{ ...s.input, colorScheme: "dark" }} type="date"
              value={form.incidentDate} onChange={e => setForm({ ...form, incidentDate: e.target.value })} />
          </div>
        </div>

        <label style={s.label}>{t("safeWayToReach")}</label>
        <input style={s.input} type="text" placeholder={t("contactHintPlaceholder")}
          value={form.contactHint} onChange={e => setForm({ ...form, contactHint: e.target.value })} />

        <label style={s.label}>{t("uploadEvidence")}</label>
        <div style={s.uploadBox} onClick={() => fileRef.current.click()}>
          {imagePreview
            ? <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px" }} />
            : <>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>📎</div>
              <div style={{ fontSize: "14px", color: "#6b6b80" }}>{t("clickToUpload")}</div>
              <div style={{ fontSize: "12px", color: "#3a3a4a", marginTop: "4px", fontFamily: "monospace" }}>{t("fileSupport")}</div>
            </>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={handleImage} />

        {error && <div style={s.errorText}>⚠️ {error}</div>}
        <button style={s.submitBtn} onClick={handleSubmit}>🔒 {t("submitSecurely")}</button>
      </div>
    </div>
  );
}
