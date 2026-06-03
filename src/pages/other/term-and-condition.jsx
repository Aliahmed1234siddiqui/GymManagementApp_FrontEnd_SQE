import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
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
          background: rgba(55, 50, 85, 0.1);
          border: 1px solid var(--primary);
          border-radius: 30px;
          color: var(--primary);
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
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
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
          background: rgba(55, 50, 85, 0.06);
          border-left: 3px solid var(--primary);
          padding: 20px 24px;
          border-radius: 8px;
          margin: 24px 0;
        }

        .highlight-box p {
          margin-bottom: 0;
          color: var(--text);
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
          border-color: var(--primary);
          background: rgba(55, 50, 85, 0.06);
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
            <img src='/mass_gym_logo.png' alt='Mass Gym Logo' />
          </a>
        </div>
      </nav>

      <div className="legal-container">
        <div className="legal-header">
          <div className="legal-badge">Legal Document</div>
          <h1>Terms & Conditions</h1>
          <p className="update-date">Last Updated: May 21, 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>
              <span className="section-number">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing and using Mass Gym's services, facilities, and digital platforms, you accept and 
              agree to be bound by these Terms and Conditions. If you do not agree to these terms, please 
              do not use our services.
            </p>
            <div className="highlight-box">
              <p>
                These terms constitute a legally binding agreement between you and Mass Gym. Please read 
                them carefully before proceeding.
              </p>
            </div>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">2</span>
              Membership & Registration
            </h2>
            <h3>2.1 Eligibility</h3>
            <p>
              You must be at least 16 years of age to register for a Mass Gym membership. Members under 
              18 require parental or guardian consent.
            </p>
            <h3>2.2 Account Responsibility</h3>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must provide accurate and complete information during registration</li>
              <li>You agree to update your information to keep it current</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>Membership cards and QR codes are non-transferable</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">3</span>
              Payment Terms
            </h2>
            <h3>3.1 Membership Fees</h3>
            <p>
              Membership fees are billed in advance on a monthly, quarterly, or annual basis as selected 
              during registration. All fees are non-refundable unless otherwise stated.
            </p>
            <h3>3.2 Payment Methods</h3>
            <ul>
              <li>We accept credit cards, debit cards, bank transfers, and mobile payments</li>
              <li>Payment information must be kept current</li>
              <li>Failed payments may result in membership suspension</li>
              <li>Late payment fees may apply after a 7-day grace period</li>
            </ul>
            <h3>3.3 Cancellation & Refunds</h3>
            <p>
              Memberships can be cancelled with 30 days' written notice. No refunds will be provided for 
              partial months. Annual memberships may receive a pro-rata refund if cancelled within the 
              first 30 days.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">4</span>
              Facility Usage
            </h2>
            <h3>4.1 Access Hours</h3>
            <p>
              Members have access to the gym during posted operating hours. Premium members may have 
              24/7 access where available. Hours are subject to change for holidays and maintenance.
            </p>
            <h3>4.2 Rules of Conduct</h3>
            <ul>
              <li>Follow all posted gym rules and staff instructions</li>
              <li>Use equipment properly and return it after use</li>
              <li>Maintain appropriate gym attire and hygiene standards</li>
              <li>No photography or videography without prior permission</li>
              <li>Harassment, intimidation, or inappropriate behavior will not be tolerated</li>
              <li>No smoking, vaping, or alcohol consumption on premises</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">5</span>
              Health & Safety
            </h2>
            <div className="highlight-box">
              <p>
                <strong>Important:</strong> You should consult with a physician before beginning any 
                exercise program. Mass Gym is not responsible for any injuries sustained while using 
                our facilities.
              </p>
            </div>
            <h3>5.1 Assumption of Risk</h3>
            <p>
              You acknowledge that physical exercise involves inherent risks. You assume all risks 
              associated with participation in gym activities, including but not limited to falls, 
              contact with other participants, and equipment-related injuries.
            </p>
            <h3>5.2 Medical Conditions</h3>
            <ul>
              <li>Inform staff of any medical conditions that may affect your ability to exercise safely</li>
              <li>Stop exercising immediately if you feel pain, dizziness, or discomfort</li>
              <li>Mass Gym reserves the right to refuse service to anyone for health and safety reasons</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">6</span>
              Privacy & Data Protection
            </h2>
            <p>
              Your privacy is important to us. We collect and process personal information in accordance 
              with our Privacy Policy. This includes:
            </p>
            <ul>
              <li>Contact information for account management</li>
              <li>Payment information for billing purposes</li>
              <li>Health information you voluntarily provide</li>
              <li>Facility access logs via QR code scanning</li>
              <li>Workout data if using our tracking features</li>
            </ul>
            <p>
              We will never sell your personal information to third parties. Data is stored securely 
              and used only for service provision and improvement.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">7</span>
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Mass Gym, its officers, employees, and affiliates 
              shall not be liable for:
            </p>
            <ul>
              <li>Any injuries, damages, or losses arising from use of our facilities or services</li>
              <li>Theft or damage to personal property</li>
              <li>Service interruptions or system downtime</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount you paid for membership in the past 12 months.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">8</span>
              Modifications to Terms
            </h2>
            <p>
              Mass Gym reserves the right to modify these Terms and Conditions at any time. We will 
              notify members of significant changes via email or in-app notification. Continued use of 
              our services after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">9</span>
              Termination
            </h2>
            <p>
              We reserve the right to terminate or suspend your membership immediately, without prior 
              notice, for conduct that we believe:
            </p>
            <ul>
              <li>Violates these Terms and Conditions</li>
              <li>Endangers the safety of staff or other members</li>
              <li>Involves illegal activity on our premises</li>
              <li>Involves fraudulent payment or account activity</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>
              <span className="section-number">10</span>
              Governing Law
            </h2>
            <p>
              These Terms and Conditions are governed by the laws of Pakistan. Any disputes arising from 
              these terms shall be subject to the exclusive jurisdiction of the courts in Karachi, Sindh.
            </p>
          </div>

          <div className="contact-section">
            <h3>Questions About These Terms?</h3>
            <p>If you have any questions or concerns about our Terms and Conditions, please contact us:</p>
            <div className="contact-links">
              <a href="mailto:legal@massgym.com" className="contact-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                legal@massgym.com
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