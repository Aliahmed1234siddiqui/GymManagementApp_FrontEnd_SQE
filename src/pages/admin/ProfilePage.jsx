import { useState, useEffect } from 'react';
import Layout  from '../../components/Layout/Layout';
import { Btn, Input, Card, StatusBadge, toast, Spinner } from '../../components/common/UI';
import { authAPI, membersAPI } from '../../api/services';

/*
 * NOTE — wire these to your real auth service:
 *   authAPI.getProfile()                      -> { data: <admin object> }
 *   authAPI.updateProfile({ name })           -> updates the profile
 *   authAPI.changePassword({ currentPassword, newPassword })   (optional card)
 * Rename them if your service uses different method names.
 *
 * Email and role are intentionally NOT included in the update payload,
 * so they can never be changed from this screen. Make sure your backend
 * also rejects role/email changes on the profile endpoint.
 */

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const fmtDateTime = (d) =>
  d ? new Date(d).toLocaleString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

function initials(name) {
  return name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '??';
}

function DetailRow({ label, children, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--border)'
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>{children}</span>
    </div>
  );
}

function LockedField({ label, value, hint }) {
  return (
    <div className="field">
      <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {label}
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>🔒 Locked</span>
      </label>
      <input
        className="field-input"
        value={value || ''}
        disabled
        style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
      />
      {hint && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  // Password change (optional — remove this block + the card if unused)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.me();
      setProfile(data);
      setName(data.name || '');
    } catch {
      toast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const dirty = name.trim().length > 0 && name.trim() !== (profile?.name || '');

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!dirty) return;
    setSaving(true);
    try {
      // Only the name is sent — email and role are never updated here.
      const { data } = await membersAPI.update(profile._id, { name: name.trim() });
      setProfile((p) => ({ ...p, ...(data || {}), name: name.trim() }));
      toast('Profile updated', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pw.next.length < 6) { toast('New password must be at least 6 characters', 'error'); return; }
    if (pw.next !== pw.confirm) { toast('Passwords do not match', 'error'); return; }
    setPwSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pw.current, newPassword: pw.next });
      toast('Password changed', 'success');
      setPw({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast(err.response?.data?.message || 'Could not change password', 'error');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Profile">
        <div className="page-loader"><Spinner size={32} /></div>
      </Layout>
    );
  }

  const p = profile || {};

  return (
    <Layout title="Profile">
      <style>{`
        .profile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .form-col-span { grid-column: 1 / -1; }

        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          /* When the header wraps, let the "Member Since" block align left and span full width */
          .profile-since { text-align: left !important; width: 100%; }
        }
      `}</style>

      {/* Header card */}
      <Card style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#EFF6FF', color: '#1D4ED8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, fontWeight: 800, flexShrink: 0
        }}>
          {initials(p.name)}
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{p.name}</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4, wordBreak: 'break-word' }}>{p.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--primary)',
              padding: '4px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, textTransform: 'capitalize'
            }}>
              {p.role}
            </span>
            <StatusBadge status={p.status} />
          </div>
        </div>

        <div className="profile-since" style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: 'var(--font-mono)' }}>
            Member Since
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginTop: 4 }}>{fmt(p.memberSince)}</div>
        </div>
      </Card>

      {/* Two-column: edit form + account details */}
      <div className="profile-grid">
        {/* Edit profile */}
        <Card>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Edit Profile</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
            Update your display name. Email and role are managed by the system.
          </div>

          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            <Input label="Email (Not Changeable)" value={p.email} disabled />
            <Input label="Role (Not Changeable)" value={p.role}  disabled />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
              {dirty && (
                <Btn variant="ghost" type="button" onClick={() => setName(p.name || '')}>Reset</Btn>
              )}
              <Btn variant="primary" type="submit" loading={saving} disabled={!dirty}>Save Changes</Btn>
            </div>
          </form>
        </Card>

        {/* Account details (read-only) */}
        <Card>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Account Details</div>
          <DetailRow label="Account ID">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{p._id}</span>
          </DetailRow>
          <DetailRow label="Role"><span style={{ textTransform: 'capitalize' }}>{p.role}</span></DetailRow>
          <DetailRow label="Status"><StatusBadge status={p.status} /></DetailRow>
          <DetailRow label="Member since">{fmt(p.memberSince)}</DetailRow>
          <DetailRow label="Account created">{fmt(p.createdAt)}</DetailRow>
          <DetailRow label="Last updated" last>{fmtDateTime(p.updatedAt)}</DetailRow>
        </Card>
      </div>

      {/* Change password (optional) */}
      <Card style={{ marginTop: 20, maxWidth: 520 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Change Password</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>
          Use a strong password you don't use elsewhere.
        </div>
        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Current Password" type="password" value={pw.current} onChange={(e) => setPw((s) => ({ ...s, current: e.target.value }))} required />
          <div className="form-grid">
            <Input label="New Password" type="password" value={pw.next} onChange={(e) => setPw((s) => ({ ...s, next: e.target.value }))} required />
            <Input label="Confirm New Password" type="password" value={pw.confirm} onChange={(e) => setPw((s) => ({ ...s, confirm: e.target.value }))} required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Btn variant="primary" type="submit" loading={pwSaving}>Update Password</Btn>
          </div>
        </form>
      </Card>
    </Layout>
  );
}