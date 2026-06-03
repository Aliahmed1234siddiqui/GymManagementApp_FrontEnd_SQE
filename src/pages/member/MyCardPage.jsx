import { useState, useEffect, useCallback } from 'react';
import MemberLayout from '../../components/MemberLayout/MemberLayout';
import { membersAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

// ── Spinner ───────────────────────────────────────────────────────────────
function Spinner({ size = 36 }) {
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

// ── Card ──────────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 20,
      boxShadow: '0 2px 8px var(--shadow)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function MyCardPage() {
  const { user } = useAuth();
  const [card,    setCard]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  // ── Named fetch function so it can be called from multiple places ─────
  const fetchCard = useCallback(() => {
    if (!user?._id) return;
    setError(false);
    membersAPI.getCard(user._id)
      .then(({ data }) => {
        setCard(data);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [user?._id]);

  // ── Fetch on mount + re-fetch when tab regains focus ──────────────────
  useEffect(() => {
    fetchCard();                                     // run immediately on mount
    window.addEventListener('focus', fetchCard);     // re-run when tab is focused
    return () => window.removeEventListener('focus', fetchCard);
  }, [fetchCard]);

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) return (
    <MemberLayout title="My Card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Spinner size={36} />
      </div>
    </MemberLayout>
  );

  // ── Error / not found ─────────────────────────────────────────────────
  if (error || !card) return (
    <MemberLayout title="My Card">
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '40vh', gap: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 40 }}>🪪</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
          {error ? 'Could not load your card' : 'Card not found'}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-display)', maxWidth: 320 }}>
          {error
            ? 'There was a problem connecting to the server. Try refreshing.'
            : 'Contact the front desk to get your card set up.'}
        </p>
        {error && (
          <button
            onClick={fetchCard}
            style={{
              padding: '9px 20px', background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
              fontFamily: 'var(--font-display)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Try again
          </button>
        )}
      </div>
    </MemberLayout>
  );

  // ── same member resolution as original ───────────────────────────────
  const member = card.member || user;

  // ── same card details array as original ──────────────────────────────
  const details = [
    { label: 'Card Number', value: card.cardNumber,  mono: true },
    { label: 'Issued Date', value: card.issuedDate ? new Date(card.issuedDate).toLocaleDateString('en-PK') : '—' },
    { label: 'Expiry Date', value: card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-PK') : '—' },
    { label: 'Status',      value: card.isActive ? '🟢 Active' : '🔴 Inactive' },
  ];

  return (
    <MemberLayout title="My Gym Card">
      <div style={{ maxWidth: 440 }}>

        {/* ── Gym Card visual ── */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, var(--primary) 100%)',
          borderRadius: 16,
          padding: 28,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(55,50,85,0.4)',
        }}>
          {/* watermark */}
          <div style={{
            position: 'absolute', bottom: -8, right: -10,
            fontSize: 64, fontWeight: 900, letterSpacing: 2,
            color: 'rgba(255,255,255,0.05)',
            fontFamily: 'var(--font-display)',
            userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            MASS GYM
          </div>

          {/* header: logo + card number */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
              MASS<span style={{ color: '#a5b4fc' }}>GYM</span>
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
              {card.cardNumber}
            </div>
          </div>

          {/* member name */}
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)', letterSpacing: 0.5, marginBottom: 6 }}>
            {member.name}
          </div>

          {/* plan badge */}
          <div style={{
            display: 'inline-block', padding: '3px 12px', borderRadius: 20,
            background: 'rgba(165,180,252,0.2)', border: '1px solid rgba(165,180,252,0.3)',
            fontSize: 11, fontWeight: 600, color: '#c7d2fe',
            fontFamily: 'var(--font-display)', letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            {member.plan?.name || user?.plan?.name || 'Member'}
          </div>

          {/* QR code */}
          {card.qrCode && (
            <img
              src={card.qrCode.startsWith('data:') ? card.qrCode : `data:image/png;base64,${card.qrCode}`}
              alt="QR Code"
              style={{ width: 80, height: 80, borderRadius: 8, background: '#fff', padding: 4, display: 'block', marginBottom: 14 }}
            />
          )}

          {/* expiry */}
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>
            Valid until:{' '}
            {card.expiryDate
              ? new Date(card.expiryDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })
              : '—'}
          </div>
        </div>

        {/* ── Card Details ── */}
        <Card style={{ marginTop: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 14,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
            }}>
              Card Details
            </div>

            {/* Manual refresh button */}
            <button
              onClick={fetchCard}
              title="Refresh card data"
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 6, padding: '4px 8px',
                cursor: 'pointer', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontFamily: 'var(--font-display)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refresh
            </button>
          </div>

          {/* same .map() as original */}
          {details.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: i < details.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 13,
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: item.mono ? 'var(--font-mono)' : 'var(--font-display)',
                fontWeight: 500,
                color: 'var(--text)',
              }}>
                {item.value}
              </span>
            </div>
          ))}
        </Card>

        {/* same footer note as original */}
        <p style={{
          marginTop: 16, fontSize: 12, color: 'var(--text-muted)',
          textAlign: 'center', lineHeight: 1.6,
          fontFamily: 'var(--font-display)',
        }}>
          Present this card at the front desk or scan the QR code for check-in.
        </p>

      </div>
    </MemberLayout>
  );
}