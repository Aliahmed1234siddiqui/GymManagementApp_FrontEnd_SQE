import { useState, useEffect } from 'react';
import MemberLayout from '../../components/MemberLayout/MemberLayout';
import { paymentsAPI, membersAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

// ── Spinner ───────────────────────────────────────────────────────────────
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

// ── Button (admin theme) ──────────────────────────────────────────────────
function Button({ children, variant = 'primary', size = 'md', loading, onClick }) {
  const variants = {
    primary: { background: 'var(--primary)', color: '#fff',        border: 'none' },
    ghost:   { background: 'transparent',   color: 'var(--text)', border: '1px solid var(--border)' },
  };
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 13 },
    md: { padding: '10px 20px', fontSize: 14 },
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        ...variants[variant], ...sizes[size],
        borderRadius: 8, fontWeight: 600,
        fontFamily: 'var(--font-display)',
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 7,
        opacity: loading ? 0.6 : 1,
        transition: 'background 0.2s',
      }}
    >
      {loading && (
        <div style={{
          width: 13, height: 13,
          border: '2px solid rgba(255,255,255,0.35)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
}

// ── StatusBadge (admin theme) ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:    { bg: '#F0FDF4', color: '#15803D', label: 'Active'    },
    inactive:  { bg: '#F1F5F9', color: '#475569', label: 'Inactive'  },
    suspended: { bg: '#FFF7ED', color: '#C2410C', label: 'Suspended' },
    paid:      { bg: '#F0FDF4', color: '#15803D', label: 'Paid'      },
    pending:   { bg: '#FFF7ED', color: '#D97706', label: 'Pending'   },
    overdue:   { bg: '#FEF2F2', color: '#B91C1C', label: 'Overdue'   },
  };
  const v = map[status?.toLowerCase()] || {
    bg: 'var(--surface-2)', color: 'var(--text-muted)', label: status || '—',
  };
  return (
    <span style={{
      background: v.bg, color: v.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      display: 'inline-block', whiteSpace: 'nowrap',
      fontFamily: 'var(--font-display)',
    }}>
      {v.label}
    </span>
  );
}

// ── Inline toast (replaces toast() import) ────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const ToastEl = toast ? (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
      padding: '12px 20px', borderRadius: 10,
      fontSize: 13.5, fontWeight: 600, fontFamily: 'var(--font-display)',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      animation: 'toastIn 0.25s ease',
      background: toast.type === 'success' ? '#F0FDF4' : '#FEF2F2',
      border:     `1px solid ${toast.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
      color:      toast.type === 'success' ? '#15803D' : '#B91C1C',
    }}>
      <style>{`@keyframes toastIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      {toast.type === 'success'
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      }
      {toast.message}
    </div>
  ) : null;
  return { show, ToastEl };
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE 1 — Member Payments  (same logic as original, admin theme only)
// ════════════════════════════════════════════════════════════════════════════
export function MemberPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [total,    setTotal]    = useState(0);
  const { show: showToast, ToastEl } = useToast();

  // ── same useEffect as original ────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    paymentsAPI.getMemberPayments(user._id)
      .then(({ data }) => {
        setPayments(data.payments || []);
        setTotal(data.totalPaid  || 0);
      })
      .catch(() => showToast('Failed to load payments', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  // ── same cols as original, using admin theme vars ─────────────────────
  const cols = [
    {
      label: 'Invoice',
      key: 'invoiceNumber',
      render: (row) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      label: 'Plan',
      key: 'plan',
      render: (row) => row.plan?.name || '—',
    },
    {
      label: 'Amount',
      key: 'amount',
      render: (row) => (
        // was: var(--font-head), var(--red) → now: var(--font-display), var(--primary)
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>
          Rs {row.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      label: 'Method',
      key: 'method',
      render: (row) => (
        // was: var(--muted) → now: var(--text-muted)
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {row.method || '—'}
        </span>
      ),
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      label: 'Date',
      key: 'paidAt',
      render: (row) =>
        row.paidAt
          ? new Date(row.paidAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
          : '—',
    },
  ];

  return (
    <MemberLayout title="My Payments">
      {ToastEl}

      {/* Summary bar — same condition (total > 0), admin theme tokens */}
      {total > 0 && (
        <div style={{
          display: 'flex',
          gap: 24,
          marginBottom: 20,
          padding: '16px 20px',
          // was: var(--red-bg), rgba(224,32,32,.15), var(--r-md)
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--primary)',
          borderRadius: 12,
          boxShadow: '0 2px 8px var(--shadow)',
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase',
              // was: var(--muted) → now: var(--text-muted)
              color: 'var(--text-muted)',
              marginBottom: 2,
              fontFamily: 'var(--font-display)',
            }}>
              Total Paid
            </div>
            <div style={{
              // was: var(--font-head), var(--red) → now: var(--font-display), var(--primary)
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--primary)',
            }}>
              Rs {total.toLocaleString()}
            </div>
          </div>

          <div style={{ width: 1, background: 'var(--border)' }} />

          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 2,
              fontFamily: 'var(--font-display)',
            }}>
              Transactions
            </div>
            <div style={{
              // was: var(--font-head) → now: var(--font-display)
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text)',
            }}>
              {payments.length}
            </div>
          </div>
        </div>
      )}

      {/* Table wrapper — same structure as admin tables */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        boxShadow: '0 2px 8px var(--shadow)',
        overflow: 'hidden',
      }}>
        {/* Card header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            Payment History
          </div>
          {payments.length > 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
              {payments.length} record{payments.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48 }}>
            <Spinner size={40} />
          </div>
        ) : payments.length === 0 ? (
          /* Empty text — same as original emptyText prop */
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
            fontSize: 14,
            fontFamily: 'var(--font-display)',
          }}>
            No payment records found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  {cols.map(c => (
                    <th key={c.label} style={{
                      padding: '11px 16px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '.05em',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-display)',
                      whiteSpace: 'nowrap',
                    }}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((row, i) => (
                  <tr
                    key={row._id}
                    style={{ borderBottom: i < payments.length - 1 ? '1px solid var(--border)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {cols.map(c => (
                      <td key={c.label} style={{
                        padding: '13px 16px',
                        fontSize: 14,
                        color: 'var(--text)',
                        fontFamily: 'var(--font-display)',
                        verticalAlign: 'middle',
                      }}>
                        {c.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MemberLayout>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAGE 2 — Notifications  (same logic as original, admin theme only)
// ════════════════════════════════════════════════════════════════════════════
export function NotificationsPage() {
  const { user } = useAuth();
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const { show: showToast, ToastEl } = useToast();

  // ── same load function as original ────────────────────────────────────
  const load = () => {
    if (!user?._id) return;
    membersAPI.getNotifications(user._id)
      .then(({ data }) => setNotifs(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  // ── same markRead as original ─────────────────────────────────────────
  const markRead = async () => {
    setMarking(true);
    try {
      await membersAPI.markNotificationsRead(user._id);
      showToast('All notifications marked as read', 'success');
      load();
    } catch {
      showToast('Failed', 'error');
    } finally {
      setMarking(false);
    }
  };

  // ── same typeIcon map as original ─────────────────────────────────────
  const typeIcon = { welcome: '🎉', payment: '💵', renewal: '🔔', general: 'ℹ️' };

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <MemberLayout
      title="Notifications"
      // same condition as original: unread > 0 && <Btn ...>
      actions={
        unread > 0 && (
          <Button variant="ghost" size="sm" loading={marking} onClick={markRead}>
            Mark All Read
          </Button>
        )
      }
    >
      {ToastEl}

      {/* ── Loading ── same as original page-loader */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <Spinner size={40} />
        </div>

      ) : notifs.length === 0 ? (
        /* ── Empty ── same text as original */
        <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: 'var(--font-display)' }}>
          No notifications yet.
        </p>

      ) : (
        <div style={{ maxWidth: 680 }}>

          {/* Unread count — same condition (unread > 0), admin theme tokens */}
          {unread > 0 && (
            <div style={{
              marginBottom: 12,
              padding: '10px 16px',
              // was: var(--red-bg), rgba(224,32,32,.15), var(--r-sm), var(--red)
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: '3px solid var(--primary)',
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              color: 'var(--primary)',
              fontFamily: 'var(--font-display)',
              boxShadow: '0 2px 6px var(--shadow)',
            }}>
              {unread} unread notification{unread !== 1 ? 's' : ''}
            </div>
          )}

          {/* Notification list — same .map(n => ...) as original */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            boxShadow: '0 2px 8px var(--shadow)',
            overflow: 'hidden',
          }}>
            {notifs.map((n, i) => (
              <div
                key={n._id}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '16px 20px',
                  borderBottom: i < notifs.length - 1 ? '1px solid var(--border)' : 'none',
                  // unread rows get a faint primary tint (was: nothing in original)
                  background: !n.isRead ? 'rgba(55,50,85,0.03)' : 'transparent',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = !n.isRead ? 'rgba(55,50,85,0.03)' : 'transparent'}
              >
                {/* notif-dot — was CSS class, now inline admin tokens */}
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  flexShrink: 0,
                  marginTop: 6,
                  // was: var(--red) unread / var(--surface3) read
                  background: n.isRead ? 'var(--border)' : 'var(--primary)',
                  transition: 'background 0.2s',
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* same icon + title row as original */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>
                      {typeIcon[n.type] || 'ℹ️'}
                    </span>
                    {/* notif-title — was CSS class */}
                    <div style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--text)',
                      fontFamily: 'var(--font-display)',
                    }}>
                      {n.title}
                    </div>
                  </div>

                  {/* notif-msg — was CSS class */}
                  <div style={{
                    fontSize: 13,
                    // was: var(--muted) → now: var(--text-muted)
                    color: 'var(--text-muted)',
                    lineHeight: 1.55,
                    marginBottom: 5,
                    fontFamily: 'var(--font-display)',
                  }}>
                    {n.message}
                  </div>

                  {/* notif-time — was CSS class */}
                  <div style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    // was: var(--muted2) → now: var(--font-mono) for timestamp
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {new Date(n.createdAt).toLocaleString('en-PK')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MemberLayout>
  );
}