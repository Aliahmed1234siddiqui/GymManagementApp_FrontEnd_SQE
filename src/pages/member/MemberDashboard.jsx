// import { useState, useEffect } from 'react';
// import { MemberLayout } from '../../components/common/Layout';
// import { StatCard, Card, StatusBadge, Spinner, Btn } from '../../components/common/UI';
// import { dashboardAPI } from '../../api/services';
// import { useNavigate } from 'react-router-dom';

// function DaysRing({ days }) {
//   const max = 30;
//   const pct = Math.min(days / max, 1);
//   const r = 38, cx = 48, cy = 48;
//   const circ = 2 * Math.PI * r;
//   const dash = circ * pct;
//   const color = days <= 3 ? 'var(--red)' : days <= 7 ? 'var(--warning)' : 'var(--success)';

//   return (
//     <div style={{ textAlign:'center' }}>
//       <svg width={96} height={96} viewBox="0 0 96 96">
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface3)" strokeWidth={8} />
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
//           strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
//           transform={`rotate(-90 ${cx} ${cy})`} />
//         <text x={cx} y={cy+2} textAnchor="middle" dominantBaseline="middle"
//           style={{ fontFamily:'var(--font-head)', fontSize:22, fill:'var(--text)', letterSpacing:1 }}>{days}</text>
//         <text x={cx} y={cy+18} textAnchor="middle"
//           style={{ fontFamily:'var(--font-body)', fontSize:9, fill:'var(--muted)', textTransform:'uppercase', letterSpacing:1 }}>days left</text>
//       </svg>
//     </div>
//   );
// }

// export default function MemberDashboard() {
//   const [data, setData]   = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     dashboardAPI.getMemberDashboard()
//       .then(({ data: d }) => setData(d))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);
// console.log(data)
//   if (loading) return <MemberLayout title="My Dashboard"><div className="page-loader"><Spinner size={36}/></div></MemberLayout>;

//   const d = data || {};
//   const profile = d.profile || {};
//   const plan = d.plan || {};
//   const renewal = d.renewal || {};

//   return (
//     <MemberLayout title="My Dashboard">
//       <div className="stats-grid" style={{ gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))' }}>
//         <StatCard label="My Plan" value={plan.name || '—'} icon="🏋️" color="red" />
//         <StatCard label="Plan Price" value={plan.price ? `Rs ${plan.price.toLocaleString()}` : '—'} icon="💵" color="amber" />
//         <StatCard label="Status" value={profile.status || '—'} icon="✅" color="green" />
//         <StatCard label="Unread Alerts" value={d.unreadNotifications ?? 0} icon="🔔" color="blue" />
//       </div>

//       <div className="dash-grid" style={{ marginBottom:24 }}>
//         {/* Profile Card */}
//         <Card>
//           <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:20 }}>
//             <div className="member-avatar" style={{ width:56, height:56, fontSize:22 }}>
//               {profile.name?.[0]?.toUpperCase()}
//             </div>
//             <div>
//               <div style={{ fontWeight:700, fontSize:18 }}>{profile.name}</div>
//               <div style={{ fontSize:13, color:'var(--muted)' }}>{profile.email}</div>
//               <div style={{ fontSize:12, color:'var(--muted)', marginTop:2 }}>{profile.phone}</div>
//             </div>
//             <StatusBadge status={profile.status} />
//           </div>
//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
//             {[
//               { label:'Card Number', value: profile.gymCardNumber, mono:true },
//               { label:'Plan', value: plan.name },
//               { label:'Duration', value: plan.duration ? `${plan.duration} days` : '—' },
//               { label:'Member Since', value: profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-PK') : '—' },
//             ].map((item) => (
//               <div key={item.label} style={{ background:'var(--surface2)', borderRadius:'var(--r-sm)', padding:'10px 14px' }}>
//                 <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:4 }}>{item.label}</div>
//                 <div style={{ fontSize:14, fontFamily: item.mono ? 'var(--font-mono)' : undefined }}>{item.value || '—'}</div>
//               </div>
//             ))}
//           </div>
//           <Btn variant="ghost" size="sm" style={{ marginTop:16, width:'100%' }} onClick={() => navigate('/member/card')}>
//             View My Gym Card →
//           </Btn>
//         </Card>

//         {/* Renewal Card */}
//         <Card>
//           <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:16 }}>Membership Renewal</div>
//           <div style={{ display:'flex', alignItems:'center', gap:24 }}>
//             <DaysRing days={renewal.daysLeft ?? 0} />
//             <div>
//               <div style={{ fontSize:13, color:'var(--muted)', marginBottom:4 }}>Renewal date</div>
//               <div style={{ fontSize:16, fontWeight:700 }}>
//                 {renewal.date ? new Date(renewal.date).toLocaleDateString('en-PK', { day:'numeric', month:'long', year:'numeric' }) : '—'}
//               </div>
//               {renewal.isExpiringSoon && (
//                 <div style={{ marginTop:10, padding:'8px 12px', background:'var(--red-bg)', border:'1px solid rgba(224,32,32,.2)', borderRadius:'var(--r-sm)', fontSize:12, color:'var(--red)' }}>
//                   ⚠ Renewing soon! Contact the front desk.
//                 </div>
//               )}
//               {!renewal.isExpiringSoon && (
//                 <div style={{ marginTop:10, fontSize:12, color:'var(--success)' }}>✓ Membership is active</div>
//               )}
//             </div>
//           </div>

//           {/* Recent payments */}
//           <div style={{ marginTop:24, borderTop:'1px solid var(--border)', paddingTop:16 }}>
//             <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:12 }}>Recent Payments</div>
//             {(d.recentPayments || []).length === 0
//               ? <p style={{ fontSize:13, color:'var(--muted)' }}>No payments on record.</p>
//               : (d.recentPayments || []).map((p) => (
//                 <div key={p._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
//                   <div>
//                     <div style={{ fontSize:13, fontFamily:'var(--font-mono)' }}>{p.invoiceNumber}</div>
//                     <div style={{ fontSize:11, color:'var(--muted)' }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-PK') : '—'}</div>
//                   </div>
//                   <div style={{ display:'flex', gap:8, alignItems:'center' }}>
//                     <span style={{ fontFamily:'var(--font-head)', fontSize:18, color:'var(--red)' }}>Rs {p.amount?.toLocaleString()}</span>
//                     <StatusBadge status={p.status} />
//                   </div>
//                 </div>
//               ))}
//             <Btn variant="ghost" size="sm" style={{ marginTop:12, width:'100%' }} onClick={() => navigate('/member/payments')}>
//               View All Payments →
//             </Btn>
//           </div>
//         </Card>
//       </div>
//     </MemberLayout>
//   );
// }
import React from 'react'

export default function MemberDashboard() {
  return (
    <div>MemberDashboard</div>
  )
}
