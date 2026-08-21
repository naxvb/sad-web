import { ReactNode, useEffect } from 'react';

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return <span className="chip" style={color ? { borderColor: color, color } : undefined}>{children}</span>;
}

/** Overlay (modal) above the current view — does not disturb the list scroll underneath.
 *  Close: click the backdrop or Esc. The panel scrolls internally when content is tall. */
export function Modal({ children, onClose, label }: { children: ReactNode; onClose: () => void; label?: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div
      role="dialog" aria-modal="true" aria-label={label}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto',
        background: 'rgba(15, 18, 25, 0.45)', display: 'grid', placeItems: 'start center', padding: '24px 16px',
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(780px, 100%)' }}>
        {children}
      </div>
    </div>
  );
}

export function Segmented<T extends string>(
  { options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void },
) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          className={o.value === value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SearchInput(
  { value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string },
) {
  return (
    <input className="search" type="search" value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)} />
  );
}

export function EmptyState(
  { icon = '📭', message, action }: { icon?: string; message: string; action?: { label: string; onClick: () => void } },
) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p className="muted">{message}</p>
      {action && <button className="btn-primary" onClick={action.onClick}>{action.label}</button>}
    </div>
  );
}
