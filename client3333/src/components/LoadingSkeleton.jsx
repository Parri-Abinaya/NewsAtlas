export function SkeletonCard() {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="skeleton" style={{ height: 160, borderRadius: 10, marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: 11, width: '35%' }} />
      <div className="skeleton" style={{ height: 15, width: '90%' }} />
      <div className="skeleton" style={{ height: 15, width: '78%' }} />
      <div className="skeleton" style={{ height: 10, width: '25%', marginTop: 'auto' }} />
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}
