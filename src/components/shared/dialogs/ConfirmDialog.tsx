'use client';

import FadeDialog from '@/components/shared/dialogs/FadeDialog';
import { Button } from '@/components/shared/primitives/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/shared/primitives/dialog';
import { getResponsiveValue } from '@/utils/styles';

type ConfirmDialogVariant = 'danger' | 'primary';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  descriptionClassName?: string;
  cancelText?: string;
  confirmText: string;
  confirmVariant?: ConfirmDialogVariant;
  onConfirm: () => void;
}

const CONFIRM_BUTTON_CLASS = {
  danger: 'h-auto min-w-0 flex-1 rounded-[2px] bg-red-600 py-3 text-white hover:bg-red-700',
  primary: 'h-auto min-w-0 flex-1 rounded-[2px] bg-[#1976d2] py-3 text-white hover:bg-[#1565c0]',
} as const;

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  descriptionClassName = 'text-slate-600',
  cancelText = 'キャンセル',
  confirmText,
  confirmVariant = 'primary',
  onConfirm,
}: ConfirmDialogProps) {
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
          <h2 className="mb-5 font-bold text-lg text-slate-900">{title}</h2>
          <p className={`whitespace-pre-line text-sm leading-relaxed ${descriptionClassName}`}>
            {description}
          </p>
        </div>
      }
      footer={
        <DialogFooter
          className="flex w-full flex-row border-border border-t"
          style={{
            paddingTop: getResponsiveValue(20, 24, 320, 900, true),
            gap: getResponsiveValue(20, 24, 320, 900, true),
          }}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-auto min-w-0 flex-1 rounded-[2px] border-slate-200 py-3 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className={CONFIRM_BUTTON_CLASS[confirmVariant]}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      }
    />
  );
}
