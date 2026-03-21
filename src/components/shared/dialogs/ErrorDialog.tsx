'use client';

import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import { Button } from '@/components/shared/primitives/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/shared/primitives/dialog';
import { getResponsiveValue } from '@/utils/styles';

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export default function ErrorDialog({
  open,
  onOpenChange,
  title = '操作を実行できません',
  description = '主催者のみ実行できます。',
}: ErrorDialogProps) {
  return (
    <FadeDialog
      maxWidth="400px"
      open={open}
      onOpenChange={(open) => !open && onOpenChange(false)}
      header={
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
      }
      contents={
        <div className="text-center">
          <h2 className="mb-5 font-bold text-base text-slate-900">{title}</h2>
          <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
      }
      footer={
        <DialogFooter
          className="flex w-full flex-row border-border border-t"
          style={{
            paddingTop: getResponsiveValue(20, 24, 320, 900, true),
          }}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-auto min-w-0 flex-1 rounded-[2px] border-slate-200 py-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            閉じる
          </Button>
        </DialogFooter>
      }
    />
  );
}
