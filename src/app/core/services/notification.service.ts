// src/app/core/services/notification.service.ts

import { Injectable, signal } from '@angular/core';

export type NotifType = 'success' | 'error' | 'warning' | 'info';

import { toast } from 'ngx-sonner';

export interface Notification {
  id: string;
  type: NotifType;
  message: string;
  duration: number; // ms
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(message: string, description?: string): void {
    toast.success(message, { description });
  }

  error(message: string, description?: string): void {
    toast.error(message, { description });
  }

  warning(message: string, description?: string): void {
    toast.warning(message, { description });
  }

  info(message: string, description?: string): void {
    toast.info(message, { description });
  }

  // Toast avec action (ex: "Annuler")
  action(message: string, label: string, onClick: () => void): void {
    toast(message, {
      action: { label, onClick },
    });
  }

  // Toast de chargement (ex: pendant un upload)
  loading(message: string): string | number {
    return toast.loading(message);
  }

  // Mettre à jour un toast loading en succès/erreur
  resolve(id: string | number, message: string, type: 'success' | 'error' = 'success'): void {
    if (type === 'success') {
      toast.success(message, { id });
    } else {
      toast.error(message, { id });
    }
  }

  dismiss(id?: string | number): void {
    toast.dismiss(id);
  }
}
