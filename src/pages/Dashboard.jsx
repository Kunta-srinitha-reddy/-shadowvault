import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import { useAuth } from '../context/AuthContext';

// 6 feature cards — matches your project features
const features = [
  {
    icon: '🖼️',
    title: 'Image Steganography',
    description: 'Hide secret messages inside ordinary images using Adaptive LSB encryption. AES-256 double layer protection.',
    route: '/image-stego',
    color: '#9d4edd',
  },
  {
    icon: '🎵',
    title: 'Audio Steganography',
    description: 'Embed hidden text inside MP3 audio files. The audio sounds completely normal to the human ear.',
    route: '/audio-stego',
    color: '#2dd4bf',
  },
  {
    icon: '💬',
    title: 'Secret Chat',
    description: 'Real-time messaging where every message is automatically hidden inside a shared image. WhatsApp style.',
    route: '/secret-chat',
    color: '#f59e0b',
  },
  {
    icon: '🔳',
    title: 'QR Steganography',
    description: 'One QR code carries two meanings — public content for normal scanners, hidden secret for our app.',
    route: '/qr-stego',
    color: '#10b981',
  },
  {
    icon: '🔍',
    title: 'Analyse Image',
    description: 'AI-powered steganalysis detects hidden data inside any image with a confidence percentage score.',
    route: '/analyse',
    color: '#f85149',
  },
  {
    icon: '🕒',
    title: 'History',
    description: 'View all your past encrypt, decrypt, and chat activities with status, file names, and timestamps.',
    route: '/history',
    color: '#8b949e',
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Extract username from email (e.g. "srinitha" from "srinitha@gmail.com")
  const username = user?.email ? user.email.split('@')[0] : 'User';

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh' }}>
      {/* Sticky navbar with profile + logout */}
      <Navbar />

      <div className="container py-5">
        {/* Welcome section */}
        <div className="mb-5">
          <p style={{ color: '#2dd4bf', fontSize: '0.9rem', marginBottom: '4px' }}>
            {getGreeting()},
          </p>
          <h2 style={{ color: '#e6edf3', fontWeight: 700, marginBottom: '8px' }}>
            {username} 👋
          </h2>
          <p style={{ color: '#8b949e', fontSize: '0.95rem' }}>
            What would you like to hide today?
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="d-flex flex-wrap gap-4 mb-5 p-4 rounded"
          style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}
        >
          <div>
            <p className="mb-0" style={{ color: '#8b949e', fontSize: '0.8rem' }}>FEATURES</p>
            <h4 className="mb-0" style={{ color: '#9d4edd', fontWeight: 700 }}>6</h4>
          </div>
          <div style={{ borderLeft: '1px solid #30363d', paddingLeft: '1.5rem' }}>
            <p className="mb-0" style={{ color: '#8b949e', fontSize: '0.8rem' }}>ENCRYPTION</p>
            <h4 className="mb-0" style={{ color: '#2dd4bf', fontWeight: 700 }}>AES-256</h4>
          </div>
          <div style={{ borderLeft: '1px solid #30363d', paddingLeft: '1.5rem' }}>
            <p className="mb-0" style={{ color: '#8b949e', fontSize: '0.8rem' }}>ALGORITHM</p>
            <h4 className="mb-0" style={{ color: '#f59e0b', fontWeight: 700 }}>Adaptive LSB</h4>
          </div>
          <div style={{ borderLeft: '1px solid #30363d', paddingLeft: '1.5rem' }}>
            <p className="mb-0" style={{ color: '#8b949e', fontSize: '0.8rem' }}>STATUS</p>
            <h4 className="mb-0" style={{ color: '#10b981', fontWeight: 700 }}>● Active</h4>
          </div>
        </div>

        {/* Feature cards heading */}
        <h5 style={{ color: '#8b949e', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1.5rem' }}>
          CHOOSE A FEATURE
        </h5>

        {/* 6 Feature cards grid */}
        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                route={feature.route}
                color={feature.color}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
