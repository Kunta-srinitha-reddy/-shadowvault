import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  // Form field state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // Call placeholder API - teammate will hook up the real backend
      const data = await loginUser(email, password);

      // data.token expected from backend response
      login(data.token, { email });

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      // Show backend error message if available, else a generic message
      const message =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: '#0d1117' }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{ width: '100%', maxWidth: '400px', backgroundColor: '#161b22', border: '1px solid #30363d' }}
      >
        <h2 className="text-center mb-1" style={{ color: '#9d4edd' }}>
          ShadowVault
        </h2>
        <p className="text-center text-secondary mb-4">Hide in plain sight</p>

        <h4 className="text-light mb-3">Login</h4>

        {/* Error message display */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password field */}
          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit button with loading state */}
          <button
            type="submit"
            className="btn w-100 mb-3"
            style={{ backgroundColor: '#9d4edd', color: '#fff', border: 'none' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Link to Register page */}
        <p className="text-center text-secondary mb-0">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2dd4bf' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
