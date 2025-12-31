'use client';

import { Checkbox } from '@/components/shared/primitives/checkbox';
import { getResponsiveValue } from '@/utils/styles';

interface TermsAgreementCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function TermsAgreementCheckbox({
  checked,
  onChange,
  error,
}: TermsAgreementCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(c) => onChange(!!c)}
        className="rounded-[2px] border-gray-300 data-[state=checked]:border-[#1976d2] data-[state=checked]:bg-[#1976d2]"
      />
      <label
        htmlFor="terms"
        className="font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        style={{ fontSize: getResponsiveValue(13, 14) }}
      >
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#1976d2',
            textDecoration: 'none',
            paddingRight: 4,
          }}
        >
          利用規約
        </a>
        に同意する
      </label>
    </div>
  );
}
