import { useState } from 'react';
import { MemberLayout } from '../../components/common/Layout';
import { Input, Btn, Card, toast } from '../../components/common/UI';
import { authAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Required';
    if (!form.newPassword) e.newPassword = 'Required';
    else if (form.newPassword.length < 6) e.newPassword = 'Min 6 characters';
    if (form.newPassword !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast('Password changed successfully', 'success');
      setForm({ currentPassword:'', newPassword:'', confirm:'' });
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to change password', 'error');
    } finally { setSaving(false); }
  };

  return (
    <MemberLayout title="Settings">
      <div style={{ maxWidth:500 }}>
        {/* Profile info */}
        <Card style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:16 }}>Account Info</div>
          {[
            { label:'Name',        value: user?.name },
            { label:'Email',       value: user?.email },
            { label:'Plan',        value: user?.plan?.name },
            { label:'Card Number', value: user?.gymCardNumber },
            { label:'Role',        value: user?.role },
          ].map((item) => (
            <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
              <span style={{ color:'var(--muted)' }}>{item.label}</span>
              <span style={{ fontWeight:500 }}>{item.value || '—'}</span>
            </div>
          ))}
        </Card>

        {/* Change Password */}
        <Card>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:20 }}>Change Password</div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Input label="Current Password" type="password" value={form.currentPassword} onChange={set('currentPassword')} error={errors.currentPassword} placeholder="••••••••" />
            <Input label="New Password"     type="password" value={form.newPassword}     onChange={set('newPassword')}     error={errors.newPassword}     placeholder="Min 6 characters" />
            <Input label="Confirm Password" type="password" value={form.confirm}         onChange={set('confirm')}         error={errors.confirm}         placeholder="Re-enter new password" />
            <Btn variant="primary" type="submit" loading={saving}>Update Password</Btn>
          </form>
        </Card>
      </div>
    </MemberLayout>
  );
}
