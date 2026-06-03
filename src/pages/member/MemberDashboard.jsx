import { useState, useEffect, useCallback } from 'react';
import MemberLayout from '../../components/MemberLayout/MemberLayout';
import { dashboardAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size, height: size,
      border: '3px solid var(--border)',
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      boxShadow: '0 2px 8px var(--shadow)',
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

function Button({ children, variant = 'primary', size = 'md', onClick, style = {} }) {
  const v = {
    primary: { background: 'var(--primary)', color: '#fff', border: 'none' },
    ghost:   { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' },
  };
  const s = {
    sm: { padding: '6px 13px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
  };
  return (
    <button onClick={onClick} style={{ ...v[variant], ...s[size], borderRadius: 8, fontWeight: 600, fontFamily: 'var(--font-display)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s', ...style }}>
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    active:    { bg: '#F0FDF4', color: '#15803D', label: 'Active' },
    inactive:  { bg: '#F1F5F9', color: '#475569', label: 'Inactive' },
    suspended: { bg: '#FFF7ED', color: '#C2410C', label: 'Suspended' },
    paid:      { bg: '#F0FDF4', color: '#15803D', label: 'Paid' },
    pending:   { bg: '#FFF7ED', color: '#D97706', label: 'Pending' },
    overdue:   { bg: '#FEF2F2', color: '#B91C1C', label: 'Overdue' },
  };
  const v = map[status?.toLowerCase()] || { bg: 'var(--surface-2)', color: 'var(--text-muted)', label: status || '—' };
  return (
    <span style={{ background: v.bg, color: v.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, display: 'inline-block', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
      {v.label}
    </span>
  );
}

function HeroStat({ label, value, icon, accent, iconBg, iconColor, delta, deltaUp }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '15px 16px', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px var(--shadow)' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 3, height: '100%', background: accent, borderRadius: 0 }} />
      <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10, color: iconColor }}>
        {icon}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
      {delta && (
        <div style={{ fontSize: 11, marginTop: 5, color: deltaUp ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
          {deltaUp ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  );
}

function DaysRing({ days }) {
  const max = 30;
  const pct = Math.min((days ?? 0) / max, 1);
  const r = 38, cx = 48, cy = 48;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const stroke = days <= 3 ? 'var(--error)' : days <= 7 ? 'var(--warning)' : 'var(--success)';
  return (
    <svg width={90} height={90} viewBox="0 0 96 96" style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={8} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth={8}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy + 2} textAnchor="middle" dominantBaseline="middle"
        style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, fill: 'var(--text)' }}>
        {days ?? 0}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle"
        style={{ fontFamily: 'var(--font-display)', fontSize: 9, fill: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
        days left
      </text>
    </svg>
  );
}

function InfoCell({ label, value, mono }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)' }}>{value || '—'}</div>
    </div>
  );
}

function SectionHead({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Main Dashboard
// ════════════════════════════════════════════════════════════════════════════
export default function MemberDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ── Stable fetch ──────────────────────────────────────────────────────
  const fetchDashboard = useCallback(() => {
    setLoading(true);
    dashboardAPI.getMemberDashboard()
      .then(({ data: d }) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Wait for AuthContext before fetching ──────────────────────────────
  useEffect(() => {
    if (authLoading) return;   // context not ready
    if (!user?._id) return;    // no user
    fetchDashboard();
    window.addEventListener('focus', fetchDashboard);
    return () => window.removeEventListener('focus', fetchDashboard);
  }, [authLoading, user?._id, fetchDashboard]);

  // ── Auth loading ──────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <MemberLayout title="My Dashboard">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Spinner size={48} />
        </div>
      </MemberLayout>
    );
  }

  // ── API response shape:
  // {
  //   profile: { name, email, phone, gymCardNumber, status, memberSince },
  //   renewal: { date, daysLeft, isExpiringSoon },
  //   recentPayments: [{ _id, invoiceNumber, plan: { name }, amount, method, status, paidAt }],
  //   unreadNotifications: 0
  //   plan is NOT a top-level key — derive it from recentPayments[0].plan
  // }

  const d       = data        || {};
  const profile = d.profile   || {};
  const renewal = d.renewal   || {};
  const payments = d.recentPayments || [];

  // ── FIX: plan comes from the most recent payment, NOT d.plan ─────────
  // The API does not return a top-level "plan" object.
  // The current plan name is in the latest payment's plan field,
  // or falls back to the user's plan from AuthContext.
  const latestPlan = payments[0]?.plan || {};
  const planName   = latestPlan.name || user?.plan?.name || '—';

  const daysLeft = renewal.daysLeft ?? 0;

  // Total paid across recent payments
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <MemberLayout title="My Dashboard">
      <style>{`
        .mdb-hero { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px; margin-bottom:18px; }
        .mdb-main { display:grid; grid-template-columns:1.1fr 0.9fr; gap:16px; margin-bottom:16px; }
        .mdb-info { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:14px; }
        .mdb-qk   { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:0; }
        @media(max-width:860px){ .mdb-main{grid-template-columns:1fr;} }
        @media(max-width:540px){ .mdb-info{grid-template-columns:1fr;} }
        .pay-row{ display:flex; justify-content:space-between; align-items:center; padding:11px 0; border-bottom:1px solid var(--border); }
        .pay-row:last-child{ border-bottom:none; padding-bottom:0; }
        .qk-btn{ background:none; border:none; border-right:1px solid var(--border); padding:18px 12px; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:6px; transition:background .15s; width:100%; }
        .qk-btn:last-child{ border-right:none; }
        .qk-btn:hover{ background:var(--surface-2); }
      `}</style>

      {/* ── Hero stats ── */}
      <div className="mdb-hero">
        <HeroStat
          label="Current plan"
          value={planName}
          icon="🏋️"
          accent="var(--primary)"
          iconBg="#EEEDFE"
          iconColor="#534AB7"
          delta="30 days duration"
          deltaUp
        />
        <HeroStat
          label="Account status"
          value={profile.status || '—'}
          icon="✅"
          accent="var(--success)"
          iconBg="#F0FDF4"
          iconColor="#15803D"
          delta={profile.status === 'Active' ? 'All access enabled' : 'Contact front desk'}
          deltaUp={profile.status === 'Active'}
        />
        <HeroStat
          label="Until renewal"
          value={`${daysLeft} days`}
          icon="🗓️"
          accent={daysLeft <= 7 ? 'var(--warning)' : 'var(--primary)'}
          iconBg="#FFFBEB"
          iconColor="#D97706"
          delta={renewal.isExpiringSoon ? 'Expiring soon!' : 'Membership active'}
          deltaUp={!renewal.isExpiringSoon}
        />
        <HeroStat
          label="Unread alerts"
          value={d.unreadNotifications ?? 0}
          icon="🔔"
          accent="#7C3AED"
          iconBg="#F5F3FF"
          iconColor="#6D28D9"
          delta={d.unreadNotifications > 0 ? 'Tap to read' : 'All caught up'}
          deltaUp={d.unreadNotifications === 0}
        />
      </div>

      {/* ── Main two-column ── */}
      <div className="mdb-main">

        {/* Profile card */}
        <Card>
          <SectionHead
            title="My Profile"
            subtitle="Personal details and membership info"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/member/card')}>
                View gym card →
              </Button>
            }
          />
          <div style={{ padding: '16px 18px' }}>
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{profile.name || '—'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{profile.email}</div>
                {profile.phone && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{profile.phone}</div>}
              </div>
              <StatusBadge status={profile.status} />
            </div>

            {/* Info cells */}
            <div className="mdb-info">
              <InfoCell label="Card Number" value={profile.gymCardNumber} mono />
              <InfoCell label="Plan" value={planName} />
              <InfoCell label="Member Since" value={profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'} />
              <InfoCell label="Total Paid" value={totalPaid > 0 ? `Rs ${totalPaid.toLocaleString()}` : '—'} />
            </div>

            {/* Unread notifications CTA */}
            {(d.unreadNotifications ?? 0) > 0 && (
              <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  🔔 You have <strong>{d.unreadNotifications}</strong> unread notification{d.unreadNotifications !== 1 ? 's' : ''}
                </span>
                <Button variant="ghost" size="sm" onClick={() => navigate('/member/notifications')}>View</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Renewal + Payments card */}
        <Card>
          <SectionHead title="Membership renewal" subtitle={renewal.date ? new Date(renewal.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
          <div style={{ padding: '16px 18px' }}>

            {/* Ring + date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
              <DaysRing days={daysLeft} />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Renewal date</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                  {renewal.date ? new Date(renewal.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </div>
                {renewal.isExpiringSoon ? (
                  <div style={{ marginTop: 8, padding: '7px 11px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, fontSize: 12, color: '#C2410C', fontWeight: 600 }}>
                    ⚠ Expiring soon
                  </div>
                ) : (
                  <div style={{ marginTop: 8, fontSize: 13, color: 'var(--success)', fontWeight: 600 }}>
                    ✓ Membership is active
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 5, borderRadius: 3, background: 'var(--border)', overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ height: '100%', width: `${Math.round(Math.min((daysLeft / 30) * 100, 100))}%`, background: daysLeft <= 3 ? 'var(--error)' : daysLeft <= 7 ? 'var(--warning)' : 'var(--success)', borderRadius: 3, transition: 'width 0.4s ease' }} />
            </div>

            {/* Recent payments */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'var(--font-display)' }}>
                  Recent payments
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/member/payments')}>All →</Button>
              </div>

              {payments.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0', fontFamily: 'var(--font-display)' }}>
                  No payments on record.
                </p>
              ) : (
                payments.map((pay) => (
                  <div key={pay._id} className="pay-row">
                    <div>
                      <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600 }}>
                        {pay.invoiceNumber}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--font-display)' }}>
                        {pay.paidAt ? new Date(pay.paidAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        {pay.plan?.name ? ` · ${pay.plan.name}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                        Rs {pay.amount?.toLocaleString()}
                      </span>
                      <StatusBadge status={pay.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Quick access ── */}
      <Card>
        <SectionHead title="Quick access" subtitle="Jump to any section" />
        <div className="mdb-qk">
          {[
            { icon: '🪪', label: 'My gym card',   sub: 'View QR code',           path: '/member/card' },
            { icon: '💳', label: 'Payments',       sub: 'Full history',           path: '/member/payments' },
            { icon: '🔔', label: 'Notifications',  sub: `${d.unreadNotifications ?? 0} unread`, path: '/member/notifications' },
            { icon: '⚙️', label: 'Settings',        sub: 'Change password',        path: '/member/settings' },
          ].map((tile, i, arr) => (
            <button
              key={tile.path}
              className="qk-btn"
              onClick={() => navigate(tile.path)}
              style={{ borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <span style={{ fontSize: 26 }}>{tile.icon}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{tile.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>{tile.sub}</div>
            </button>
          ))}
        </div>
      </Card>
    </MemberLayout>
  );
}