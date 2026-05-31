import { useState, useEffect } from 'react';
import  Layout  from '../../components/Layout/Layout';
import { Btn, Input, Modal, ConfirmModal, toast, Spinner } from '../../components/common/UI';
import { plansAPI } from '../../api/services';

const BLANK = { name:'', price:'', duration:30, features:'' };

function PlanForm({ form, setForm, loading, onSubmit, onClose, isEdit }) {
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <form onSubmit={onSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div className="form-grid">
        <Input label="Plan Name *" value={form.name} onChange={set('name')} placeholder="Gold" required />
        <Input label="Price (Rs/month) *" type="number" value={form.price} onChange={set('price')} placeholder="6500" required />
        <Input label="Duration (days)" type="number" value={form.duration} onChange={set('duration')} placeholder="30" />
      </div>
      <div className="field">
        <label className="field-label">Features (one per line)</label>
        <textarea
          className="field-input"
          rows={5}
          value={form.features}
          onChange={set('features')}
          placeholder={"Gym floor\nPool access\nUnlimited classes"}
          style={{ resize:'vertical' }}
        />
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:8 }}>
        <Btn variant="ghost" type="button" onClick={onClose}>Cancel</Btn>
        <Btn variant="primary" type="submit" loading={loading}>{isEdit ? 'Save Changes' : 'Create Plan'}</Btn>
      </div>
    </form>
  );
}

export default function PlansPage() {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = async () => {
    setLoading(true);
    try { const { data } = await plansAPI.getAll(); setPlans(data); }
    catch { toast('Failed to load plans', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const featStr = (arr) => (Array.isArray(arr) ? arr.join('\n') : arr || '');

  const openEdit = (p) => {
    setForm({ name:p.name, price:p.price, duration:p.duration||30, features:featStr(p.features) });
    setEditTarget(p);
  };

  const parseFeatures = (str) => str.split('\n').map((s) => s.trim()).filter(Boolean);

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await plansAPI.create({ ...form, price:+form.price, duration:+form.duration, features:parseFeatures(form.features) });
      toast('Plan created', 'success'); setCreateOpen(false); load();
    } catch { toast('Create failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await plansAPI.update(editTarget._id, { ...form, price:+form.price, duration:+form.duration, features:parseFeatures(form.features) });
      toast('Plan updated', 'success'); setEditTarget(null); load();
    } catch { toast('Update failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await plansAPI.delete(deleteTarget._id); toast('Plan deactivated', 'success'); setDeleteTarget(null); load(); }
    catch { toast('Delete failed', 'error'); }
  };

  if (loading) return <Layout title="Plans"><div className="page-loader"><Spinner size={32}/></div></Layout>;

  return (
    <Layout title="Plans" actions={<Btn variant="primary" size="sm" onClick={() => { setForm(BLANK); setCreateOpen(true); }}>+ New Plan</Btn>}>
      <style>{`
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        .plan-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px;
          box-shadow: var(--shadow-sm, 0 1px 2px rgba(26,29,41,.06));
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .plan-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md, 0 6px 20px rgba(26,29,41,.10));
        }
        .plan-card--featured {
          border: 2px solid var(--primary);
          position: relative;
        }
        .plan-card--featured::after {
          content: 'Popular';
          position: absolute;
          top: 16px;
          right: 16px;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: var(--primary);
          background: rgba(55,50,85,.10);
          padding: 3px 9px;
          border-radius: 999px;
        }

        .plan-name {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--text);
        }
        .plan-price {
          font-family: var(--font-display);
          font-size: 34px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.1;
          margin: 6px 0 2px;
        }
        .plan-price small {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted);
        }

        .plan-features {
          list-style: none;
          padding: 0;
          margin: 16px 0 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
          flex: 1;
        }
        .plan-features li {
          position: relative;
          padding-left: 24px;
          font-size: 14px;
          color: var(--text);
          line-height: 1.4;
        }
        .plan-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          color: var(--success);
          font-weight: 700;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 14px;
        }

        @media (max-width: 480px) {
          .plan-card { padding: 20px; }
          .plan-price { font-size: 30px; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="plans-grid">
        {plans.map((plan, i) => (
          <div key={plan._id} className={`plan-card ${i === 1 ? 'plan-card--featured' : ''}`}>
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">Rs {plan.price?.toLocaleString()}<small>/mo</small></div>
            <div style={{ fontSize:12, color:'var(--muted)', marginBottom:12 }}>{plan.duration} days</div>
            <ul className="plan-features">
              {(plan.features || []).map((f, fi) => <li key={fi}>{f}</li>)}
            </ul>
            <div style={{ display:'flex', gap:8, marginTop:20 }}>
              <Btn size="sm" variant="ghost" onClick={() => openEdit(plan)}>Edit</Btn>
              <Btn size="sm" variant="danger" onClick={() => setDeleteTarget(plan)}>Deactivate</Btn>
            </div>
          </div>
        ))}
        {plans.length === 0 && <p style={{ color:'var(--muted)', fontSize:14 }}>No plans found. Create one above.</p>}
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Plan" width={520}>
        <PlanForm form={form} setForm={setForm} loading={saving} onSubmit={handleCreate} onClose={() => setCreateOpen(false)} />
      </Modal>
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Plan" width={520}>
        <PlanForm form={form} setForm={setForm} loading={saving} onSubmit={handleEdit} onClose={() => setEditTarget(null)} isEdit />
      </Modal>
      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Deactivate Plan" message={`Deactivate "${deleteTarget?.name}"? Existing members won't be affected.`} danger />
    </Layout>
  );
}