'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/shared/primitives/button';
import { type ToastType, useToastStore } from '@/stores/useToastStore';
import { cn } from '@/utils/styles';

const toastConfig: Record<
  ToastType,
  {
    icon: React.ElementType;
    iconClass: string;
    leftBorderClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-500',
    leftBorderClass: 'border-l-emerald-500',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-red-500',
    leftBorderClass: 'border-l-red-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    leftBorderClass: 'border-l-blue-500',
  },
};

export default function ToastSnackbar() {
  const { message, type, isOpen, closeToast } = useToastStore();
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    if (isOpen) {
      // 成功時はスッと消える(3秒)、エラー時はしっかり読める(6秒)ように調整
      const duration = type === 'error' ? 6000 : 3000;
      const timer = setTimeout(() => {
        closeToast();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, closeToast, type]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1], // smooth easeOutQuint
          }}
          className={cn(
            'fixed right-4 bottom-8 z-[99999] flex items-center gap-3 rounded-[2px] border border-slate-100 border-l-4 bg-white p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)]',
            config.leftBorderClass
          )}
        >
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50',
              config.iconClass
            )}
          >
            <Icon size={18} />
          </div>
          <div className="flex-1 font-medium text-[14px] text-slate-700 leading-tight">
            {message}
          </div>
          <Button
            onClick={closeToast}
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-[2px] text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="閉じる"
          >
            <X size={16} />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
