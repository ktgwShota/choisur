'use client';

import { Eye, FileEdit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { closePollAction, deletePollAction } from '@/app/polls/actions';
import DeleteConfirmDialog from '@/components/shared/dialogs/DeleteConfirmDialog';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import InputField from '@/components/shared/forms/InputField';
import AdvancedPageTitle from '@/components/shared/headings/AdvancedPageTitle';
import OrganizerMenu, { OrganizerMenuItem } from '@/components/shared/others/OrganizerMenu';
// import { CountdownTimer } from '@/components/data-display/CountdownTimer'; // TODO: 残り時間を表示するデザインを考えて追加する
import SocialShareButtons from '@/components/shared/others/SocialShareButtons';
import { Button } from '@/components/shared/primitives/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/primitives/dialog';
import { Separator } from '@/components/shared/primitives/separator';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useToastStore } from '@/stores/useToastStore';
import { PasswordDialog } from '../shared/PasswordDialog';

const DIALOG_MODE = {
  CAST_VOTE: 'castVote',
  EDIT_VOTER_NAME: 'editVoterName',
} as const;

type DialogState =
  | { mode: typeof DIALOG_MODE.CAST_VOTE; optionId: number }
  | { mode: typeof DIALOG_MODE.EDIT_VOTER_NAME };

interface HeaderProps {
  poll: Poll;
  onChangeVoterName: () => void;
  dialogState: DialogState | null;
  initialVoterName?: string;
  onDialogClose: () => void;
  onDialogSubmit: (name: string, userId: string, optionId?: number) => Promise<void>;
}

export default function Header({
  poll,
  onChangeVoterName,
  dialogState,
  initialVoterName = '',
  onDialogClose,
  onDialogSubmit,
}: HeaderProps) {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [onPasswordSuccess, setOnPasswordSuccess] = useState<(() => void) | null>(null);
  const [localName, setLocalName] = useState(initialVoterName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    passwordDialogOpen,
    errorDialogOpen,
    setPasswordDialogOpen,
    setErrorDialogOpen,
    checkOrganizerAccess,
    verifyPassword,
  } = useOrganizer({ id: poll.id, password: poll.password, type: 'poll' });

  const { showToast, showError } = useToastStore();

  const requireOrganizerAccess = (action: () => void) => {
    checkOrganizerAccess(action, () => {
      setOnPasswordSuccess(() => action);
      setPasswordDialogOpen(true);
    });
  };

  const handleEndPollClick = () => {
    requireOrganizerAccess(() => setConfirmDialogOpen(true));
  };

  const handlePasswordConfirm = async (password: string) => {
    await verifyPassword(password);
    setPasswordDialogOpen(false);
    if (onPasswordSuccess) {
      onPasswordSuccess();
      setOnPasswordSuccess(null);
    }
  };

  const handleConfirmEndPoll = async () => {
    setConfirmDialogOpen(false);

    try {
      const result = await closePollAction(poll.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      showToast('投票結果を公開しました', 'success');
      router.refresh();
    } catch (error) {
      console.error('Error closing poll:', error);
      showError(error instanceof Error ? error.message : '投票の公開に失敗しました。');
    }
  };

  const handleDeleteClick = () => {
    requireOrganizerAccess(() => setDeleteDialogOpen(true));
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await deletePollAction(poll.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting poll:', error);
    }
  };

  useEffect(() => {
    if (dialogState) {
      setLocalName(dialogState.mode === DIALOG_MODE.EDIT_VOTER_NAME ? initialVoterName || '' : '');
      setError(null);
    }
  }, [initialVoterName, dialogState]);

  const handleDialogSave = async () => {
    const trimmedName = localName.trim();
    if (!trimmedName) {
      setError('名前を入力してください');
      return;
    }
    if (trimmedName.length > 20) {
      setError('名前は20文字以内で入力してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const optionId =
        dialogState?.mode === DIALOG_MODE.CAST_VOTE ? dialogState.optionId : undefined;
      await onDialogSubmit(trimmedName, userId, optionId);
      onDialogClose();
    } catch (e) {
      console.error(e);
      setError('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canEndPoll = !poll.isClosed;

  // シェア用のURLを生成
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${poll.title}の投票`;

  return (
    <>
      <AdvancedPageTitle
        label="Poll Information"
        title={poll.title}
        actions={
          <OrganizerMenu>
            <OrganizerMenuItem
              onClick={onChangeVoterName}
              icon={<FileEdit size={16} />}
              title="投票者名を設定"
              description="表示される名前を変更します"
            />

            <OrganizerMenuItem
              onClick={handleEndPollClick}
              disabled={!canEndPoll}
              icon={<Eye size={16} />}
              title="投票結果を公開"
              description="受付を締め切り、全員に表示します"
            />

            <Separator className="my-1.5 bg-slate-100" />

            <OrganizerMenuItem
              onClick={handleDeleteClick}
              icon={<Trash2 size={16} />}
              title="ページ削除"
              description="復元できません"
              variant="danger"
            />
          </OrganizerMenu>
        }
        status={<SocialShareButtons shareUrl={shareUrl} shareText={shareText} />}
      />
      {/* TODO: 残り時間を表示するデザインを考えて追加する
      <AdvancedPageTitle
        status={
          <CountdownTimer
            endDateTime={poll.endDateTime || null}
            isClosed={poll.isClosed || false}
          />
        }
      />
      */}

      <PasswordDialog
        open={passwordDialogOpen}
        onClose={() => {
          setPasswordDialogOpen(false);
          setOnPasswordSuccess(null);
        }}
        onConfirm={handlePasswordConfirm}
      />

      <FadeDialog
        maxWidth="400px"
        open={confirmDialogOpen}
        onOpenChange={(open) => !open && setConfirmDialogOpen(false)}
        header={
          <DialogHeader>
            <DialogTitle>投票を終了しますか？</DialogTitle>
            <DialogDescription>
              投票を終了すると結果が全員に表示され、以降は新しい投票を受け付けなくなります。
            </DialogDescription>
          </DialogHeader>
        }
        contents={null}
        footer={
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleConfirmEndPoll}>
              投票を終了
            </Button>
          </DialogFooter>
        }
      />

      <FadeDialog
        open={errorDialogOpen}
        onOpenChange={(open) => !open && setErrorDialogOpen(false)}
        header={
          <DialogHeader>
            <DialogTitle>操作を実行できません</DialogTitle>
            <DialogDescription>主催者のみ実行できます。</DialogDescription>
          </DialogHeader>
        }
        contents={null}
        footer={
          <DialogFooter>
            <Button variant="default" onClick={() => setErrorDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        }
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(false)}
        onDelete={handleConfirmDelete}
      />

      {/* 投票者名設定/変更ダイアログ */}
      {dialogState && (
        <FadeDialog
          maxWidth="400px"
          open={!!dialogState}
          onOpenChange={(val) => !val && onDialogClose()}
          header={
            <DialogHeader className="sr-only">
              <DialogTitle>
                {dialogState.mode === DIALOG_MODE.EDIT_VOTER_NAME
                  ? '投票者名の変更'
                  : '投票者名の設定'}
              </DialogTitle>
            </DialogHeader>
          }
          contents={
            <InputField
              id="voterName"
              name="voterName"
              label="名前"
              type="text"
              required
              behavior="notched"
              value={localName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLocalName(e.target.value);
                setError(null);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleDialogSave();
                }
              }}
              placeholder="田中 太郎"
              autoFocus
              maxLength={20}
              error={error || undefined}
            />
          }
          footer={
            <DialogFooter className="flex flex-row justify-end gap-5">
              <Button
                variant="outline"
                onClick={onDialogClose}
                disabled={isSubmitting}
                className="rounded-[2px] border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleDialogSave}
                disabled={isSubmitting}
                className="relative rounded-[2px] bg-[#1976d2] text-white hover:bg-[#1565c0]"
              >
                <span className={isSubmitting ? 'invisible opacity-0' : ''}>
                  {isSubmitting
                    ? dialogState.mode === DIALOG_MODE.EDIT_VOTER_NAME
                      ? '更新中...'
                      : '投票中...'
                    : dialogState.mode === DIALOG_MODE.EDIT_VOTER_NAME
                      ? '更新'
                      : '投票'}
                </span>
                {isSubmitting && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-5 w-5 animate-spin text-current" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                )}
              </Button>
            </DialogFooter>
          }
        />
      )}
    </>
  );
}
