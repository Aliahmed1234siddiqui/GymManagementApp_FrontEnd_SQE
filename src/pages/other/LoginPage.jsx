import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/common/UI';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { 
      setError('Both fields are required.'); 
      return; 
    }
    setLoading(true); 
    setError('');
    try {
      const user = await login(email, password);
      toast(`Welcome back, ${user.name}!`, 'success');
      navigate(user.role === 'admin' ? '/admin' : '/member', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        :root {
          --primary: #373255;
          --primary-dark: #373255;
          --primary-light: #373255;
          --accent: #0099FF;
          --bg: #F8F9FA;
          --surface: #FFFFFF;
          --surface-2: #F1F3F5;
          --surface-3: #E9ECEF;
          --text: #1A1D29;
          --text-muted: #6C757D;
          --text-light: #ADB5BD;
          --border: #E0E4E8;
          --border-2: #DEE2E6;
          --error: #DC3545;
          --success: #28A745;
          --shadow: rgba(0, 0, 0, 0.08);
          --shadow-lg: rgba(0, 0, 0, 0.12);
          --font-display: 'Rajdhani', sans-serif;
          --font-mono: 'Space Mono', monospace;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-container {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow: hidden;
          font-family: var(--font-display);
        }

        /* Animated background */
        .login-container::before {
          content: '';
          position: absolute;
          width: 150%;
          height: 150%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 77, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 153, 255, 0.06) 0%, transparent 50%);
          animation: bgFloat 20s ease-in-out infinite;
        }

        @keyframes bgFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(5deg); }
        }

        /* Noise texture overlay */
        .login-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .login-grid {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Left Panel - Form */
        .login-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          background: white;
          position: relative;
        }

        .form-wrapper {
          width: 100%;
          max-width: 460px;
          animation: slideInLeft 0.6s ease-out;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .logo-section {
          margin-bottom: 48px;
        }

        .logo-section img {
          height: 80px;
          filter: drop-shadow(0 4px 12px rgba(255, 77, 0, 0.15));
          animation: logoPulse 3s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .welcome-text {
          margin-top: 16px;
        }

        .welcome-text h1 {
          font-size: 36px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .welcome-text p {
          font-size: 16px;
          color: var(--text-muted);
          font-weight: 400;
        }

        /* Role Toggle */
        .role-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 32px;
          padding: 6px;
          background: var(--surface-2);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .role-btn {
          padding: 14px 20px;
          border: none;
          border-radius: 8px;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .role-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.5) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .role-btn:hover::before {
          opacity: 1;
        }

        .role-btn.inactive {
          background: var(--surface);
          color: var(--text-muted);
        }

        .role-btn.active.admin {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(255, 77, 0, 0.3);
        }

        .role-btn.active.member {
          background: linear-gradient(135deg, var(--accent) 0%, #007ACC 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(0, 153, 255, 0.3);
        }

        /* Error Alert */
        .error-alert {
          background: #FFF5F5;
          border: 1px solid #FEB2B2;
          border-radius: 8px;
          padding: 14px 16px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        .error-alert svg {
          flex-shrink: 0;
        }

        .error-alert span {
          color: var(--error);
          font-size: 14px;
          font-weight: 500;
        }

        /* Form Elements */
        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-bottom: 10px;
          font-family: var(--font-mono);
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-size: 15px;
          font-family: var(--font-display);
          font-weight: 500;
          transition: all 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          background: var(--surface);
          box-shadow: 0 0 0 3px rgba(255, 77, 0, 0.1);
        }

        .form-input::placeholder {
          color: var(--text-muted);
          opacity: 0.5;
        }

        .toggle-password {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .toggle-password:hover {
          color: var(--primary);
        }

        .forgot-password {
          text-align: right;
          margin-top: 12px;
          margin-bottom: 32px;
        }

        .forgot-password a {
          color: var(--primary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .forgot-password a:hover {
          color: var(--primary-light);
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          padding: 18px 32px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(255, 77, 0, 0.4);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s;
        }

        .submit-btn:hover::before {
          transform: translateX(100%);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(255, 77, 0, 0.6);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 32px 0;
          color: var(--text-muted);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-mono);
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* WhatsApp Button */
        .whatsapp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 16px 24px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          color: var(--text);
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .whatsapp-btn:hover {
          border-color: #25D366;
          background: #F0FFF4;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.15);
        }

        .whatsapp-icon {
          width: 24px;
          height: 24px;
          background: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 14px;
        }

        /* Footer */
        .login-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .login-footer a {
          color: var(--primary);
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-footer a:hover {
          color: var(--primary-light);
        }

        /* Right Panel - Hero */
        .login-hero-panel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.15;
          mix-blend-mode: overlay;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(55, 50, 85, 0.6) 0%,
            rgba(55, 50, 85, 0.8) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 80px 60px;
          max-width: 600px;
          animation: slideInRight 0.6s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 30px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
          font-family: var(--font-mono);
        }

        .hero-content h2 {
          font-size: 48px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .hero-content p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .stat-card {
          padding: 20px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px);
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
          font-family: var(--font-mono);
        }

        .stat-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.85);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .login-grid {
            grid-template-columns: 1fr;
          }

          .login-hero-panel {
            display: none;
          }

          .login-form-panel {
            padding: 40px 20px;
          }
        }

        @media (max-width: 640px) {
          .welcome-text h1 {
            font-size: 28px;
          }

          .hero-content h2 {
            font-size: 36px;
          }

          .form-wrapper {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="login-grid">
        {/* Left Panel - Form */}
        <div className="login-form-panel">
          <div className="form-wrapper">
            <div className="logo-section">
              <img src='/mass_gym_logo.png' alt='Mass Gym Logo' />
              <div className="welcome-text">
                <h1>Welcome Back</h1>
                <p>Sign in to access your gym dashboard</p>
              </div>
            </div>

            {/* Role Toggle */}
            <div className="role-toggle">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`role-btn ${role === 'admin' ? 'active admin' : 'inactive'}`}
              >
                Admin Portal
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`role-btn ${role === 'member' ? 'active member' : 'inactive'}`}
              >
                Member Access
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="error-alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'admin' ? 'admin@massgym.com' : 'member@massgym.com'}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <div className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input"
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="toggle-password"
                  >
                    {showPass ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

             

              <button
                type="submit"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? 'Authenticating...' : 'Sign In →'}
              </button>
            </form>

            <div className="divider">or</div>

            <a
              href="https://wa.me/03316037964?text=Hi%2C%20I%20want%20to%20join%20Mass%20Gym!"
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              <span className="whatsapp-icon">W</span>
              Not a member? Contact us on WhatsApp
            </a>

            <div className="login-footer">
              By signing in you agree to our{' '}
              <a href="/terms-and-conditions">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy-policy">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* Right Panel - Hero */}
        <div className="login-hero-panel">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
            alt="Gym"
            className="hero-image"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge">Mass Gym</div>
            <h2>Transform Your Fitness Journey</h2>
            <p>
              Experience the future of gym management. Track progress, manage memberships, 
              and achieve your fitness goals with our all-in-one platform.
            </p>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">5,000+</div>
                <div className="stat-label">Active Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Access</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Digital</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">QR</div>
                <div className="stat-label">Smart Cards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}