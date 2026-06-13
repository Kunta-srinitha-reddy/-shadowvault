import { Link } from 'react-router-dom';

// Feature highlights shown on the landing page
const features = [
  {
    icon: '🖼️',
    title: 'Image Steganography',
    description: 'Hide secret messages inside ordinary images using Adaptive LSB encryption.',
  },
  {
    icon: '🎵',
    title: 'Audio Steganography',
    description: 'Embed hidden text inside MP3 files that sound completely normal.',
  },
  {
    icon: '💬',
    title: 'Secret Chat',
    description: 'Real-time messaging where every message is hidden inside a shared image.',
  },
  {
    icon: '🔳',
    title: 'QR Steganography',
    description: 'One QR code, two meanings — public content and a hidden secret.',
  },
  {
    icon: '🔍',
    title: 'AI Steganalysis',
    description: 'Machine learning detects hidden data inside any image with a confidence score.',
  },
  {
    icon: '🔐',
    title: 'AES 256 + LSB',
    description: 'Messages are encrypted before hiding, so even extracted bits are useless.',
  },
];

const LandingPage = () => {
  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      {/* ===== Top bar with logo and auth buttons ===== */}
      <nav className="d-flex justify-content-between align-items-center px-4 px-md-5 py-3">
        <h4 className="m-0" style={{ color: '#9d4edd', fontWeight: 700 }}>
          ShadowVault
        </h4>
        <div>
          <Link to="/login" className="btn btn-outline-light me-2">
            Login
          </Link>
          <Link
            to="/register"
            className="btn"
            style={{ backgroundColor: '#9d4edd', color: '#fff', border: 'none' }}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* ===== Hero section ===== */}
      <div className="text-center px-3" style={{ padding: '5rem 1rem 4rem' }}>
        <h1 className="display-4 fw-bold text-light mb-3">
          Shadow<span style={{ color: '#9d4edd' }}>Vault</span>
        </h1>
        <p className="lead mb-2" style={{ color: '#2dd4bf' }}>
          Hide in plain sight.
        </p>
        <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '600px' }}>
          A secure multi-layer steganographic communication system. Messages, images, and
          audio that look completely ordinary — but carry secrets only you can unlock.
        </p>
        <Link
          to="/register"
          className="btn btn-lg me-2"
          style={{ backgroundColor: '#9d4edd', color: '#fff', border: 'none' }}
        >
          Get Started
        </Link>
        <Link to="/login" className="btn btn-lg btn-outline-light">
          I already have an account
        </Link>
      </div>

      {/* ===== Feature highlights grid ===== */}
      <div className="container pb-5">
        <h3 className="text-center text-light mb-4">What you can do</h3>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div
                className="p-4 h-100 rounded"
                style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
              >
                <div className="fs-1 mb-2">{feature.icon}</div>
                <h5 className="text-light">{feature.title}</h5>
                <p className="text-secondary mb-0">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="text-center text-secondary py-4" style={{ borderTop: '1px solid #30363d' }}>
        <small>ShadowVault — Final Year Project</small>
      </footer>
    </div>
  );
};

export default LandingPage;