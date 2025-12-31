'use client';

import { Trash2, UserCog } from 'lucide-react';
import DeleteConfirmDialog from '@/components/shared/dialogs/DeleteConfirmDialog';
import AdvancedPageTitle from '@/components/shared/headings/AdvancedPageTitle';
import OrganizerMenu, { OrganizerMenuItem } from '@/components/shared/others/OrganizerMenu';
import SocialShareButtons from '@/components/shared/others/SocialShareButtons';
import { Separator } from '@/components/shared/primitives/separator';
import type { Schedule } from '@/db/core/types';
import { useActions } from '../../hooks/useActions';

interface HeaderProps {
  schedule: Schedule;
}

export default function Header({ schedule }: HeaderProps) {
  const scheduleData = {
    ...schedule,
    responses: schedule.responses ?? [],
  };

  const actionsHook = useActions({
    scheduleId: scheduleData.id,
  });

  // シェア用のURLを生成
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${scheduleData.title}の日程調整結果`;

  return (
    <>
      <AdvancedPageTitle
        label="Event Information"
        title={scheduleData.title}
        status={<SocialShareButtons shareUrl={shareUrl} shareText={shareText} />}
        actions={
          <OrganizerMenu
            open={actionsHook.isMenuOpen}
            onOpenChange={actionsHook.handleMenuOpenChange}
          >
            <OrganizerMenuItem
              icon={<UserCog size={18} />}
              title="出欠受付を再開"
              onClick={actionsHook.handleReopenConfirm}
            />
            <Separator className="my-1.5 bg-slate-100" />
            <OrganizerMenuItem
              icon={<Trash2 size={18} />}
              title="ページを削除"
              variant="danger"
              onClick={actionsHook.handleDeleteClick}
            />
          </OrganizerMenu>
        }
      />
      <Dialogs actionsHook={actionsHook} />
    </>
  );
}

interface ActionsHook {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  handleDeleteConfirm: () => void;
  isMenuOpen: boolean;
  handleMenuOpenChange: (open: boolean) => void;
  handleReopenConfirm: () => void;
  handleDeleteClick: () => void;
}

interface DialogsProps {
  actionsHook: ActionsHook;
}

function Dialogs({ actionsHook }: DialogsProps) {
  return (
    <DeleteConfirmDialog
      open={actionsHook.deleteDialogOpen}
      onOpenChange={actionsHook.setDeleteDialogOpen}
      onDelete={actionsHook.handleDeleteConfirm}
    />
  );
}
