import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Sidebar({ collapsed, onToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route actually changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on resize up to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll while the mobile drawer is open
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
      path: '/admin'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      label: 'Members',
      path: '/admin/members'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      label: 'Payments',
      path: '/admin/payments'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      label: 'Plans',
      path: '/admin/plans'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
      label: 'Reports',
      path: '/admin/reports'
    }
  ];

  const toggleMobileMenu = () => setMobileOpen((v) => !v);

  return (
    <>
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
          --border: #E0E4E8;
          --error: #DC3545;
          --success: #28A745;
          --shadow: rgba(0, 0, 0, 0.08);
          --font-display: 'Rajdhani', sans-serif;
          --font-mono: 'Space Mono', monospace;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 200;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 260px;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 76px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          overflow: hidden;
        }

        .sidebar-logo img {
          height: 45px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }

        .sidebar.collapsed .sidebar-logo img {
          height: 40px;
        }

        .sidebar-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          font-family: var(--font-display);
          white-space: nowrap;
          transition: opacity 0.3s;
        }

        .sidebar.collapsed .sidebar-logo-text {
          opacity: 0;
          width: 0;
        }

        .sidebar-toggle {
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

        .sidebar-toggle:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .sidebar.collapsed .sidebar-toggle {
          margin: 0 auto;
        }

        .sidebar-menu {
          flex: 1;
          padding: 20px 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .sidebar-menu::-webkit-scrollbar { width: 4px; }
        .sidebar-menu::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

        .menu-item {
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

        .menu-item:hover {
          background: var(--surface-2);
          color: var(--text);
        }

        .menu-item.active {
          background: linear-gradient(135deg, rgba(55, 50, 85, 0.1) 0%, rgba(55, 50, 85, 0.05) 100%);
          color: var(--primary);
          font-weight: 600;
        }

        .menu-item.active::before {
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

        .menu-item-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-item-label {
          white-space: nowrap;
          transition: opacity 0.3s;
        }

        .sidebar.collapsed .menu-item-label { opacity: 0; width: 0; }
        .sidebar.collapsed .menu-item { justify-content: center; padding: 12px; }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border);
          background: var(--surface-2);
        }

        .sidebar-footer-content {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
        }

        .sidebar-footer-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--success) 0%, #22C55E 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .sidebar-footer-text { flex: 1; overflow: hidden; transition: opacity 0.3s; }
        .sidebar.collapsed .sidebar-footer-text { opacity: 0; width: 0; }

        .sidebar-footer-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: var(--font-mono);
        }

        .sidebar-footer-value {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-top: 2px;
        }

        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
            box-shadow: none;
            width: 260px;
          }
          /* On mobile the drawer is always full-width regardless of collapsed state */
          .sidebar.collapsed { width: 260px; }
          .sidebar.collapsed .sidebar-logo-text,
          .sidebar.collapsed .menu-item-label,
          .sidebar.collapsed .sidebar-footer-text { opacity: 1; width: auto; }
          .sidebar.collapsed .menu-item { justify-content: flex-start; padding: 12px 14px; }

          .sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
          }
        }

        /* Mobile Menu Button */
        .mobile-menu-button {
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
          box-shadow: 0 4px 16px rgba(55, 50, 85, 0.4);
          transition: all 0.3s;
        }

        .mobile-menu-button:hover { transform: scale(1.05); box-shadow: 0 6px 24px rgba(55, 50, 85, 0.5); }
        .mobile-menu-button:active { transform: scale(0.95); }

        @media (max-width: 1024px) {
          .mobile-menu-button { display: flex; align-items: center; justify-content: center; }
        }

        /* Mobile Overlay — only present in the DOM when the drawer is open */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 199;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Mobile Overlay (rendered only when open, so it never blocks taps otherwise) */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {mobileOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </>
          )}
        </svg>
      </button>

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/mass_gym_logo.png" alt="Mass Gym" />
            <div className="sidebar-logo-text">Mass Gym</div>
          </div>
          <button className="sidebar-toggle" onClick={onToggle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed ? (
                <path d="M9 18l6-6-6-6"/>
              ) : (
                <path d="M15 18l-6-6 6-6"/>
              )}
            </svg>
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
              end={item.path === '/admin'}
              onClick={() => setMobileOpen(false)}
            >
              <div className="menu-item-icon">{item.icon}</div>
              <span className="menu-item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-content">
            <div className="sidebar-footer-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="sidebar-footer-text">
              <div className="sidebar-footer-label">System Status</div>
              <div className="sidebar-footer-value">All Good</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}