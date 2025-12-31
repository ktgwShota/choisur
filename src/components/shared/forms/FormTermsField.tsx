'use client';

import { useFormContext } from 'react-hook-form';
import TermsAgreementCheckbox from '@/components/shared/forms/TermsAgreementCheckbox';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/shared/primitives/form';

export default function FormTermsField() {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="hasAgreedToTerms"
      render={({ field }) => (
        <FormItem className="flex flex-col items-center space-y-2">
          <FormControl>
            <TermsAgreementCheckbox checked={field.value} onChange={field.onChange} />
          </FormControl>
          <FormMessage className="font-medium text-red-500 text-xs" />
        </FormItem>
      )}
    />
  );
}
