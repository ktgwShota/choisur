'use client';

import { useFormContext } from 'react-hook-form';
import InputWithCounter from '@/components/shared/forms/InputWithCounter';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shared/primitives/form';
import { cn, getResponsiveValue } from '@/utils/styles';

interface FormInputFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  behavior?: 'standard' | 'notched';
  showCharCount?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function FormInputField({
  name,
  label,
  placeholder,
  maxLength = 50,
  required = false,
  behavior = 'standard',
  showCharCount = false,
  className,
  style,
}: FormInputFieldProps) {
  const { control, watch } = useFormContext();
  const value = watch(name) || '';
  const isNotched = behavior === 'notched';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn('gap-4', isNotched && 'group relative space-y-0', className)}
          style={style}
        >
          {/* Standard Label (Above Input) */}
          {!isNotched && (
            <FormLabel
              className="font-bold text-[#1a202c]"
              style={{ fontSize: getResponsiveValue(15, 16) }}
            >
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <div className="relative">
              <InputWithCounter
                {...field}
                currentLength={value.length}
                maxLength={maxLength}
                showCharCount={showCharCount}
                placeholder={placeholder || (isNotched ? ' ' : '')}
                className="pr-0"
              />

              {/* Notched Label (On Border) */}
              {isNotched && (
                <label
                  htmlFor={name}
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
