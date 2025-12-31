'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import FormInputField from '@/components/shared/forms/FormInputField';
import FormSubmitAction from '@/components/shared/forms/FormSubmitAction';
import RHFForm from '@/components/shared/forms/RHFForm';
import { scheduleFormSchema } from '@/db/validation/schedule';
import type { ScheduleFormData } from '@/db/validation/types';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { addCreatedSchedule } from '@/utils/storage';
import { getResponsiveValue } from '@/utils/styles';
import { createScheduleAction } from '../../actions';
import CandidateDatesField from './candidate-dates-field';
import SelectedList from './candidate-dates-field/SelectedList';
import FormOptionAccordion from './FormOptionAccordion';

interface ScheduleFormProps {
  initialTitle?: string;
  pollId?: string;
}

export default function ScheduleCreateForm({ initialTitle, pollId }: ScheduleFormProps) {
  const router = useRouter();
  const { submitWithLoadingAnimation } = useFormSubmission();

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      title: initialTitle || '',
      dates: [],
      endDate: '',
      endTime: '',
      hasAgreedToTerms: true,
    },
    mode: 'onChange',
  });

  const { setError, control } = form;

  const onSubmit = async (data: ScheduleFormData) => {
    await submitWithLoadingAnimation(
      {
        action: (formData: ScheduleFormData) =>
          createScheduleAction({
            title: formData.title.trim(),
            dates: formData.dates,
            endDate: formData.endDate || null,
            endTime: formData.endTime || null,
            pollId: pollId || undefined,
          }),
        onSuccess: (result: { id: string }) => {
          addCreatedSchedule(result.id);
          router.push(`/schedule/${result.id}`);
        },
        onError: (error: Error) => setError('root', { message: error.message }),
        errorMessage: '出欠表の作成に失敗しました',
      },
      data
    );
  };

  return (
    <RHFForm form={form} onSubmit={onSubmit}>
      <FormInputField
        name="title"
        label="タイトル"
        placeholder="忘年会の日程はいつがいい？"
        showCharCount
        style={{ marginBottom: getResponsiveValue(20, 32) }}
      />

      <CandidateDatesField control={control} />

      <SelectedList />

      <FormOptionAccordion />

      <FormSubmitAction
        submitLabel="出欠表を作成"
        description="ボタンを押すと日程調整用の URL が発行されます。"
      />
    </RHFForm>
  );
}
