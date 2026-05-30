import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title, actions }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .header {
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

        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
        }

        .header-logo {
          display: none;
        }

        .header-logo img {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        @media (max-width: 1024px) {
          .header-logo {
            display: block;
          }
        }

        .header-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          font-family: var(--font-display);
        }

        @media (max-width: 640px) {
          .header-title {
            font-size: 20px;
          }
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .header-actions > *:not(.user-menu-wrapper) {
            display: none;
          }
        }

        .user-menu-wrapper {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-button:hover {
          background: var(--surface-2);
          border-color: var(--primary);
        }

        .user-avatar {
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
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          font-family: var(--font-display);
        }

        .user-role {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        .user-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          min-width: 200px;
          overflow: hidden;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-menu-header {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }

        .user-menu-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 2px;
        }

        .user-menu-email {
          font-size: 12px;
          color: var(--text-muted);
        }

        .user-menu-item {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          color: var(--text);
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .user-menu-item:hover {
          background: var(--surface-2);
        }

        .user-menu-item.danger {
          color: var(--error);
        }

        .user-menu-item.danger:hover {
          background: #FFF5F5;
        }

        @media (max-width: 768px) {
          .header {
            padding: 12px 20px;
          }

          .header-title {
            font-size: 20px;
          }

          .user-info {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .header {
            padding: 12px 16px;
          }
        }
      `}</style>

      <header className="header">
        <div className="header-left">
          <div className="header-logo">
            <img src="/mass_gym_logo.png" alt="Mass Gym" />
          </div>
          <h1 className="header-title">{title}</h1>
        </div>

        <div className="header-actions">
          {actions}
          
          <div className="user-menu-wrapper">
            <button 
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="user-info">
                <div className="user-name">{user?.name || 'Admin'}</div>
                <div className="user-role">{user?.role || 'admin'}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99
                  }}
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="user-menu" style={{ zIndex: 100 }}>
                  <div className="user-menu-header">
                    <div className="user-menu-name">{user?.name || 'Admin'}</div>
                    <div className="user-menu-email">{user?.email || 'admin@massgym.com'}</div>
                  </div>
                  
                  <button className="user-menu-item" onClick={() => navigate('/admin/profile')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </button>

                  

                  <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />

                  <button className="user-menu-item danger" onClick={handleLogout}>
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