import { Clock } from 'lucide-react';
import React, { useRef, useState } from 'react';

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
};

export function HourDropdown({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 56,
        padding: '0 16px',
        backgroundColor: '#F8F9FD',
        borderRadius: 16,
        border: `1px solid ${focused ? '#60A5FA' : '#F3F4F6'}`,
        cursor: 'text',
        transition: 'border-color 150ms ease',
      }}
    >
      <Clock size={20} color="#64748B" style={{ flexShrink: 0 }} />
      <input
        ref={inputRef}
        type="time"
        value={value}
        placeholder={label}
        step={60}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 16,
          color: '#1E293B',
          padding: 0,
          fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
