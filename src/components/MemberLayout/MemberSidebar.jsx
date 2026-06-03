import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MemberSidebar({ collapsed, onToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const menuItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
      label: 'Dashboard',
      path: '/member',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
      label: 'My Card',
      path: '/member/card',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      label: 'Payments',
      path: '/member/payments',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      label: 'Notifications',
      path: '/member/notifications',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      label: 'Settings',
      path: '/member/settings',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .member-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 200;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 260px;
        }

        .member-sidebar.collapsed { width: 80px; }

        /* ── Header ── */
        .ms-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 76px;
        }

        .ms-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          overflow: hidden;
        }

        .ms-logo img {
          height: 45px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }

        .member-sidebar.collapsed .ms-logo img { height: 40px; }

        .ms-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          font-family: var(--font-display);
          white-space: nowrap;
          transition: opacity 0.3s;
        }

        .member-sidebar.collapsed .ms-logo-text { opacity: 0; width: 0; }

        .ms-toggle {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .ms-toggle:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .member-sidebar.collapsed .ms-toggle { margin: 0 auto; }

        /* ── Member badge chip ── */
        .ms-member-chip {
          margin: 12px 16px;
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(55,50,85,0.08) 0%, rgba(55,50,85,0.04) 100%);
          border: 1px solid rgba(55,50,85,0.15);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: opacity 0.3s;
          overflow: hidden;
        }

        .member-sidebar.collapsed .ms-member-chip { opacity: 0; height: 0; margin: 0; padding: 0; border: none; }

        .ms-chip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(40,167,69,0.2);
        }

        .ms-chip-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── Nav ── */
        .ms-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .ms-nav::-webkit-scrollbar { width: 4px; }
        .ms-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .ms-nav-section {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 4px 14px 8px;
          transition: opacity 0.3s;
        }

        .member-sidebar.collapsed .ms-nav-section { opacity: 0; height: 0; padding: 0; }

        .ms-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          font-family: var(--font-display);
          transition: all 0.2s;
          margin-bottom: 4px;
          position: relative;
        }

        .ms-link:hover {
          background: var(--surface-2);
          color: var(--text);
        }

        .ms-link.active {
          background: linear-gradient(135deg, rgba(55,50,85,0.1) 0%, rgba(55,50,85,0.05) 100%);
          color: var(--primary);
          font-weight: 600;
        }

        .ms-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 24px;
          background: var(--primary);
          border-radius: 0 2px 2px 0;
        }

        .ms-link-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ms-link-label {
          white-space: nowrap;
          transition: opacity 0.3s;
        }

        .member-sidebar.collapsed .ms-link-label { opacity: 0; width: 0; }
        .member-sidebar.collapsed .ms-link { justify-content: center; padding: 12px; }
        .member-sidebar.collapsed .ms-nav { padding: 16px 8px; }

        /* ── Footer ── */
        .ms-footer {
          padding: 16px;
          border-top: 1px solid var(--border);
          background: var(--surface-2);
        }

        .ms-footer-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
        }

        .ms-footer-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-display);
        }

        .ms-footer-text {
          flex: 1;
          overflow: hidden;
          transition: opacity 0.3s;
        }

        .member-sidebar.collapsed .ms-footer-text { opacity: 0; width: 0; }

        .ms-footer-sublabel {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-mono);
        }

        .ms-footer-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Mobile ── */
        @media (max-width: 1024px) {
          .member-sidebar {
            transform: translateX(-100%);
            box-shadow: none;
            width: 260px;
          }

          .member-sidebar.collapsed { width: 260px; }

          .member-sidebar.collapsed .ms-logo-text,
          .member-sidebar.collapsed .ms-link-label,
          .member-sidebar.collapsed .ms-footer-text,
          .member-sidebar.collapsed .ms-member-chip,
          .member-sidebar.collapsed .ms-nav-section {
            opacity: 1;
            width: auto;
            height: auto;
            margin: 12px 16px;
            padding: 8px 12px;
          }

          .member-sidebar.collapsed .ms-nav-section {
            margin: 0;
            padding: 4px 14px 8px;
          }

          .member-sidebar.collapsed .ms-link { justify-content: flex-start; padding: 12px 14px; }
          .member-sidebar.collapsed .ms-nav { padding: 16px 12px; }

          .member-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0,0,0,0.15);
          }
        }

        /* ── Mobile FAB ── */
        .ms-mobile-btn {
          display: none;
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border: none;
          color: white;
          cursor: pointer;
          z-index: 201;
          box-shadow: 0 4px 16px rgba(55,50,85,0.4);
          transition: all 0.3s;
          align-items: center;
          justify-content: center;
        }

        .ms-mobile-btn:hover { transform: scale(1.05); }
        .ms-mobile-btn:active { transform: scale(0.95); }

        @media (max-width: 1024px) {
          .ms-mobile-btn { display: flex; }
        }

        .ms-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 199;
          backdrop-filter: blur(4px);
          animation: msFadeIn 0.2s ease-out;
        }

        @keyframes msFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="ms-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile FAB */}
      <button
        className="ms-mobile-btn"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen
            ? <path d="M18 6L6 18M6 6l12 12"/>
            : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
          }
        </svg>
      </button>

      <aside className={`member-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>

        {/* Logo */}
        <div className="ms-header">
          <div className="ms-logo">
            <img src="/mass_gym_logo.png" alt="Mass Gym" />
            <div className="ms-logo-text">Mass Gym</div>
          </div>
          <button className="ms-toggle" onClick={onToggle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>
              }
            </svg>
          </button>
        </div>

        {/* Member chip */}
        <div className="ms-member-chip">
          <div className="ms-chip-dot" />
          <div className="ms-chip-label">Member Portal</div>
        </div>

        {/* Nav */}
        <nav className="ms-nav">
          <div className="ms-nav-section">Navigation</div>
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/member'}
              className={({ isActive }) => `ms-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <div className="ms-link-icon">{item.icon}</div>
              <span className="ms-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer — shows member name from localStorage / context if needed */}
        <div className="ms-footer">
          <div className="ms-footer-card">
            <div className="ms-footer-icon">M</div>
            <div className="ms-footer-text">
              <div className="ms-footer-sublabel">Logged in as</div>
              <div className="ms-footer-name">Member</div>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}