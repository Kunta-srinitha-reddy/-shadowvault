import { HashRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import PortalPage from "./pages/PortalPage";
import EvidencePage from "./pages/EvidencePage";
import NGOLandingPage from "./pages/NGOLandingPage";
import NGOLoginPage from "./pages/NGOLoginPage";
import NGORegisterPage from "./pages/NGORegisterPage";
import NGODashboardPlaceholder from "./pages/NGODashboardPlaceholder";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route path="/evidence" element={<EvidencePage />} />
            <Route path="/chat" element={
              <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#444", fontFamily: "system-ui,sans-serif" }}>Counselor chat — coming soon.</p>
              </div>
            } />
            <Route path="/status" element={
              <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#444", fontFamily: "system-ui,sans-serif" }}>Case status — coming soon.</p>
              </div>
            } />

            {/* NGO partner portal */}
            <Route path="/ngo" element={<NGOLandingPage />} />
            <Route path="/ngo-login" element={<NGOLoginPage />} />
            <Route path="/ngo-register" element={<NGORegisterPage />} />
            <Route path="/ngo-dashboard" element={<NGODashboardPlaceholder />} />
          </Routes>
        </HashRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;