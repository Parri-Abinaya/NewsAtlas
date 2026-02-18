export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: 160, borderRadius: 8, marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: 12, width: '40%' }} />
      <div className="skeleton" style={{ height: 16, width: '90%' }} />
      <div className="skeleton" style={{ height: 16, width: '75%' }} />
      <div className="skeleton" style={{ height: 11, width: '30%', marginTop: 'auto' }} />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton" style={{ height: 14, width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}
