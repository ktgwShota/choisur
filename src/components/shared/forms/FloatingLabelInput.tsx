'use client';

import * as React from 'react';
import { Input } from '../primitives/input';

export interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  helperText?: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, id, className, value, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative w-full">
          <Input
            {...props}
            id={id}
            ref={ref}
            value={value}
            placeholder=" "
            className={`peer h-[56px] w-full rounded-[2px] border-[rgba(0,0,0,0.23)] bg-transparent px-[14px] pt-1 pb-2 text-base focus-visible:border-2 focus-visible:outline-none focus-visible:ring-0 ${
              error
                ? 'border-red-600 focus-visible:border-red-600'
                : 'focus-visible:border-[#1976d2]'
            } ${className}`}
          />
          <label
            htmlFor={id}
            className={`pointer-events-none absolute top-0 left-[14px] z-10 origin-[0] -translate-y-1/2 scale-75 transform bg-white px-1 duration-200 ${
              error ? 'text-red-600' : 'text-slate-500 peer-focus:text-[#1976d2]'
            }`}
          >
            {label}
          </label>
        </div>
        {helperText && (
          <p className={`mt-2 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';

export default FloatingLabelInput;
