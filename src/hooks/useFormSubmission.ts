'use client';

import { useLoadingStore } from '@/stores/useLoadingStore';
import { withMinDelay } from '@/utils/async';

interface UseFormSubmissionProps<TData, TResult> {
  action: (data: TData) => Promise<{ success: boolean; data?: TResult; error?: string }>;
  onSuccess: (result: TResult) => void;
  onError?: (error: Error) => void;
  loadingMessage?: string;
  errorMessage?: string;
}

export function useFormSubmission() {
  const { showLoading, hideLoading } = useLoadingStore();

  const submitWithLoadingAnimation = async <TData, TResult>(
    {
      action,
      onSuccess,
      onError,
      loadingMessage = '作成中...',
      errorMessage = '処理に失敗しました。もう一度お試しください。',
    }: UseFormSubmissionProps<TData, TResult>,
    data: TData
  ) => {
    try {
      showLoading(loadingMessage);

      // NOTE: ローディングアニメーションのクオリティを担保するために最低待機時間を確保
      const result = await withMinDelay(action(data), 1500);

      if (!result.success || !result.data) {
        throw new Error(result.error || errorMessage);
      }

      onSuccess(result.data);

      // NOTE: ページ遷移後にローディングを非表示にする
      setTimeout(() => hideLoading(), 500);
    } catch (error) {
      console.error('Submission error:', error);
      hideLoading();

      const normalizedError = error instanceof Error ? error : new Error(errorMessage);
      if (onError) {
        onError(normalizedError);
      }
    }
  };

  return { submitWithLoadingAnimation };
}
