import { useState, useEffect } from 'react';
import { MemberLayout } from '../../components/common/Layout';
import { Spinner, Card } from '../../components/common/UI';
import { membersAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function MyCardPage() {
  const { user } = useAuth();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    membersAPI.getCard(user._id)
      .then(({ data }) => setCard(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <MemberLayout title="My Card"><div className="page-loader"><Spinner size={36}/></div></MemberLayout>;
  if (!card)   return <MemberLayout title="My Card"><p style={{ color:'var(--muted)', fontSize:14 }}>Card not found. Contact the front desk.</p></MemberLayout>;

  const member = card.member || user;

  return (
    <MemberLayout title="My Gym Card">
      <div style={{ maxWidth:440 }}>
        <div className="gym-card">
          <div className="gym-card-header">
            <div className="gym-card-logo">MASS<span>GYM</span></div>
            <div className="gym-card-number">{card.cardNumber}</div>
          </div>
          <div className="gym-card-name">{member.name}</div>
          <div className="gym-card-plan">{member.plan?.name || user?.plan?.name || 'Member'}</div>
          {card.qrCode && (
            <img
              src={card.qrCode.startsWith('data:') ? card.qrCode : `data:image/png;base64,${card.qrCode}`}
              alt="QR Code"
              className="gym-card-qr"
            />
          )}
          <div className="gym-card-expiry">
            Valid until:{' '}
            {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-PK', { day:'numeric', month:'long', year:'numeric' }) : '—'}
          </div>
        </div>

        <Card style={{ marginTop:20 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--muted)', marginBottom:14 }}>Card Details</div>
          {[
            { label:'Card Number', value: card.cardNumber, mono:true },
            { label:'Issued Date', value: card.issuedDate ? new Date(card.issuedDate).toLocaleDateString('en-PK') : '—' },
            { label:'Expiry Date', value: card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-PK') : '—' },
            { label:'Status', value: card.isActive ? '🟢 Active' : '🔴 Inactive' },
          ].map((item) => (
            <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
              <span style={{ color:'var(--muted)' }}>{item.label}</span>
              <span style={{ fontFamily: item.mono ? 'var(--font-mono)' : undefined, fontWeight:500 }}>{item.value}</span>
            </div>
          ))}
        </Card>

        <p style={{ marginTop:16, fontSize:12, color:'var(--muted)', textAlign:'center', lineHeight:1.6 }}>
          Present this card at the front desk or scan the QR code for check-in.
        </p>
      </div>
    </MemberLayout>
  );
}
