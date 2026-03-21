'use client';

import { Eye, FileEdit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { closePollAction, deletePollAction } from '@/app/polls/actions';
import ConfirmDialog from '@/components/shared/dialogs/ConfirmDialog';
import AdvancedPageTitle from '@/components/shared/headings/AdvancedPageTitle';
import OrganizerMenu, { OrganizerMenuItem } from '@/components/shared/others/OrganizerMenu';
import SocialShareButtons from '@/components/shared/others/SocialShareButtons';
import { Separator } from '@/components/shared/primitives/separator';
import type { ParsedPoll as Poll } from '@/db/core/types';
import { useOrganizer } from '@/hooks/useOrganizer';
import { useToastStore } from '@/stores/useToastStore';
import { getOrganizerToken } from '@/utils/storage';
import { usePollVote } from '../../hooks/usePollVote';
import EditVoterNameDialog from '../shared/EditVoterNameDialog';

interface HeaderProps {
  poll: Poll;
}

type DialogType = 'END_POLL' | 'DELETE_POLL' | 'EDIT_VOTER_NAME';

export default function Header({ poll }: HeaderProps) {
  const { voter, updateVoterName } = usePollVote(poll);
  const [activeDialog, setActiveDialog] = useState<DialogType | null>(null);
  const router = useRouter();
  const { showToast, showError } = useToastStore();

  const { checkOrganizerAccess } = useOrganizer({ id: poll.id, type: 'poll' });

  const requireOrganizerAccess = useCallback(
    (dialogType: DialogType) => {
      checkOrganizerAccess(
        () => {
          setActiveDialog(dialogType);
        },
        () => {
          showError('この操作を実行する権限がありません。');
        }
      );
    },
    [checkOrganizerAccess, showError]
  );

  const handleEndPollClick = useCallback(() => {
    requireOrganizerAccess('END_POLL');
  }, [requireOrganizerAccess]);

  const handleDeleteClick = useCallback(() => {
    requireOrganizerAccess('DELETE_POLL');
  }, [requireOrganizerAccess]);

  const openVoterNameDialog = useCallback(() => {
    setActiveDialog('EDIT_VOTER_NAME');
  }, []);

  const handleConfirmEndPoll = async () => {
    setActiveDialog(null);

    const organizerToken = getOrganizerToken(poll.id, 'poll');
    if (!organizerToken) {
      showError('この操作を実行する権限がありません。');
      return;
    }

    try {
      const result = await closePollAction(poll.id, organizerToken);
      if (!result.success) {
        throw new Error(result.error);
      }
      showToast('投票を締め切りました', 'success');
      router.refresh();
    } catch (error) {
      console.error('Error closing poll:', error);
      showError(error instanceof Error ? error.message : '投票の公開に失敗しました。');
    }
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
      console.error('Error deleting poll:', error);
    }
  };

  const handleEditVoterNameSubmit = async (name: string, _userId: string) => {
    if (!voter) {
      return;
    }
    await updateVoterName(name, voter.voterId);
    setActiveDialog(null);
  };

  return (
    <>
      <AdvancedPageTitle
        label="Poll Information"
        title={poll.title}
        actions={
          <OrganizerMenu>
            {voter?.voterName && (
              <OrganizerMenuItem
                onClick={openVoterNameDialog}
                icon={<FileEdit size={16} />}
                title="投票者名を変更"
              />
            )}

            <Separator className="my-2.5 bg-slate-100" />

            <OrganizerMenuItem
              onClick={handleEndPollClick}
              icon={<Eye size={16} />}
              title="投票を締め切る"
            />

            <Separator className="my-2.5 bg-slate-100" />

            <OrganizerMenuItem
              onClick={handleDeleteClick}
              icon={<Trash2 size={16} />}
              title="ページを削除"
              variant="danger"
            />
          </OrganizerMenu>
        }
        status={<SocialShareButtons shareText={`${poll.title}の投票`} />}
      />

      <ConfirmDialog
        open={activeDialog === 'END_POLL'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="投票を締め切りますか？"
        description="投票先の変更や新たな投票ができなくなります。"
        confirmText="締め切る"
        confirmVariant="primary"
        onConfirm={handleConfirmEndPoll}
      />

      <ConfirmDialog
        open={activeDialog === 'DELETE_POLL'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        title="ページを削除しますか？"
        description="この操作は取り消せません。"
        descriptionClassName="text-red-600"
        confirmText="削除"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
      />

      <EditVoterNameDialog
        open={activeDialog === 'EDIT_VOTER_NAME'}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        initialVoterName={voter?.voterName || ''}
        onSubmit={handleEditVoterNameSubmit}
      />
    </>
  );
}
