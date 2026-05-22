export default function SkeletonCard() {
  return (
    <div style={{
      width: '100%', borderRadius: 16, overflow: 'hidden',
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
    }}>
      <div className="skeleton" style={{ width: '100%', height: 220 }} />
      <div className="skeleton" style={{ height: 16, margin: '12px 16px', width: '70%' }} />
      <div className="skeleton" style={{ height: 12, margin: '8px 16px', width: '50%' }} />
      <div className="skeleton" style={{ height: 40, margin: '8px 16px 16px', width: 'calc(100% - 32px)' }} />
    </div>
  );
}
