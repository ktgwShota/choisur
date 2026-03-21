'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useToastStore } from '@/stores/useToastStore';
import { getOrganizerToken } from '@/utils/storage';
import { closeScheduleAction, deleteScheduleAction, reopenScheduleAction } from '../actions';

interface UseScheduleActionsProps {
  scheduleId: string;
}

export function useActions({ scheduleId }: UseScheduleActionsProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const { isOrganizer } = useOrganizer({
    id: scheduleId,
    type: 'schedule',
  });

  const { showToast, showError } = useToastStore();

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleMenuOpenChange = useCallback((open: boolean) => {
    setIsMenuOpen(open);
  }, []);

  const handleDeleteClick = useCallback(() => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  }, [handleMenuClose]);

  const handleCloseClick = useCallback(() => {
    handleMenuClose();
    setCloseDialogOpen(true);
  }, [handleMenuClose]);

  const handleDeleteConfirm = useCallback(async () => {
    const organizerToken = getOrganizerToken(scheduleId, 'schedule');
    if (!organizerToken) {
      showError('この操作を実行する権限がありません。');
      return;
    }

    try {
      const result = await deleteScheduleAction(scheduleId, organizerToken);
      if (!result.success) {
        throw new Error(result.error || '削除に失敗しました');
      }
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting schedule:', err);
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [scheduleId, showError]);

  const handleCloseConfirm = useCallback(
    async (confirmedDateTime: string) => {
      const organizerToken = getOrganizerToken(scheduleId, 'schedule');
      if (!organizerToken) {
        showError('この操作を実行する権限がありません。');
        return;
      }

      try {
        const _result = await closeScheduleAction(scheduleId, confirmedDateTime, organizerToken);
        showToast('日程を決定しました', 'success');
        router.refresh();
      } catch (err) {
        console.error('Error closing schedule:', err);
        showError(err instanceof Error ? err.message : '確定に失敗しました');
      } finally {
        setCloseDialogOpen(false);
      }
    },
    [scheduleId, router, showError, showToast]
  );

  const handleReopenConfirm = useCallback(async () => {
    handleMenuClose();
    const organizerToken = getOrganizerToken(scheduleId, 'schedule');
    if (!organizerToken) {
      showError('この操作を実行する権限がありません。');
      return;
    }

    try {
      const result = await reopenScheduleAction(scheduleId, organizerToken);
      if (!result.success) {
        throw new Error(result.error || '再開に失敗しました');
      }
      showToast('日程調整を再開しました', 'success');
      router.refresh();
    } catch (err) {
      console.error('Error reopening schedule:', err);
      showError(err instanceof Error ? err.message : '再開に失敗しました');
    }
  }, [scheduleId, router, handleMenuClose, showError, showToast]);

  return {
    isMenuOpen,
    deleteDialogOpen,
    closeDialogOpen,
    handleMenuClose,
    handleMenuOpenChange,
    handleDeleteClick,
    handleCloseClick,
    handleDeleteConfirm,
    handleCloseConfirm,
    handleReopenConfirm,
    setDeleteDialogOpen,
    setCloseDialogOpen,
    isOrganizer,
  };
}
