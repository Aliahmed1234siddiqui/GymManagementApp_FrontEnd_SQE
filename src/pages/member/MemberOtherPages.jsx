import { useState, useEffect } from 'react';
import { MemberLayout } from '../../components/common/Layout';
import { Table, StatusBadge, Spinner, toast, Btn } from '../../components/common/UI';
import { paymentsAPI, membersAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

/* ── Member Payments ──────────────────────────── */
export function MemberPaymentsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);

  useEffect(() => {
    if (!user?._id) return;
    paymentsAPI.getMemberPayments(user._id)
      .then(({ data }) => { setPayments(data.payments); setTotal(data.totalPaid || 0); })
      .catch(() => toast('Failed to load payments', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const cols = [
    { key:'invoiceNumber', label:'Invoice', render:(v) => <span style={{ fontFamily:'var(--font-mono)',fontSize:12 }}>{v}</span> },
    { key:'plan', label:'Plan', render:(v) => v?.name || '—' },
    { key:'amount', label:'Amount', render:(v) => <span style={{ fontFamily:'var(--font-head)',fontSize:20,color:'var(--red)' }}>Rs {v?.toLocaleString()}</span> },
    { key:'method', label:'Method', render:(v) => <span style={{ fontSize:12,color:'var(--muted)' }}>{v}</span> },
    { key:'status', label:'Status', render:(v) => <StatusBadge status={v} /> },
    { key:'paidAt', label:'Date', render:(v) => v ? new Date(v).toLocaleDateString('en-PK',{day:'numeric',month:'short',year:'numeric'}) : '—' },
  ];

  return (
    <MemberLayout title="My Payments">
      {total > 0 && (
        <div style={{ display:'flex', gap:24, marginBottom:20, padding:'16px 20px', background:'var(--red-bg)', border:'1px solid rgba(224,32,32,.15)', borderRadius:'var(--r-md)' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:2 }}>Total Paid</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:32, color:'var(--red)' }}>Rs {total.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:2 }}>Transactions</div>
            <div style={{ fontFamily:'var(--font-head)', fontSize:32 }}>{payments.length}</div>
          </div>
        </div>
      )}
      <Table cols={cols} rows={payments} loading={loading} emptyText="No payment records found" />
    </MemberLayout>
  );
}

/* ── Notifications ────────────────────────────── */
export function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = () => {
    if (!user?._id) return;
    membersAPI.getNotifications(user._id)
      .then(({ data }) => setNotifs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [user]);

  const markRead = async () => {
    setMarking(true);
    try {
      await membersAPI.markNotificationsRead(user._id);
      toast('All notifications marked as read', 'success');
      load();
    } catch { toast('Failed', 'error'); }
    finally { setMarking(false); }
  };

  const typeIcon = { welcome:'🎉', payment:'💵', renewal:'🔔', general:'ℹ️' };

  const unread = notifs.filter((n) => !n.isRead).length;

  return (
    <MemberLayout
      title="Notifications"
      actions={unread > 0 && <Btn variant="ghost" size="sm" loading={marking} onClick={markRead}>Mark All Read</Btn>}
    >
      {loading
        ? <div className="page-loader"><Spinner/></div>
        : notifs.length === 0
        ? <p style={{ color:'var(--muted)', fontSize:14 }}>No notifications yet.</p>
        : (
          <div style={{ maxWidth:680 }}>
            {unread > 0 && (
              <div style={{ marginBottom:12, padding:'8px 14px', background:'var(--red-bg)', border:'1px solid rgba(224,32,32,.15)', borderRadius:'var(--r-sm)', fontSize:12.5, color:'var(--red)', fontWeight:600 }}>
                {unread} unread notification{unread !== 1 ? 's' : ''}
              </div>
            )}
            {notifs.map((n) => (
              <div key={n._id} className="notif-item">
                <div className={`notif-dot ${n.isRead ? 'read' : ''}`} />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span>{typeIcon[n.type] || 'ℹ️'}</span>
                    <div className="notif-title">{n.title}</div>
                  </div>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{new Date(n.createdAt).toLocaleString('en-PK')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
    </MemberLayout>
  );
}
