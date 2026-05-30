import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { dashboardAPI, paymentsAPI } from '../../../api/services';
import { useNavigate } from 'react-router-dom';

// ── Utility Components ────────────────────────────────────────────────────

function Spinner({ size = 24 }) {
  return (
    <div style={{
      width: size,
      height: size,
      border: `3px solid var(--border)`,
      borderTopColor: 'var(--primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function Button({ children, variant = 'primary', size = 'md', loading, onClick, ...props }) {
  const variants = {
    primary: 'background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white; border: none;',
    ghost: 'background: transparent; color: var(--text); border: 1px solid var(--border);',
    success: 'background: var(--success); color: white; border: none;'
  };

  const sizes = {
    sm: 'padding: 8px 16px; font-size: 13px;',
    md: 'padding: 10px 20px; font-size: 14px;'
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        ...parseStyles(variants[variant]),
        ...parseStyles(sizes[size]),
        borderRadius: '8px',
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        opacity: loading ? 0.6 : 1
      }}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}

function parseStyles(str) {
  return str.split(';').reduce((acc, style) => {
    const [key, value] = style.split(':').map(s => s.trim());
    if (key && value) {
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = value;
    }
    return acc;
  }, {});
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 2px 8px var(--shadow)',
      ...style
    }}>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const variants = {
    active: { bg: '#F0FDF4', color: '#15803D', label: 'Active' },
    suspended: { bg: '#FFF7ED', color: '#C2410C', label: 'Suspended' },
    pending: { bg: '#FFF7ED', color: '#D97706', label: 'Pending' }
  };

  // Normalize so "Active" / "active" / "ACTIVE" all match
  const variant = variants[status?.toLowerCase()] || variants.active;

  return (
    <span style={{
      background: variant.bg,
      color: variant.color,
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      display: 'inline-block'
    }}>
      {variant.label}
    </span>
  );
}

// ── Dashboard Components ──────────────────────────────────────────────────

function HeroStatCard({ label, value, icon, accentColor, iconBg, iconColor, delta, deltaUp }) {
  return (
    <Card style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '3px',
        height: '100%',
        background: accentColor
      }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0,
          color: iconColor
        }}>
          {icon}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1,
            marginBottom: '4px'
          }}>
            {value}
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            marginBottom: delta ? '6px' : 0
          }}>
            {label}
          </div>
          {delta && (
            <div style={{
              fontSize: '12px',
              color: deltaUp ? 'var(--success)' : 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}>
              {deltaUp ? '↑' : '↓'} {delta}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function MiniStat({ label, value, variant = 'default' }) {
  const colors = {
    default: 'var(--text)',
    danger: 'var(--error)',
    warning: 'var(--warning)',
    success: 'var(--success)'
  };

  return (
    <Card style={{ padding: '16px', background: 'var(--surface-2)' }}>
      <div style={{
        fontSize: '12px',
        color: 'var(--text-muted)',
        marginBottom: '6px',
        fontFamily: 'var(--font-mono)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '22px',
        fontWeight: 700,
        color: colors[variant]
      }}>
        {value}
      </div>
    </Card>
  );
}

function PlanBreakdown({ data }) {
  if (!data?.length) {
    return (
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
        No plan data
      </p>
    );
  }

  const planColors = {
    Silver: '#888780',
    Gold: '#BA7517',
    Platinum: '#534AB7'
  };

  const max = Math.max(...data.map((p) => p.count), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {data.map((p, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 0',
          borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            flex: 1,
            color: 'var(--text)'
          }}>
            {p.name}
          </span>
          
          <div style={{
            flex: 2,
            height: '8px',
            background: 'var(--surface-2)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.round((p.count / max) * 100)}%`,
              height: '100%',
              background: planColors[p.name] || 'var(--primary)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--text)',
            minWidth: '32px',
            textAlign: 'right'
          }}>
            {p.count}
          </span>
        </div>
      ))}
    </div>
  );
}


// Fixed month axis so the chart always shows the whole year
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Compact money formatting: 38000 -> "38K", 1200000 -> "1.2M"
function formatCompact(n) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
}

function BarChart({ data }) {
  const [hovered, setHovered] = useState(null);
  const currentMonth = new Date().getMonth(); // 0 = Jan ... 11 = Dec

  // Fill in all 12 months, defaulting any month the API didn't return to 0
  const byMonth = Object.fromEntries((data || []).map((d) => [d.month, d.value]));
  const series = MONTH_LABELS.map((month) => ({ month, value: byMonth[month] || 0 }));
  const max = Math.max(...series.map((d) => d.value), 1);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: '6px',
      height: '260px',
      padding: '32px 0 0',
      borderBottom: '1px solid var(--border)'
    }}>
      {series.map((item, i) => {
        const pct = (item.value / max) * 100;
        const isCurrent = i === currentMonth;
        const isHovered = hovered === i;
        const hasValue = item.value > 0;

        return (
          <div
            key={item.month}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
              cursor: hasValue ? 'pointer' : 'default'
            }}
          >
            {/* Bar area */}
            <div style={{
              position: 'relative',
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}>
              {/* Faint track so empty months still read as a slot */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--surface-2)',
                borderRadius: '6px',
                opacity: 0.4
              }} />

              {/* Hover tooltip with the exact figure */}
              {isHovered && hasValue && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -100%)',
                  background: 'var(--text)',
                  color: 'var(--surface)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  zIndex: 2,
                  pointerEvents: 'none'
                }}>
                  Rs {item.value.toLocaleString()}
                </div>
              )}

              {/* Always-on compact value label above the bar */}
              {hasValue && (
                <div style={{
                  position: 'absolute',
                  bottom: `calc(${pct}% + 4px)`,
                  fontSize: '10px',
                  fontWeight: 700,
                  color: isCurrent ? 'var(--primary)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}>
                  {formatCompact(item.value)}
                </div>
              )}

              {/* Bar */}
              <div style={{
                position: 'relative',
                width: '68%',
                height: `${pct}%`,
                minHeight: hasValue ? '4px' : 0,
                background: hasValue
                  ? 'linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)'
                  : 'transparent',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.3s ease, filter 0.2s ease',
                filter: isHovered ? 'brightness(1.12)' : 'none'
              }} />
            </div>

            {/* Month label — current month highlighted */}
            <div style={{
              fontSize: '10px',
              fontWeight: isCurrent ? 700 : 600,
              color: isCurrent ? 'var(--text)' : 'var(--text-muted)'
            }}>
              {item.month}
            </div>
          </div>
        );
      })}
    </div>
  );
}


function Avatar({ name, index }) {
  const palettes = [
    ['#EFF6FF', '#1D4ED8'],
    ['#F0FDF4', '#15803D'],
    ['#FFF7ED', '#C2410C'],
    ['#F5F3FF', '#6D28D9'],
    ['#FFF1F2', '#BE123C']
  ];

  const [bg, fg] = palettes[index % palettes.length];
  const initials = name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: bg,
      color: fg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: 700,
      flexShrink: 0
    }}>
      {initials}
    </div>
  );
}

// Convert API monthlyRevenue ({ _id: { year, month }, total }) into chart shape
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function mapMonthlyRevenue(raw) {
  return (raw || []).map((d) => ({
    month: MONTH_NAMES[(d?._id?.month || 1) - 1],
    value: d?.total || 0
  }));
}

// ── Main Dashboard Component ──────────────────────────────────────────────

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderDone, setReminderDone] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    dashboardAPI.getStats()
      .then(({ data }) => setStats(data))
      .catch(() => alert('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const sendReminders = async () => {
    setReminderLoading(true);
    try {
      const { data } = await paymentsAPI.sendReminders();
      alert(data.message || 'Reminders sent successfully!');
      setReminderDone(true);
      setTimeout(() => setReminderDone(false), 4000);
    } catch {
      alert('Failed to send reminders');
    } finally {
      setReminderLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh'
        }}>
          <Spinner size={48} />
        </div>
      </Layout>
    );
  }

  const s = stats || {};
  const m = s.members || {};
  const r = s.revenue || {};
  const p = s.payments || {};
  const monthlyRevenueData = mapMonthlyRevenue(s.monthlyRevenue);

  return (
    <Layout
      title="Dashboard"
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            ↺ Refresh
          </Button>
          <Button variant="primary" size="sm" loading={reminderLoading} onClick={sendReminders}>
            {reminderDone ? '✓ Sent!' : '🔔 Send Reminders'}
          </Button>
        </>
      }
    >
      <style>{`
        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }

        .table td {
          padding: 14px 16px;
          font-size: 14px;
          color: var(--text);
          border-bottom: 1px solid var(--border);
        }

        .table tbody tr:hover {
          background: var(--surface-2);
        }

        .table tbody tr:last-child td {
          border-bottom: none;
        }
      `}</style>

      {/* Hero Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <HeroStatCard
          label="Total Members"
          value={m.total?.toLocaleString() || 0}
          icon="👥"
          accentColor="#3B82F6"
          iconBg="#EFF6FF"
          iconColor="#1D4ED8"
        />
        <HeroStatCard
          label="Active Members"
          value={m.active?.toLocaleString() || 0}
          icon="✅"
          accentColor="#16A34A"
          iconBg="#F0FDF4"
          iconColor="#15803D"
          delta={`${m.total ? Math.round((m.active / m.total) * 100) : 0}% active rate`}
          deltaUp
        />
        <HeroStatCard
          label="Pending Payments"
          value={p.pending || 0}
          icon="⏳"
          accentColor="#F59E0B"
          iconBg="#FFFBEB"
          iconColor="#D97706"
          delta={`${p.overdue || 0} overdue`}
        />
        <HeroStatCard
          label="Total Revenue"
          value={`Rs ${((r.thisMonth || 0) / 1000).toFixed(0)}K`}
          icon="💵"
          accentColor="#7C3AED"
          iconBg="#F5F3FF"
          iconColor="#6D28D9"
          delta={`Rs ${((r.thisMonth || 0) / 1000).toFixed(0)}K this month`}
          deltaUp
        />
      </div>

      {/* Secondary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <MiniStat label="Suspended" value={m.suspended || 0} variant="danger" />
        <MiniStat label="Renewals Due (7d)" value={s.renewalsDue || 0} variant="warning" />
        <MiniStat label="Overdue" value={p.overdue || 0} variant="danger" />
        <MiniStat label="This Month" value={`Rs ${((r.thisMonth || 0) / 1000).toFixed(0)}K`} variant="success" />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <Card>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                Monthly Revenue
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Recent months
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '3px',
                background: 'var(--primary)'
              }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Revenue (Rs)</span>
            </div>
          </div>
          <BarChart data={monthlyRevenueData} />
        </Card>

        <Card>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              Plan Breakdown
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Active members by plan
            </div>
          </div>
          <PlanBreakdown data={s.planBreakdown} />
        </Card>
      </div>

      {/* Recent Members Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)'
        }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
              Recent Members
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Latest 5 registrations
            </div>
          </div>
          <Button variant="ghost" onClick={()=>{navigate('/admin/members')}} size="sm">View All →</Button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Plan</th>
              <th>Card No.</th>
              <th>Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(s.recentMembers || []).length === 0 ? (
              <tr>
                <td colSpan={5} style={{
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  padding: '40px'
                }}>
                  No members yet
                </td>
              </tr>
            ) : (
              (s.recentMembers || []).map((member, i) => (
                <tr key={member._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Avatar name={member.name} index={i} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{member.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '14px', fontWeight: 500 }}>
                    {member.plan?.name || '—'}
                  </td>
                  <td style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-muted)'
                  }}>
                    {member.gymCardNumber}
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : '—'}
                  </td>
                  <td>
                    <StatusBadge status={member.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </Layout>
  );
}