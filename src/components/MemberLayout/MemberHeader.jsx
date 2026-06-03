import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MemberHeader({ title, actions }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'M';

  return (
    <>
      <style>{`
        .member-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 14px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .mh-left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
        }

        /* logo only visible when sidebar is hidden on mobile */
        .mh-logo { display: none; }
        .mh-logo img { height: 40px; width: auto; object-fit: contain; }

        @media (max-width: 1024px) {
          .mh-logo { display: block; }
        }

        .mh-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          font-family: var(--font-display);
        }

        .mh-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* hide extra actions on very small screens */
        @media (max-width: 640px) {
          .mh-right > *:not(.mh-menu-wrap) { display: none; }
          .mh-title { font-size: 20px; }
          .member-header { padding: 12px 16px; }
        }

        @media (max-width: 768px) {
          .member-header { padding: 12px 20px; }
          .mh-title { font-size: 20px; }
        }

        /* ── User button ── */
        .mh-menu-wrap { position: relative; }

        .mh-user-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-display);
        }

        .mh-user-btn:hover {
          background: var(--surface-2);
          border-color: var(--primary);
        }

        .mh-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          font-family: var(--font-display);
          flex-shrink: 0;
        }

        .mh-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .mh-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .mh-role {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .mh-user-info { display: none; }
        }

        /* ── Dropdown ── */
        .mh-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          min-width: 220px;
          overflow: hidden;
          z-index: 100;
          animation: mhSlideDown 0.2s ease-out;
        }

        @keyframes mhSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mh-dropdown-head {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }

        .mh-dropdown-name  { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
        .mh-dropdown-email { font-size: 12px; color: var(--text-muted); }
        .mh-dropdown-badge {
          display: inline-block;
          margin-top: 6px;
          padding: 2px 10px;
          background: linear-gradient(135deg, rgba(55,50,85,0.1) 0%, rgba(55,50,85,0.06) 100%);
          border: 1px solid rgba(55,50,85,0.15);
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: var(--primary);
          font-family: var(--font-display);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .mh-menu-item {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          font-weight: 500;
          color: var(--text);
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-family: var(--font-display);
        }

        .mh-menu-item:hover { background: var(--surface-2); }

        .mh-menu-item.danger { color: var(--error); }
        .mh-menu-item.danger:hover { background: #FFF5F5; }

        .mh-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 4px 0;
        }
      `}</style>

      <header className="member-header">
        <div className="mh-left">
          <div className="mh-logo">
            <img src="/mass_gym_logo.png" alt="Mass Gym" />
          </div>
          <h1 className="mh-title">{title}</h1>
        </div>

        <div className="mh-right">
          {/* slot for page-level actions passed from outside */}
          {actions}

          <div className="mh-menu-wrap">
            <button className="mh-user-btn" onClick={() => setShowMenu(v => !v)}>
              <div className="mh-avatar">{initials}</div>
              <div className="mh-user-info">
                <div className="mh-name">{user?.name || 'Member'}</div>
                <div className="mh-role">{user?.role || 'member'}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showMenu && (
              <>
                {/* click-outside backdrop */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                  onClick={() => setShowMenu(false)}
                />
                <div className="mh-dropdown">
                  {/* User info */}
                  <div className="mh-dropdown-head">
                    <div className="mh-dropdown-name">{user?.name || 'Member'}</div>
                    <div className="mh-dropdown-email">{user?.email}</div>
                    <div className="mh-dropdown-badge">Member</div>
                  </div>

                  {/* My Dashboard */}
                  <button className="mh-menu-item" onClick={() => { navigate('/member'); setShowMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    My Dashboard
                  </button>

                  {/* My Gym Card */}
                  <button className="mh-menu-item" onClick={() => { navigate('/member/card'); setShowMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    My Gym Card
                  </button>

                  {/* Settings */}
                  <button className="mh-menu-item" onClick={() => { navigate('/member/settings'); setShowMenu(false); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Settings
                  </button>

                  <hr className="mh-divider" />

                  {/* Logout */}
                  <button className="mh-menu-item danger" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}