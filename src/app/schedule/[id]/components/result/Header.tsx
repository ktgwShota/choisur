'use client';

import { Trash2, UserCog } from 'lucide-react';
import ConfirmDialog from '@/components/shared/dialogs/ConfirmDialog';
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

  return (
    <>
      <AdvancedPageTitle
        label="Event Information"
        title={scheduleData.title}
        status={<SocialShareButtons shareText={`${scheduleData.title}の日程調整結果`} />}
        actions={
          <OrganizerMenu
            open={actionsHook.isMenuOpen}
            onOpenChange={actionsHook.handleMenuOpenChange}
          >
            <OrganizerMenuItem
              icon={<UserCog size={18} />}
              title="入力受付を再開"
              onClick={actionsHook.handleReopenConfirm}
            />
            <Separator className="my-2.5 bg-slate-100" />
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
    <ConfirmDialog
      open={actionsHook.deleteDialogOpen}
      onOpenChange={actionsHook.setDeleteDialogOpen}
      title="ページを削除しますか？"
      description="この操作は取り消せません。"
      descriptionClassName="text-red-600"
      confirmText="削除"
      confirmVariant="danger"
      onConfirm={actionsHook.handleDeleteConfirm}
    />
  );
}
