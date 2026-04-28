import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';
import React from 'react';

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TimePickerField({ label, value, onChange, placeholder = 'Select Time' }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && <span style={labelStyle}>{label}</span>}
      <div style={fieldStyle}>
        <Clock size={20} color="#64748B" style={{ flexShrink: 0 }} />
        <TimePicker
          value={value ? dayjs(value, 'HH:mm') : null}
          onChange={(d) => onChange(d ? d.format('HH:mm') : '')}
          format="HH:mm"
          minuteStep={15}
          inputReadOnly
          showNow={false}
          allowClear={false}
          placeholder={placeholder}
          suffixIcon={null}
          variant="borderless"
          style={{ flex: 1, fontSize: 16, backgroundColor: 'transparent', padding: 0 }}
        />
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  height: 56,
  padding: '0 16px',
  backgroundColor: '#F8F9FD',
  borderRadius: 16,
  border: '1px solid #E2E8F0',
};
