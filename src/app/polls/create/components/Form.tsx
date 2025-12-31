'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createPollAction } from '@/app/polls/actions';
import FormOptionAccordion from '@/app/schedule/create/components/form/FormOptionAccordion';
import FormInputField from '@/components/shared/forms/FormInputField';
import FormSubmitAction from '@/components/shared/forms/FormSubmitAction';
import RHFForm from '@/components/shared/forms/RHFForm';
import { pollFormSchema } from '@/db/validation/poll';
import type { PollFormData } from '@/db/validation/types';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { addCreatedPoll } from '@/utils/storage';
import { getResponsiveValue } from '@/utils/styles';
import CandidateField from './CandidateField';

export default function Form() {
  const router = useRouter();
  const { submitWithLoadingAnimation } = useFormSubmission();

  const form = useForm<PollFormData>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      title: '',
      options: [
        { url: '', title: '', description: '' },
        { url: '', title: '', description: '' },
      ],
      endDate: '',
      endTime: '',
      password: '',
      hasAgreedToTerms: true,
    },
    mode: 'onChange',
  });

  const { setValue, setError } = form;

  // NOTE: 日程調節ページから遷移してきた場合
  // URLパラメータからタイトルを設定
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const titleParam = params.get('title');
      if (titleParam) {
        setValue('title', titleParam);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: PollFormData) => {
    // タイトルが入力されているオプションを抽出（スキーマで検証済みだが念のため）
    const validOptions = data.options.filter((option) => option.title.trim() !== '');

    await submitWithLoadingAnimation(
      {
        action: (formData: PollFormData) =>
          createPollAction({
            title: formData.title.trim(),
            options: validOptions.map((option) => ({
              url: (option.url || '').trim(),
              title: option.title.trim(),
              description: option.description || undefined,
            })),
            endDate: formData.endDate || null,
            endTime: formData.endTime || null,
            password: formData.password || null,
            createdBy: 'user',
          }),
        onSuccess: (result) => {
          addCreatedPoll(result.id);
          // Set organizer flag for the creator
          localStorage.setItem(`organizer_${result.id}`, 'true');
          router.push(`/polls/${result.id}`);
        },
        onError: (error) => setError('root', { message: error.message }),
        errorMessage: '多数決の作成に失敗しました',
      },
      data
    );
  };

  return (
    <RHFForm form={form} onSubmit={onSubmit}>
      <FormInputField
        name="title"
        label="タイトル"
        placeholder="歓迎会のお店はどこがいい？"
        required
        showCharCount
        style={{ marginBottom: getResponsiveValue(20, 32) }}
      />

      <CandidateField />

      <FormOptionAccordion />

      <FormSubmitAction
        submitLabel="投票ページを作成"
        description="ボタンを押すとお店選び（多数決）のページが作成されます。"
      />
    </RHFForm>
  );
}
