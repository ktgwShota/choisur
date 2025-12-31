'use client';

import type * as React from 'react';
import InputWithCounter from '@/components/shared/forms/InputWithCounter';
import { cn, getResponsiveValue } from '@/utils/styles';

interface InputFieldProps {
  id?: string;
  name?: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  behavior?: 'standard' | 'notched';
  showCharCount?: boolean;
  error?: string;
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function InputField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onKeyDown,
  placeholder,
  maxLength = 50,
  required = false,
  behavior = 'standard',
  showCharCount = false,
  error,
  autoFocus = false,
  className,
  style,
}: InputFieldProps) {
  const isNotched = behavior === 'notched';

  return (
    <div className={cn('gap-4', isNotched && 'group relative space-y-0', className)} style={style}>
      {/* Standard Label (Above Input) */}
      {!isNotched && (
        <label
          htmlFor={id || name}
          className="mb-2 block font-bold text-[#1a202c]"
          style={{ fontSize: getResponsiveValue(15, 16) }}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <InputWithCounter
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          currentLength={value.length}
          maxLength={maxLength}
          showCharCount={showCharCount}
          placeholder={placeholder || (isNotched ? ' ' : '')}
          autoFocus={autoFocus}
          className="pr-0"
        />

        {/* Notched Label (On Border) */}
        {isNotched && (
          <label
            htmlFor={id || name}
            className={cn(
              'pointer-events-none absolute top-0 left-3 z-10 -translate-y-1/2 bg-white px-1.5 font-normal text-[11px] text-slate-400 uppercase tracking-wider transition-all duration-200',
              'group-focus-within:text-[#1976d2]'
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
