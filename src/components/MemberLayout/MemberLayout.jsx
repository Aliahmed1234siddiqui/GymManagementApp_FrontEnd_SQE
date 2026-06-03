import { useState } from 'react';
import MemberHeader from './MemberHeader';
import MemberSidebar from './MemberSidebar';

export default function MemberLayout({ title, actions, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --primary:      #373255;
          --primary-dark: #373255;
          --accent:       #0099FF;
          --bg:           #F8F9FA;
          --surface:      #FFFFFF;
          --surface-2:    #F1F3F5;
          --text:         #1A1D29;
          --text-muted:   #6C757D;
          --border:       #E0E4E8;
          --error:        #DC3545;
          --success:      #28A745;
          --warning:      #F59E0B;
          --blue:         #3B82F6;
          --shadow:       rgba(0, 0, 0, 0.08);
          --font-display: 'Rajdhani', sans-serif;
          --font-mono:    'Space Mono', monospace;
          --r-sm: 6px;
          --r-md: 10px;
          --r-lg: 14px;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: var(--font-display);
          background: var(--bg);
          color: var(--text);
          -webkit-font-smoothing: antialiased;
        }

        .member-layout-wrapper {
          display: flex;
          min-height: 100vh;
        }

        .member-layout-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 0;
        }

        .member-layout-main.sidebar-expanded  { margin-left: 260px; }
        .member-layout-main.sidebar-collapsed { margin-left: 80px; }

        .member-layout-content {
          flex: 1;
          padding: 24px 32px;
          max-width: 1600px;
          width: 100%;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .member-layout-main.sidebar-expanded,
          .member-layout-main.sidebar-collapsed {
            margin-left: 0;
          }

          .member-layout-content {
            padding: 16px;
          }
        }

        @media (max-width: 640px) {
          .member-layout-content {
            padding: 12px;
          }
        }
      `}</style>

      <div className="member-layout-wrapper">
        <MemberSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(v => !v)}
        />

        <main className={`member-layout-main ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          <MemberHeader title={title} actions={actions} />

          <div className="member-layout-content">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}