import { useState, useEffect, useCallback } from 'react';
import  Layout  from '../../components/Layout/Layout';
import {
  Btn, Input, Select, StatusBadge, SearchBar,
  Table, Modal, ConfirmModal, toast, Spinner, Empty
} from '../../components/common/UI';
import { membersAPI, plansAPI } from '../../api/services';

const BLANK = { name:'', email:'', phone:'', cnic:'', address:'', emergencyContact:'', planId:'', planName:'' };

function MemberForm({ form, setForm, plans, loading, onSubmit, onClose, isEdit }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const planOpts = [{ value: '', label: 'Select plan…' }, ...plans.map((p) => ({ value: p._id, label: `${p.name} — Rs ${p.price}` }))];

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-grid">
        <Input label="Full Name *" value={form.name} onChange={set('name')} placeholder="Ahmed Khan" required />
        <Input label="Email *" type="email" value={form.email} onChange={set('email')} placeholder="ahmed@email.com" required />
        <Input label="Phone" value={form.phone} onChange={set('phone')} placeholder="+92 321 0000000" />
        <Input label="CNIC" value={form.cnic} onChange={set('cnic')} placeholder="42301-1234567-1" />
        <Select label="Membership Plan *" value={form.planId} onChange={(e) => {
          const found = plans.find((p) => p._id === e.target.value);
          setForm((f) => ({ ...f, planId: e.target.value, planName: found?.name || '' }));
        }} options={planOpts} required />
        <Input label="Emergency Contact" value={form.emergencyContact} onChange={set('emergencyContact')} placeholder="Name / Phone" />
        <Input label="Address" value={form.address} onChange={set('address')} placeholder="Block 7, Clifton, Karachi" className="form-col-span" />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
        <Btn variant="ghost" type="button" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" type="submit" loading={loading}>
          {isEdit ? 'Save Changes' : 'Register Member'}
        </Btn>
      </div>
    </form>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatus] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const [form, setForm] = useState(BLANK);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const [mRes, pRes] = await Promise.all([membersAPI.getAll(params), plansAPI.getAll()]);
      setMembers(mRes.data.members);
      setPlans(pRes.data);
    } catch { toast('Failed to load members', 'error'); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(BLANK); setCreateOpen(true); };
  const openEdit   = (m) => {
    setForm({ name: m.name, email: m.email, phone: m.phone||'', cnic: m.cnic||'', address: m.address||'', emergencyContact: m.emergencyContact||'', planId: m.plan?._id||'', planName: m.plan?.name||'' });
    setEditTarget(m);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.planId) { toast('Select a plan', 'error'); return; }
    setSaving(true);
    try {
      await membersAPI.create(form);
      toast('Member registered! Welcome email sent.', 'success');
      setCreateOpen(false); load();
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error');
    } finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await membersAPI.update(editTarget._id, form);
      toast('Member updated', 'success');
      setEditTarget(null); load();
    } catch { toast('Update failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await membersAPI.delete(deleteTarget._id);
      toast('Member removed', 'success');
      setDeleteTarget(null); load();
    } catch { toast('Delete failed', 'error'); }
  };

  const handleStatusChange = async () => {
    const { member, newStatus } = statusTarget;
    try {
      await membersAPI.updateStatus(member._id, newStatus);
      toast(`Status changed to ${newStatus}`, 'success');
      setStatusTarget(null); load();
    } catch { toast('Status update failed', 'error'); }
  };

  const cols = [
    { key: 'name', label: 'Member', render: (v, row) => (
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div className="member-avatar" style={{ width:34, height:34, fontSize:13 }}>{v?.[0]?.toUpperCase()}</div>
        <div><div style={{ fontWeight:600, fontSize:13.5 }}>{v}</div><div style={{ fontSize:11, color:'var(--muted)' }}>{row.email}</div></div>
      </div>
    )},
    { key: 'gymCardNumber', label: 'Card No.', render: (v) => <span style={{ fontFamily:'var(--font-mono)', fontSize:12 }}>{v}</span> },
    { key: 'plan', label: 'Plan', render: (v) => v?.name || '—' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'renewalDate', label: 'Renewal', render: (v) => v ? new Date(v).toLocaleDateString('en-PK') : '—' },
    { key: '_id', label: 'Actions', render: (_, row) => (
      <div style={{ display:'flex', gap:6 }}>
        <Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</Btn>
        <Btn size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setStatusTarget({ member: row, newStatus: row.status === 'Active' ? 'Suspended' : 'Active' }); }}>
          {row.status === 'Active' ? 'Suspend' : 'Activate'}
        </Btn>
        <Btn size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}>Del</Btn>
      </div>
    )},
  ];

  const statusOpts = [{ value:'', label:'All Status' }, { value:'Active', label:'Active' }, { value:'Inactive', label:'Inactive' }, { value:'Suspended', label:'Suspended' }];

  return (
    <Layout title="Members" actions={<Btn variant="primary" size="sm" onClick={openCreate}>+ Add Member</Btn>}>
      <div className="toolbar">
        <div className="toolbar-search"><SearchBar value={search} onChange={setSearch} placeholder="Search name, email, card…" /></div>
        <Select options={statusOpts} value={statusFilter} onChange={(e) => setStatus(e.target.value)} style={{ minWidth:140 }} />
      </div>

      <Table cols={cols} rows={members} loading={loading} emptyText="No members found" />

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Register New Member" width={620}>
        <MemberForm form={form} setForm={setForm} plans={plans} loading={saving} onSubmit={handleCreate} onClose={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Member" width={620}>
        <MemberForm form={form} setForm={setForm} plans={plans} loading={saving} onSubmit={handleEdit} onClose={() => setEditTarget(null)} isEdit />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Member" message={`Remove ${deleteTarget?.name}? This also deletes their gym card.`} danger
      />

      {/* Status Confirm */}
      <ConfirmModal
        open={!!statusTarget} onClose={() => setStatusTarget(null)} onConfirm={handleStatusChange}
        title="Change Status"
        message={`Set ${statusTarget?.member?.name} to ${statusTarget?.newStatus}?`}
        danger={statusTarget?.newStatus === 'Suspended'}
      />
    </Layout>
  );
}
