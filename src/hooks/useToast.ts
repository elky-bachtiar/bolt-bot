import { toast as sonnerToast } from 'sonner';
import { useCallback } from 'react';

export interface Toast {
  id?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const addToast = useCallback(({ 
    title, 
    description, 
    variant = 'default',
    duration = 5000,
    action
  }: Omit<Toast, 'id'>) => {
    const toastOptions = {
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
    };

    switch (variant) {
      case 'success':
        return sonnerToast.success(title, {
          description,
          ...toastOptions,
        });
      case 'error':
      case 'destructive':
        return sonnerToast.error(title, {
          description,
          ...toastOptions,
        });
      case 'warning':
        return sonnerToast.warning(title, {
          description,
          ...toastOptions,
        });
      case 'info':
        return sonnerToast.info(title, {
          description,
          ...toastOptions,
        });
      default:
        return sonnerToast(title, {
          description,
          ...toastOptions,
        });
    }
  }, []);

  return { addToast };
}