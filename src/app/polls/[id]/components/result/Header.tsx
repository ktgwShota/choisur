'use client';

import { RotateCcw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deletePollAction, reopenPollAction } from '@/app/polls/actions';
import ConfirmDialog from '@/components/shared/dialogs/ConfirmDialog';
import AdvancedPageTitle from '@/components/shared/headings/AdvancedPageTitle';
import OrganizerMenu, { OrganizerMenuItem } from '@/components/shared/others/OrganizerMenu';
import SocialShareButtons from '@/components/shared/others/SocialShareButtons';
import { Separator } from '@/components/shared/primitives/separator';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useToastStore } from '@/stores/useToastStore';
import { getOrganizerToken } from '@/utils/storage';

interface HeaderProps {
  poll: Poll;
}

export default function Header({ poll }: HeaderProps) {
  const router = useRouter();
  const { showError } = useToastStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { checkOrganizerAccess } = useOrganizer({ id: poll.id, type: 'poll' });

  const requireOrganizerAccess = (action: () => void) => {
    checkOrganizerAccess(action, () => {
      showError('この操作を実行する権限がありません。');
    });
  };

  const handleReopenClick = () => {
    requireOrganizerAccess(async () => {
      const organizerToken = getOrganizerToken(poll.id, 'poll');
      if (!organizerToken) {
        showError('この操作を実行する権限がありません。');
        return;
      }

      try {
        const result = await reopenPollAction(poll.id, organizerToken);
        if (!result.success) {
          throw new Error(result.error);
        }
        router.refresh();
      } catch (_e) {
        alert('投票の再開に失敗しました。もう一度お試しください。');
      }
    });
  };

  const handleDeleteClick = () => {
    requireOrganizerAccess(() => setDeleteDialogOpen(true));
  };

  const handleConfirmDelete = async () => {
    const organizerToken = getOrganizerToken(poll.id, 'poll');
    if (!organizerToken) {
      showError('この操作を実行する権限がありません。');
      return;
    }

    try {
      const result = await deletePollAction(poll.id, organizerToken);
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
            />

            <Separator className="my-2.5 bg-slate-100" />

            <OrganizerMenuItem
              onClick={handleDeleteClick}
              icon={<Trash2 size={18} />}
              title="ページを削除"
              variant="danger"
            />
          </OrganizerMenu>
        }
        status={<SocialShareButtons shareText={`${poll.title}の投票結果`} />}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="ページを削除しますか？"
        description="この操作は取り消せません。"
        descriptionClassName="text-red-600"
        confirmText="削除"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
