import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import LandingPage from "./pages/LandingPage";
import PortalPage from "./pages/PortalPage";
import EvidencePage from "./pages/EvidencePage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/status" element={
            <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ color: "#444", fontFamily: "system-ui,sans-serif" }}>Case status — coming soon.</p>
            </div>
          } />
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
}

export default App;