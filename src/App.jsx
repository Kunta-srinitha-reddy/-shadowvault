import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Placeholder routes - will be replaced as we build them */}
          <Route path="/image-stego" element={<h2 className="text-light p-4">Image Steganography coming soon...</h2>} />
          <Route path="/audio-stego" element={<h2 className="text-light p-4">Audio Steganography coming soon...</h2>} />
          <Route path="/secret-chat" element={<h2 className="text-light p-4">Secret Chat coming soon...</h2>} />
          <Route path="/qr-stego" element={<h2 className="text-light p-4">QR Steganography coming soon...</h2>} />
          <Route path="/analyse" element={<h2 className="text-light p-4">Analyse Image coming soon...</h2>} />
          <Route path="/history" element={<h2 className="text-light p-4">History coming soon...</h2>} />
        </Routes>
      </HashRouter>

      <ToastContainer theme="dark" />
    </AuthProvider>
  );
}

export default App;
