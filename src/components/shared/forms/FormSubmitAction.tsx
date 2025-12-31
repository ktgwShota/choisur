'use client';

import { Loader2, Sparkles } from 'lucide-react';
import type React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/shared/primitives/button';
import { FormMessage } from '@/components/shared/primitives/form';
import { cn, getResponsiveValue } from '@/utils/styles';
import FormTermsField from './FormTermsField';

interface FormSubmitActionProps {
  submitLabel: string;
  submittingLabel?: string;
  description: string;
}

export default function FormSubmitAction({
  submitLabel,
  submittingLabel = '作成中...',
  description,
}: FormSubmitActionProps) {
  const {
    formState: { isSubmitting, errors },
  } = useFormContext();

  return (
    <div style={{ marginTop: getResponsiveValue(20, 32) }}>
      <div className="group flex flex-col md:flex-row md:items-center">
        {/* Combined Accent & Terms Section */}
        <div
          className="flex flex-1 flex-col items-start justify-center border-blue-600/20 border-l-2 transition-colors group-hover:border-blue-600"
          style={{ paddingLeft: getResponsiveValue(20, 40) }}
        >
          <h4 className="mb-6 self-start font-black text-[10px] text-blue-600/80 uppercase tracking-[0.3em] transition-colors group-hover:text-blue-600 md:mb-4 md:text-[11px]">
            Final Step
          </h4>

          <div className="flex w-full flex-col items-center space-y-6 md:pr-8">
            <FormTermsField />
            <p className="text-center font-medium text-[11px] text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Submit Action Section */}
        <div
          className="mt-[var(--submit-mt)] flex w-full flex-col items-center gap-4 md:mt-0 md:flex-1 md:items-end"
          style={{ '--submit-mt': getResponsiveValue(20, 40) } as React.CSSProperties}
        >
          {errors.root && (
            <div className="w-full text-center md:text-right">
              <FormMessage>{errors.root.message as string}</FormMessage>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              'relative h-14 w-full overflow-hidden rounded-[2px] border-none',
              'bg-linear-to-r from-[#1976d2] to-[#1565c0] font-bold text-white tracking-wide',
              'shadow-[0_4px_12px_rgba(25,118,210,0.25)] transition-all duration-300',
              'hover:translate-y-[-1px] hover:shadow-[0_6px_20px_rgba(25,118,210,0.35)] hover:brightness-110',
              'active:translate-y-[0px] active:scale-[0.98]',
              'disabled:cursor-not-allowed disabled:opacity-70 disabled:grayscale-[0.5]'
            )}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{submittingLabel}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5 transition-transform group-hover:rotate-12" />
                  <span>{submitLabel}</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
