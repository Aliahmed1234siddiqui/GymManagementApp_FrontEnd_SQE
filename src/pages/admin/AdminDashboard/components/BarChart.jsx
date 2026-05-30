export default function BarChart({ data }) {
  if (!data?.length) return (
    <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
      No revenue data yet
    </div>
  );
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const max = Math.max(...data.map((d) => d.total), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 130 }}>
      {data.map((d, i) => {
        const h = Math.max(8, Math.round((d.total / max) * 110));
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>
              Rs {(d.total / 1000).toFixed(0)}K
            </span>
            <div
              title={`Rs ${d.total.toLocaleString()}`}
              style={{ width: '100%', height: h, background: 'var(--blue)', borderRadius: '3px 3px 0 0', opacity: 0.85, transition: 'opacity .15s' }}
              onMouseEnter={(e) => (e.target.style.opacity = 1)}
              onMouseLeave={(e) => (e.target.style.opacity = 0.85)}
            />
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {months[(d._id?.month || 1) - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
