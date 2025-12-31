'use client';

import { RotateCcw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deletePollAction, reopenPollAction } from '@/app/polls/actions';
import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import AdvancedPageTitle from '@/components/shared/headings/AdvancedPageTitle';
import OrganizerMenu, { OrganizerMenuItem } from '@/components/shared/others/OrganizerMenu';
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
import { PasswordDialog } from '../shared/PasswordDialog';

interface HeaderProps {
  poll: Poll;
}

export default function Header({ poll }: HeaderProps) {
  const router = useRouter();
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [onPasswordSuccess, setOnPasswordSuccess] = useState<(() => void) | null>(null);

  // シェア用のURLを生成
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${poll.title}の投票結果`;

  const {
    passwordDialogOpen,
    errorDialogOpen,
    setPasswordDialogOpen,
    setErrorDialogOpen,
    checkOrganizerAccess,
    verifyPassword,
  } = useOrganizer({ id: poll.id, password: poll.password, type: 'poll' });

  const requireOrganizerAccess = (action: () => void) => {
    checkOrganizerAccess(action, () => {
      setOnPasswordSuccess(() => action);
      setPasswordDialogOpen(true);
    });
  };

  const handleReopenClick = () => {
    requireOrganizerAccess(() => setReopenDialogOpen(true));
  };

  const handlePasswordConfirm = async (password: string) => {
    await verifyPassword(password);
    setPasswordDialogOpen(false);
    if (onPasswordSuccess) {
      onPasswordSuccess();
      setOnPasswordSuccess(null);
    }
  };

  const handleConfirmReopen = async () => {
    setReopenDialogOpen(false);

    try {
      const result = await reopenPollAction(poll.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      router.refresh();
    } catch (_e) {
      alert('投票の再開に失敗しました。もう一度お試しください。');
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
      alert(error instanceof Error ? error.message : '投票の削除に失敗しました');
    }
  };

  return (
    <>
      <AdvancedPageTitle
        label="Poll Information"
        title={poll.title}
        actions={
          <OrganizerMenu>
            <OrganizerMenuItem
              onClick={handleReopenClick}
              icon={<RotateCcw size={18} />}
              title="投票を再開"
              description="結果を取り消します"
            />

            <Separator className="my-1.5 bg-slate-100" />

            <OrganizerMenuItem
              onClick={handleDeleteClick}
              icon={<Trash2 size={18} />}
              title="ページ削除"
              description="復元できません"
              variant="danger"
            />
          </OrganizerMenu>
        }
        status={<SocialShareButtons shareUrl={shareUrl} shareText={shareText} />}
      />

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
        open={reopenDialogOpen}
        onOpenChange={(open) => !open && setReopenDialogOpen(false)}
        header={
          <DialogHeader>
            <DialogTitle>投票を再開しますか？</DialogTitle>
            <DialogDescription>
              投票を再開すると、結果が非表示になり、新しい投票を受け付けるようになります。
            </DialogDescription>
          </DialogHeader>
        }
        contents={null}
        footer={
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="default" onClick={handleConfirmReopen}>
              投票を再開
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

      <FadeDialog
        maxWidth="400px"
        open={deleteDialogOpen}
        onOpenChange={(open) => !open && setDeleteDialogOpen(false)}
        header={
          <DialogHeader>
            <DialogTitle>投票の削除</DialogTitle>
            <DialogDescription>
              本当に削除してもよろしいですか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
        }
        contents={null}
        footer={
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              削除する
            </Button>
          </DialogFooter>
        }
      />
    </>
  );
}
