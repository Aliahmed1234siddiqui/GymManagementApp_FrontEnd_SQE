import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        
        :root {
          --primary: #373255;
          --primary-dark: #373255;
          --accent: #0099FF;
          --bg: #F8F9FA;
          --surface: #FFFFFF;
          --surface-2: #F1F3F5;
          --text: #1A1D29;
          --text-muted: #6C757D;
          --text-light: #ADB5BD;
          --border: #E0E4E8;
          --border-2: #DEE2E6;
          --shadow: rgba(0, 0, 0, 0.08);
          --font-display: 'Rajdhani', sans-serif;
          --font-mono: 'Space Mono', monospace;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .legal-page {
          min-height: 100vh;
          background: var(--bg);
          position: relative;
          overflow-x: hidden;
          font-family: var(--font-display);
        }

        .legal-page::before {
          content: '';
          position: absolute;
          width: 150%;
          height: 150%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(55, 50, 85, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 153, 255, 0.05) 0%, transparent 50%);
          animation: bgFloat 20s ease-in-out infinite;
        }

        @keyframes bgFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-5%, -5%) rotate(5deg); }
        }

        .legal-page::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .legal-nav {
          position: relative;
          z-index: 10;
          padding: 24px 40px;
          border-bottom: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--border);
          padding: 10px 20px;
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .back-btn:hover {
          border-color: var(--primary);
          background: rgba(55, 50, 85, 0.08);
          transform: translateX(-4px);
        }

        .logo-link {
          height: 50px;
        }

        .logo-link img {
          height: 100%;
          filter: drop-shadow(0 4px 12px rgba(55, 50, 85, 0.15));
        }

        .legal-container {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 40px;
        }

        .legal-header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .legal-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(0, 153, 255, 0.1);
          border: 1px solid var(--accent);
          border-radius: 30px;
          color: var(--accent);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 24px;
          font-family: var(--font-mono);
        }

        .legal-header h1 {
          font-size: 52px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .legal-header .update-date {
          font-size: 15px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .legal-content {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 4px 20px var(--shadow);
          animation: fadeInUp 0.8s ease-out;
        }

        .legal-section {
          margin-bottom: 40px;
        }

        .legal-section:last-child {
          margin-bottom: 0;
        }

        .legal-section h2 {
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--accent) 0%, #007ACC 100%);
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          color: white;
          font-family: var(--font-mono);
        }

        .legal-section h3 {
          font-size: 20px;
          font-weight: 600;
          color: var(--text);
          margin: 24px 0 12px 0;
        }

        .legal-section p {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .legal-section ul,
        .legal-section ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .legal-section li {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .legal-section li strong {
          color: var(--text);
          font-weight: 600;
        }

        .highlight-box {
          background: rgba(0, 153, 255, 0.06);
          border-left: 3px solid var(--accent);
          padding: 20px 24px;
          border-radius: 8px;
          margin: 24px 0;
        }

        .highlight-box p {
          margin-bottom: 0;
          color: var(--text);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin: 24px 0;
        }

        .info-card {
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s;
        }

        .info-card:hover {
          background: var(--surface);
          border-color: var(--accent);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow);
        }

        .info-card-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent);
          margin-bottom: 8px;
          font-family: var(--font-mono);
        }

        .info-card-content {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .contact-section {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .contact-section h3 {
          font-size: 24px;
          color: var(--text);
          margin-bottom: 16px;
        }

        .contact-section p {
          font-size: 16px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .contact-links {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s;
        }

        .contact-btn:hover {
          border-color: var(--accent);
          background: rgba(0, 153, 255, 0.06);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--shadow);
        }

        @media (max-width: 768px) {
          .legal-container {
            padding: 40px 20px;
          }

          .legal-content {
            padding: 32px 24px;
          }

          .legal-header h1 {
            font-size: 36px;
          }

          .legal-section h2 {
            font-size: 24px;
          }

          .nav-container {
            padding: 0 20px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="legal-nav">
        <div className="nav-container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <a href="/" className="logo-link">
            <img src='./public/mass_gym_logo.png' alt='Mass Gym Logo' />
          </a>
        </div>
      </nav>

      <div className="legal-container">
        <div className="legal-header">
          <div className="legal-badge">Privacy Notice</div>
          <h1>Privacy Policy</h1>
          <p className="update-date">Last Updated: May 21, 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>
              <span className="section-number">1</span>
              Introduction
            </h2>
            <p>
              At Mass Gym, we are committed to protecting your privacy and ensuring the security of your 
              personal information. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your data when you use our services, facilities, and digital platforms.
            </p>
            <div className="highlight-box">
              <p>
                <strong>Your Trust Matters:</strong> We will never sell your personal information to 
                third parties. Your data is used solely to provide and improve our services.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">2</span>
              Information We Collect
            </h2>
            <h3>2.1 Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-card-title">Contact Info</div>
                <div className="info-card-content">
                  Name, email address, phone number, mailing address
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Account Data</div>
                <div className="info-card-content">
                  Username, password, membership ID, profile photo
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Payment Info</div>
                <div className="info-card-content">
                  Billing address, payment method details (encrypted)
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Health Data</div>
                <div className="info-card-content">
                  Emergency contacts, medical conditions (voluntary)
                </div>
              </div>
            </div>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li><strong>Access Logs:</strong> QR code scans, facility entry/exit times</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages viewed, features used, time spent in app</li>
              <li><strong>Workout Data:</strong> Exercise tracking, progress metrics (if enabled)</li>
              <li><strong>Location Data:</strong> Approximate location for facility check-ins</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <p>
              We may receive information from payment processors, social media platforms (if you connect 
              your accounts), and publicly available sources for identity verification.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">3</span>
              How We Use Your Information
            </h2>
            <p>We use your personal information for the following purposes:</p>
            <ul>
              <li><strong>Service Delivery:</strong> Managing your membership, processing payments, providing facility access</li>
              <li><strong>Communication:</strong> Sending confirmations, updates, promotional offers, and service notifications</li>
              <li><strong>Personalization:</strong> Customizing your experience and recommending relevant services</li>
              <li><strong>Analytics:</strong> Understanding usage patterns to improve our facilities and services</li>
              <li><strong>Security:</strong> Protecting against fraud, unauthorized access, and other illegal activities</li>
              <li><strong>Legal Compliance:</strong> Meeting regulatory requirements and responding to legal requests</li>
              <li><strong>Research:</strong> Conducting anonymized studies to improve fitness programs</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">4</span>
              How We Share Your Information
            </h2>
            <p>We may share your information in the following circumstances:</p>
            <h3>4.1 Service Providers</h3>
            <p>
              We work with trusted third-party service providers who assist with payment processing, 
              email delivery, data analytics, and customer support. These providers are contractually 
              obligated to protect your data.
            </p>
            <h3>4.2 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be 
              transferred to the acquiring entity.
            </p>
            <h3>4.3 Legal Requirements</h3>
            <p>
              We may disclose your information if required by law, court order, or government request, 
              or to protect the rights, property, and safety of Mass Gym, our users, or the public.
            </p>
            <h3>4.4 With Your Consent</h3>
            <p>
              We may share your information for any other purpose with your explicit consent.
            </p>
            <div className="highlight-box">
              <p>
                <strong>We Never Sell Your Data:</strong> Mass Gym does not and will never sell your 
                personal information to advertisers or data brokers.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">5</span>
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All sensitive data is encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
              <li><strong>Access Controls:</strong> Strict role-based access limitations for staff</li>
              <li><strong>Regular Audits:</strong> Periodic security assessments and vulnerability testing</li>
              <li><strong>Secure Infrastructure:</strong> Data hosted on certified secure servers</li>
              <li><strong>Incident Response:</strong> Comprehensive plan for detecting and responding to breaches</li>
            </ul>
            <p>
              However, no method of transmission over the internet is 100% secure. We cannot guarantee 
              absolute security, but we are committed to protecting your data using reasonable measures.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">6</span>
              Your Privacy Rights
            </h2>
            <p>You have the following rights regarding your personal information:</p>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-card-title">Access</div>
                <div className="info-card-content">
                  Request a copy of the personal data we hold about you
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Correction</div>
                <div className="info-card-content">
                  Update or correct inaccurate information
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Deletion</div>
                <div className="info-card-content">
                  Request deletion of your personal data (with some exceptions)
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Opt-Out</div>
                <div className="info-card-content">
                  Unsubscribe from marketing communications at any time
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Portability</div>
                <div className="info-card-content">
                  Request your data in a portable format
                </div>
              </div>
              <div className="info-card">
                <div className="info-card-title">Restriction</div>
                <div className="info-card-content">
                  Limit how we process your information
                </div>
              </div>
            </div>
            <p>
              To exercise any of these rights, please contact us at privacy@massgym.com. We will 
              respond to your request within 30 days.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">7</span>
              Data Retention
            </h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes 
              outlined in this policy, unless a longer retention period is required by law. Specific 
              retention periods:
            </p>
            <ul>
              <li><strong>Active Memberships:</strong> Duration of membership plus 3 years</li>
              <li><strong>Payment Records:</strong> 7 years for tax and accounting purposes</li>
              <li><strong>Access Logs:</strong> 1 year for security and operational purposes</li>
              <li><strong>Marketing Data:</strong> Until you opt-out or request deletion</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">8</span>
              Cookies & Tracking
            </h2>
            <p>
              Our website and mobile app use cookies and similar technologies to enhance your experience:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
            </ul>
            <p>
              You can control cookie preferences through your browser settings. Note that disabling 
              cookies may affect functionality.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">9</span>
              Children's Privacy
            </h2>
            <p>
              Mass Gym services are not directed to individuals under 16. We do not knowingly collect 
              personal information from children. If you believe we have inadvertently collected 
              information from a child, please contact us immediately.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">10</span>
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or legal requirements. We will notify you of significant changes via email or in-app 
              notification. The "Last Updated" date at the top indicates when the policy was last revised.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">11</span>
              International Data Transfers
            </h2>
            <p>
              Your information may be transferred to and processed in countries other than Pakistan. 
              We ensure that such transfers comply with applicable data protection laws and that 
              appropriate safeguards are in place.
            </p>
          </div>

          <div className="contact-section">
            <h3>Privacy Questions or Concerns?</h3>
            <p>
              If you have questions about this Privacy Policy or want to exercise your privacy rights, 
              please contact our Data Protection Officer:
            </p>
            <div className="contact-links">
              <a href="mailto:privacy@massgym.com" className="contact-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                privacy@massgym.com
              </a>
              <a href="https://wa.me/03316037964" target="_blank" rel="noreferrer" className="contact-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}