'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useToastStore } from '@/stores/useToastStore';
import { closeScheduleAction, deleteScheduleAction, reopenScheduleAction } from '../actions';

interface UseScheduleActionsProps {
  scheduleId: string;
  schedulePassword?: string | null;
}

export function useActions({ scheduleId, schedulePassword = null }: UseScheduleActionsProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const { isOrganizer } = useOrganizer({
    id: scheduleId,
    password: schedulePassword,
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
    try {
      const result = await deleteScheduleAction(scheduleId);
      if (!result.success) {
        throw new Error(result.error || '削除に失敗しました');
      }
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting schedule:', err);
    } finally {
      setDeleteDialogOpen(false);
    }
  }, [scheduleId]);

  const handleCloseConfirm = useCallback(
    async (confirmedDateTime: string) => {
      try {
        const _result = await closeScheduleAction(scheduleId, confirmedDateTime);
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
    try {
      const result = await reopenScheduleAction(scheduleId);
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
