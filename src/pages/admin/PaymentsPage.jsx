import { useState, useEffect, useCallback } from 'react';
import  Layout  from '../../components/Layout/Layout';
import {
  Btn, Input, Select, StatusBadge, SearchBar,
  Table, Modal, ConfirmModal, toast, Spinner
} from '../../components/common/UI';
import { paymentsAPI, membersAPI, plansAPI } from '../../api/services';

const BLANK = { memberId:'', planId:'', amount:'', method:'Cash', note:'', dueDate:'' };

function PaymentForm({ form, setForm, members, plans, loading, onSubmit, onClose }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const memberOpts = [{ value:'', label:'Select member…' }, ...members.map((m) => ({ value: m._id, label: `${m.name} — ${m.gymCardNumber}` }))];
  const planOpts   = [{ value:'', label:'Select plan…' }, ...plans.map((p) => ({ value: p._id, label: `${p.name} — Rs ${p.price}` }))];
  const methodOpts = ['Cash','Card','Bank Transfer'].map((v) => ({ value:v, label:v }));

  return (
    <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <Select label="Member *" options={memberOpts} value={form.memberId} onChange={set('memberId')} required />
      <Select label="Plan *" options={planOpts} value={form.planId} onChange={(e) => {
        const p = plans.find((p) => p._id === e.target.value);
        setForm((f) => ({ ...f, planId: e.target.value, amount: p?.price || f.amount }));
      }} required />
      <div className="form-grid">
        <Input label="Amount (Rs) *" type="number" value={form.amount} onChange={set('amount')} placeholder="3500" required />
        <Select label="Method *" options={methodOpts} value={form.method} onChange={set('method')} />
        <Input label="Due Date" type="date" value={form.dueDate} onChange={set('dueDate')} />
        <Input label="Note" value={form.note} onChange={set('note')} placeholder="Optional note" />
      </div>
      {form.method === 'Bank Transfer' && (
        <div style={{ background:'rgba(245,158,11,.08)', border:'1px solid rgba(245,158,11,.2)', borderRadius:8, padding:'10px 14px', fontSize:12.5, color:'#b06d00' }}>
          Bank Transfer starts as <strong>Pending</strong>. Manually confirm after bank verification.
        </div>
      )}
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:8 }}>
        <Btn variant="ghost" type="button" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" type="submit" loading={loading}>Record Payment</Btn>
      </div>
    </form>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [members,  setMembers]  = useState([]);
  const [plans,    setPlans]    = useState([]);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [filters, setFilters] = useState({ status:'', method:'' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.method) params.method = filters.method;
      const [pRes, mRes, plRes] = await Promise.all([
        paymentsAPI.getAll(params),
        membersAPI.getAll(),
        plansAPI.getAll(),
      ]);
      setPayments(pRes.data.payments);
      setMembers(mRes.data.members);
      setPlans(plRes.data);
    } catch { toast('Failed to load payments', 'error'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await paymentsAPI.create(form);
      toast('Payment recorded! Receipt email sent.', 'success');
      setCreateOpen(false); setForm(BLANK); load();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to record payment', 'error');
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (payment, newStatus) => {
    try {
      await paymentsAPI.updateStatus(payment._id, newStatus);
      toast(`Payment marked as ${newStatus}`, 'success');
      load();
    } catch { toast('Status update failed', 'error'); }
  };

  const cols = [
    { key:'invoiceNumber', label:'Invoice', render:(v) => <span style={{ fontFamily:'var(--font-mono)', fontSize:12 }}>{v}</span> },
    { key:'member', label:'Member', render:(v) => <div><div style={{ fontWeight:600 }}>{v?.name}</div><div style={{ fontSize:11, color:'var(--muted)' }}>{v?.gymCardNumber}</div></div> },
    { key:'plan', label:'Plan', render:(v) => v?.name || '—' },
    { key:'amount', label:'Amount', render:(v) => <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--red)' }}>Rs {v?.toLocaleString()}</span> },
    { key:'method', label:'Method', render:(v) => <span style={{ fontSize:12, color:'var(--muted)' }}>{v}</span> },
    { key:'status', label:'Status', render:(v) => <StatusBadge status={v} /> },
    { key:'paidAt', label:'Paid At', render:(v) => v ? new Date(v).toLocaleDateString('en-PK') : '—' },
    { key:'_id', label:'Actions', render:(_, row) => (
      row.status === 'Pending'
        ? <Btn size="sm" variant="primary" onClick={() => handleStatusChange(row, 'Paid')}>Mark Paid</Btn>
        : row.status === 'Paid'
        ? <span style={{ fontSize:12, color:'var(--success)' }}>✓ Confirmed</span>
        : <Btn size="sm" variant="ghost" onClick={() => handleStatusChange(row, 'Paid')}>Resolve</Btn>
    )},
  ];

  const statusOpts = [{ value:'', label:'All Status' }, ...['Paid','Pending','Overdue'].map((v) => ({ value:v, label:v }))];
  const methodOpts = [{ value:'', label:'All Methods' }, ...['Cash','Card','Bank Transfer'].map((v) => ({ value:v, label:v }))];

  return (
    <Layout title="Payments" actions={<Btn variant="primary" size="sm" onClick={() => { setForm(BLANK); setCreateOpen(true); }}>+ Record Payment</Btn>}>
      <style>{`
        /* Filter toolbar: selects sit inline, wrap/stack on small screens */
        .toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .toolbar > .field { flex: 0 1 auto; }

        /* Two-column form grid inside the modal; one column on phones */
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .form-col-span { grid-column: 1 / -1; }

        @media (max-width: 640px) {
          .toolbar { flex-direction: column; align-items: stretch; gap: 10px; }
          .toolbar > .field { width: 100%; flex: 1 1 auto; }
          .toolbar > .field select { width: 100%; min-width: 0 !important; }

          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="toolbar">
        <Select options={statusOpts} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status:e.target.value }))} style={{ minWidth:140 }} />
        <Select options={methodOpts} value={filters.method} onChange={(e) => setFilters((f) => ({ ...f, method:e.target.value }))} style={{ minWidth:160 }} />
      </div>

      <Table cols={cols} rows={payments} loading={loading} emptyText="No payments found" />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Record Payment" width={580}>
        <PaymentForm form={form} setForm={setForm} members={members} plans={plans} loading={saving} onSubmit={handleCreate} onClose={() => setCreateOpen(false)} />
      </Modal>
    </Layout>
  );
}