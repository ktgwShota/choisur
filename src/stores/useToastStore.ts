'use client';

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string | null;
  type: ToastType;
  isOpen: boolean;
  showToast: (message: string, type?: ToastType) => void;
  showError: (message?: string) => void; // Keep for backward compatibility or convenience
  closeToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  isOpen: false,
  showToast: (message: string, type: ToastType = 'info') => {
    set({ message, type, isOpen: true });
  },
  showError: (message = 'エラーが発生しました。しばらく時間をおいて再度お試しください。') => {
    set({ message, type: 'error', isOpen: true });
  },
  closeToast: () => {
    set({ isOpen: false });
    setTimeout(() => {
      set({ message: null });
    }, 300);
  },
}));
