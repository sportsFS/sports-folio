import { useApp } from '../context/AppContext';

const ICONS = { success: '✅', error: '⚠️', info: 'ℹ️' };

export default function Toast() {
  const { toast } = useApp();
  return (
    <div className={`toast ${toast.visible ? 'show' : ''}`}>
      <div style={{ fontSize: '1.5rem' }}>{ICONS[toast.type]}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{toast.msg}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{toast.sub}</div>
      </div>
    </div>
  );
}
