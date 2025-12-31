'use client';

import { useEffect, useState } from 'react';
import { verifyPollPasswordAction } from '@/app/polls/actions';
import { addCreatedPoll, checkIsOrganizer } from '@/utils/storage';

type OrganizerType = 'schedule' | 'poll';

interface UseOrganizerProps {
  id: string | null;
  password: string | null;
  type: OrganizerType;
}

export function useOrganizer({ id, password, type }: UseOrganizerProps) {
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setIsOrganizer(checkIsOrganizer(id, type));
    }
  }, [id, type]);

  const checkOrganizerAccess = (onAuthorized: () => void, onPasswordRequired?: () => void) => {
    if (!id) return;

    const hasOrganizerFlag = checkIsOrganizer(id, type);

    if (hasOrganizerFlag) {
      onAuthorized();
      return;
    }

    if (!password) {
      setErrorDialogOpen(true);
      return;
    }

    if (onPasswordRequired) {
      onPasswordRequired();
    } else {
      setPasswordDialogOpen(true);
    }
  };

  const verifyPassword = async (password: string): Promise<void> => {
    if (!id) return;

    // TODO: schedule側のパスワード検証actionが追加されたら、typeに応じて切り替え
    // 現時点ではpollのみ対応
    if (type === 'poll') {
      const result = await verifyPollPasswordAction(id, password);

      if (!result.success) {
        throw new Error(result.error || 'パスワードが正しくありません');
      }

      // パスワード認証成功後、作成者リストに追加（共通の認証方式に統一）
      addCreatedPoll(id);
      setIsOrganizer(true);
    } else {
      // schedule側のパスワード検証は今後実装予定
      // const result = await verifySchedulePasswordAction(id, password);
      // addCreatedSchedule(id);
      // setIsOrganizer(true);
      throw new Error('Schedule password verification not yet implemented');
    }
  };

  return {
    isOrganizer,
    passwordDialogOpen,
    errorDialogOpen,
    setPasswordDialogOpen,
    setErrorDialogOpen,
    checkOrganizerAccess,
    verifyPassword,
  };
}
