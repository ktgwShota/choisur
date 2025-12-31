'use client';

import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import { Button } from '@/components/shared/primitives/button';
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/shared/primitives/dialog';
import { getResponsiveValue } from '@/utils/styles';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onDelete,
  title = 'ページを削除',
  description = 'この操作は取り消せません',
}: DeleteConfirmDialogProps) {
  return (
    <FadeDialog
      maxWidth="400px"
      open={open}
      onOpenChange={onOpenChange}
      header={
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-slate-900 text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center font-medium text-red-600 text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>
      }
      footer={
        <DialogFooter
          className="!justify-center flex flex-row border-border border-t"
          style={{
            paddingTop: getResponsiveValue(20, 24, 320, 900, true),
            gap: getResponsiveValue(20, 24, 320, 900, true),
          }}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-auto w-[110px] rounded-[2px] border-slate-200 py-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            className="h-auto w-[100px] rounded-[2px] bg-red-600 py-3 text-white hover:bg-red-700"
          >
            削除
          </Button>
        </DialogFooter>
      }
    />
  );
}
