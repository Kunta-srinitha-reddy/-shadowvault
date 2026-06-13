import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Temporary: redirect home to login until other pages are built */}
          <Route path="/" element={<LandingPage />} />

          {/* Placeholder dashboard route - will be replaced */}
          <Route
            path="/dashboard"
            element={<h2 className="text-light p-4">Dashboard coming soon...</h2>}
          />

          {/* Placeholder register route - will be replaced */}
          <Route
            path="/register"
            element={<RegisterPage />} 
          />
        </Routes>
      </BrowserRouter>

      <ToastContainer theme="dark" />
    </AuthProvider>
  );
}

export default App;