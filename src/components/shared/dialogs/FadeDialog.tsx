'use client';

import type * as React from 'react';
import { Dialog, DialogContent } from '@/components/shared/primitives/dialog';
import { cn, getResponsiveValue } from '@/utils/styles';

interface FadeDialogProps extends React.ComponentProps<typeof Dialog> {
  header?: React.ReactNode;
  contents?: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
}

/**
 *
 *
 * @example
 *
 * <FadeDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   maxWidth="500px"
 *   header={
 *     <DialogHeader>
 *       <DialogTitle>Example Title</DialogTitle>
 *       <DialogDescription>Example description.</DialogDescription>
 *     </DialogHeader>
 *   }
 *   contents={
 *     <div className="py-4">
 *       Content goes here...
 *     </div>
 *   }
 *   footer={
 *     <DialogFooter>
 *       <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
 *       <Button onClick={handleConfirm}>Confirm</Button>
 *     </DialogFooter>
 *   }
 * />
 */
export default function FadeDialog({
  header,
  contents,
  footer,
  showCloseButton = false,
  maxWidth = '700px',
  ...props
}: FadeDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn(
          'scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 w-full rounded-[2px] border-none bg-white shadow-none outline-none',
          'dialogContent'
        )}
        style={{
          width: `calc(100% - ${getResponsiveValue(40, 64)})`,
          maxWidth: maxWidth,
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: getResponsiveValue(20, 24, 320, 900, true),
          paddingTop: getResponsiveValue(24, 28, 320, 900, true),
          gap: getResponsiveValue(20, 24, 320, 900, true),
        }}
        showCloseButton={showCloseButton}
        data-lenis-prevent // NOTE: Lenisのスムーズスクロールがダイアログ内のスクロールに干渉しないようにする
      >
        {header}
        {contents}
        {footer}
      </DialogContent>

      <style jsx global>{`
        /* Dialog Overlay Animation */
        @keyframes dialogOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes dialogOverlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* Dialog Content Animation */
        @keyframes dialogContentIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes dialogContentOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        /* 
           FadeDialog専用のオーバーレイアニメーション設定
           DialogContentに付与した .dialogContent クラスを手がかりに、
           その直前の兄弟要素（Radix UIの構成上 Overlay は Content の前に来る）をターゲットにする
        */
        [data-slot="dialog-overlay"]:has(+ [data-slot="dialog-content"].dialogContent) {
          animation-duration: 800ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        [data-slot="dialog-overlay"][data-state="open"]:has(+ [data-slot="dialog-content"].dialogContent) {
          animation-name: dialogOverlayIn;
        }
        [data-slot="dialog-overlay"][data-state="closed"]:has(+ [data-slot="dialog-content"].dialogContent) {
          animation-name: dialogOverlayOut;
        }

        /* Content Styles */
        .dialogContent {
          animation-duration: 800ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: both;
        }
        .dialogContent[data-state="open"] { animation-name: dialogContentIn; }
        .dialogContent[data-state="closed"] { animation-name: dialogContentOut; }
      `}</style>
    </Dialog>
  );
}
