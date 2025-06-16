import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

const toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = genId();
  const newToast = {
    ...toast,
    id,
    duration: toast.duration ?? 5000,
  };

  toasts.push(newToast);
  listeners.forEach((listener) => listener([...toasts]));

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id);
  }, newToast.duration);

  return id;
}

function removeToast(id: string) {
  const index = toasts.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach((listener) => listener([...toasts]));
  }
}

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([...toasts]);

  const subscribe = useCallback((listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  React.useEffect(() => {
    const unsubscribe = subscribe(setToastList);
    return unsubscribe;
  }, [subscribe]);

  return {
    toasts: toastList,
    addToast,
    removeToast,
  };
}