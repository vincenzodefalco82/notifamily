import { Icon } from './icons.jsx';

export function Card({ title, subtitle, action, service, children, className = '', style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          <div className="hstack gap-2">
            {service && <ServiceChip name={service} />}
            {action}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function ServiceChip({ name }) {
  return (
    <span className="service-chip" title={`Microservizio: ${name}`}>
      <span className="service-dot"/>
      {name}
    </span>
  );
}

export function Button({ variant = 'secondary', size, children, icon, onClick, style, disabled }) {
  const cls = ['btn', `btn-${variant}`, size ? `btn-${size}` : ''].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick} style={style} disabled={disabled}>
      {icon && <Icon name={icon} size={14} className="btn-icon" />}
      {children}
    </button>
  );
}

export function Badge({ kind = 'neutral', dot, children }) {
  return (
    <span className={`badge badge-${kind}`}>
      {dot && <span className="badge-dot" style={{ background: dot }} />}
      {children}
    </span>
  );
}

export function Avatar({ name, color = 220, size = 'md' }) {
  const initials = (name || '?').split(' ').map(s => s[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
  const cls = `avatar ${size === 'lg' ? 'avatar-lg' : size === 'xl' ? 'avatar-xl' : ''}`;
  const bg = `oklch(0.85 0.06 ${color})`;
  const fg = `oklch(0.32 0.12 ${color})`;
  return <div className={cls} style={{ background: bg, color: fg }}>{initials}</div>;
}

export function Seg({ value, onChange, options }) {
  return (
    <div className="seg-control">
      {options.map(o => (
        <button key={o.value} className={value === o.value ? 'active' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, desc, cta }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon name={icon} size={28} stroke={1.5} /></div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-desc">{desc}</div>
      {cta}
    </div>
  );
}

export function Drawer({ open, onClose, title, service, children, footer }) {
  if (!open) return null;
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer" role="dialog">
        <div className="drawer-header">
          <div>
            <div style={{ fontSize: 'var(--fs-15)', fontWeight: 600 }}>{title}</div>
            {service && <div style={{ marginTop: 4 }}><ServiceChip name={service} /></div>}
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="close" size={16} /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-footer">{footer}</div>}
      </div>
    </>
  );
}

export function CashflowChart({ lang, height = 220 }) {
  const months = ['Nov', 'Dic', 'Gen', 'Feb', 'Mar', 'Apr'];
  const income = [5200, 5600, 5400, 5400, 5800, 5400];
  const outflow = [3280, 3490, 3920, 3650, 4120, 3780];
  const w = 560, h = height;
  const padL = 44, padR = 14, padT = 16, padB = 26;
  const maxV = 6500;
  const barW = 18;
  const groupW = (w - padL - padR) / months.length;
  const scaleY = v => padT + (1 - v / maxV) * (h - padT - padB);
  const ticks = [0, 2000, 4000, 6000];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height, display: 'block' }}>
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} x2={w - padR} y1={scaleY(t)} y2={scaleY(t)} stroke="var(--divider)" strokeDasharray={t === 0 ? '' : '2 3'} />
          <text x={padL - 8} y={scaleY(t) + 4} fontSize="10" fill="var(--text-3)" textAnchor="end" fontFamily="var(--font-mono)">{t/1000}k</text>
        </g>
      ))}
      {months.map((m, i) => {
        const cx = padL + groupW * i + groupW / 2;
        const yIn = scaleY(income[i]);
        const yOut = scaleY(outflow[i]);
        return (
          <g key={m}>
            <rect x={cx - barW - 1} y={yIn} width={barW} height={h - padB - yIn} rx="3" fill="var(--success)" opacity="0.9" />
            <rect x={cx + 1} y={yOut} width={barW} height={h - padB - yOut} rx="3" fill="var(--accent)" opacity="0.9" />
            <text x={cx} y={h - 8} fontSize="10" fill="var(--text-3)" textAnchor="middle">{m}</text>
          </g>
        );
      })}
      <polyline
        fill="none"
        stroke="var(--text-2)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        points={months.map((m, i) => `${padL + groupW * i + groupW / 2},${scaleY(income[i] - outflow[i])}`).join(' ')}
      />
    </svg>
  );
}

export function Donut({ segments, size = 120, stroke = 18 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-subtle)" strokeWidth={stroke} />
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const el = <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeDasharray={`${len} ${c-len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="butt" />;
        offset += len;
        return el;
      })}
    </svg>
  );
}
