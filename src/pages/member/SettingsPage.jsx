import { useState } from 'react';
import MemberLayout from '../../components/MemberLayout/MemberLayout';
import { authAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

// ── Card (admin theme) ────────────────────────────────────────────────────
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

// ── Input (admin theme) ───────────────────────────────────────────────────
function Input({ label, type = 'text', value, onChange, placeholder, error }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '.05em',
          textTransform: 'uppercase',
          // was: color from var(--muted) → var(--text-muted)
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-display)',
        }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'var(--surface)',
          // was: var(--border2) → var(--border)
          border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`,
          borderRadius: 8,
          fontSize: 14,
          color: 'var(--text)',
          fontFamily: 'var(--font-display)',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--primary)';
          e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(220,53,69,0.12)' : 'rgba(55,50,85,0.12)'}`;
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--border)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {/* was: error shown via field-error class → inline span */}
      {error && (
        <span style={{ fontSize: 12, color: 'var(--error)', fontFamily: 'var(--font-display)' }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ── Button (admin theme) ──────────────────────────────────────────────────
function Btn({ children, variant = 'primary', type = 'button', loading, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{
        // was: var(--blue) background → var(--primary)
        background: variant === 'primary' ? 'var(--primary)' : 'transparent',
        color: variant === 'primary' ? '#fff' : 'var(--text)',
        border: variant === 'primary' ? 'none' : '1px solid var(--border)',
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'background 0.2s',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {/* loading spinner — same concept as original Btn loading prop */}
      {loading && (
        <div style={{
          width: 14, height: 14,
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
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes toastIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
      {toast.type === 'success'
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      }
      {toast.message}
    </div>
  ) : null;
  return { show, ToastEl };
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuth();
  const { show: showToast, ToastEl } = useToast();

  // ── same state as original ────────────────────────────────────────────
  const [form, setForm]     = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ── same set helper as original ───────────────────────────────────────
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // ── same validate function as original ───────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.currentPassword)             e.currentPassword = 'Required';
    if (!form.newPassword)                 e.newPassword = 'Required';
    else if (form.newPassword.length < 6)  e.newPassword = 'Min 6 characters';
    if (form.newPassword !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── same handleSubmit as original ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      // was: toast('Password changed successfully', 'success') → showToast(...)
      showToast('Password changed successfully', 'success');
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      // was: toast(err..., 'error') → showToast(...)
      showToast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── same profile rows array as original ──────────────────────────────
  const profileRows = [
    { label: 'Name',        value: user?.name },
    { label: 'Email',       value: user?.email },
    { label: 'Plan',        value: user?.plan?.name },
    { label: 'Card Number', value: user?.gymCardNumber },
    { label: 'Role',        value: user?.role },
  ];

  return (
    <MemberLayout title="Settings">
      {ToastEl}

      <div style={{ maxWidth: 500 }}>

        {/* ── Profile info — same structure as original ── */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase',
            // was: color:'var(--muted)' → var(--text-muted)
            color: 'var(--text-muted)',
            marginBottom: 16,
            fontFamily: 'var(--font-display)',
          }}>
            Account Info
          </div>

          {/* same .map() as original */}
          {profileRows.map((item, i) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                // same border as original — var(--border) token name unchanged
                borderBottom: i < profileRows.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: 13,
              }}
            >
              <span style={{
                // was: color:'var(--muted)' → var(--text-muted)
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
              }}>
                {item.label}
              </span>
              <span style={{
                fontWeight: 500,
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
              }}>
                {item.value || '—'}
              </span>
            </div>
          ))}
        </Card>

        {/* ── Change Password — same structure as original ── */}
        <Card>
          <div style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
            textTransform: 'uppercase',
            // was: color:'var(--muted)' → var(--text-muted)
            color: 'var(--text-muted)',
            marginBottom: 20,
            fontFamily: 'var(--font-display)',
          }}>
            Change Password
          </div>

          {/* same form as original — same fields, same order, same props */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Current Password"
              type="password"
              value={form.currentPassword}
              onChange={set('currentPassword')}
              error={errors.currentPassword}
              placeholder="••••••••"
            />
            <Input
              label="New Password"
              type="password"
              value={form.newPassword}
              onChange={set('newPassword')}
              error={errors.newPassword}
              placeholder="Min 6 characters"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              placeholder="Re-enter new password"
            />
            {/* same Btn props as original: variant="primary" type="submit" loading={saving} */}
            <Btn variant="primary" type="submit" loading={saving}>
              Update Password
            </Btn>
          </form>
        </Card>

      </div>
    </MemberLayout>
  );
}