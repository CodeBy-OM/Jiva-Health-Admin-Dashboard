import React, { ReactNode, CSSProperties } from 'react';

// Badge
type BadgeVariant = 'green' | 'red' | 'amber' | 'teal' | 'blue' | 'purple' | 'gray';
export function Badge({ children, variant = 'gray' }: { children: ReactNode; variant?: BadgeVariant }) {
  const colors: Record<BadgeVariant, { bg: string; color: string }> = {
    green: { bg: 'var(--green-dim)', color: 'var(--green)' },
    red: { bg: 'var(--red-dim)', color: 'var(--red)' },
    amber: { bg: 'var(--amber-dim)', color: 'var(--amber)' },
    teal: { bg: 'var(--teal-dim)', color: 'var(--teal)' },
    blue: { bg: 'var(--blue-dim)', color: 'var(--blue)' },
    purple: { bg: 'var(--purple-dim)', color: 'var(--purple)' },
    gray: { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' },
  };
  const c = colors[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 20,
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
    }}>
      {children}
    </span>
  );
}

// Button
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit';
}
export function Button({ children, onClick, variant = 'secondary', size = 'md', icon, disabled, style, type = 'button' }: BtnProps) {
  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 500,
    borderRadius: 'var(--radius-md)', transition: 'all 0.15s ease',
    opacity: disabled ? 0.5 : 1,
  };
  const sizes = {
    sm: { padding: '5px 10px', fontSize: 12 },
    md: { padding: '8px 14px', fontSize: 13 },
    lg: { padding: '10px 18px', fontSize: 14 },
  };
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: { background: 'var(--teal)', color: '#0a0d14' },
    secondary: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)' },
    danger: { background: 'var(--red-dim)', color: 'var(--red)' },
    outline: { background: 'transparent', color: 'var(--teal)', border: '1px solid var(--teal)' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const el = e.currentTarget;
          if (variant === 'primary') el.style.filter = 'brightness(1.1)';
          else if (variant === 'secondary') el.style.background = 'var(--bg-hover)';
          else if (variant === 'ghost') el.style.background = 'var(--bg-elevated)';
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.filter = '';
        if (variant === 'secondary') el.style.background = 'var(--bg-elevated)';
        else if (variant === 'ghost') el.style.background = 'transparent';
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// Card
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Input
interface InputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  type?: string;
  style?: CSSProperties;
  label?: string;
}
export function Input({ value, onChange, placeholder, icon, type = 'text', style, label }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{ position: 'absolute', left: 10, color: 'var(--text-muted)', display: 'flex' }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: icon ? '8px 12px 8px 34px' : '8px 12px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 13,
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>
    </div>
  );
}

// Select
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  style?: CSSProperties;
}
export function Select({ value, onChange, options, label, style }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '8px 12px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: 13,
          fontFamily: 'var(--font-sans)',
          outline: 'none',
          cursor: 'pointer',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--teal)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: 'var(--bg-elevated)' }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Avatar
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const hue = name.charCodeAt(0) * 7 % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `hsl(${hue}, 50%, 35%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, color: '#fff',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// Modal
export function Modal({ title, children, onClose, width = 520 }: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  width?: number;
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto',
        animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ fontWeight: 600, fontSize: 15 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}
          >×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

// Stat Card
export function StatCard({ label, value, icon, color = 'var(--teal)', sub }: {
  label: string; value: string | number; icon: ReactNode; color?: string; sub?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '18px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--radius-md)',
        background: color.replace(')', ', 0.15)').replace('var(', 'rgba(').replace(/--[^)]+/, color),
        backgroundColor: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// Empty state
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
      {message}
    </div>
  );
}
