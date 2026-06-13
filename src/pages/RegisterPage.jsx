import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegisterPage = () => {
  // Form field state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Simple email format check
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Calls POST /api/auth/register
      const data = await registerUser(name, email, password);

      // Backend returns: { message: "User registered successfully" }
      setSuccess(data.message || 'Registered successfully! Redirecting to login...');

      // Redirect to login after a short delay so the user sees the message
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
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

        <h4 className="text-light mb-3">Create Account</h4>

        {/* Error message display */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Success message display */}
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <div className="mb-3">
            <label className="form-label text-light">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm password field */}
          <div className="mb-3">
            <label className="form-label text-light">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Link to Login page */}
        <p className="text-center text-secondary mb-0">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2dd4bf' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;