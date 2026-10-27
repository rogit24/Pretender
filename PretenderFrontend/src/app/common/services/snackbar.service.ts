import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type SnackbarType = 'error' | 'success' | 'info' | 'warning';

export interface SnackbarItem {
  id: number;
  message: string;
  type: SnackbarType;
  duration: number;
  timerId?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private nextId = 1;
  private readonly itemsSubject = new BehaviorSubject<SnackbarItem[]>([]);
  readonly snackbars$: Observable<SnackbarItem[]> = this.itemsSubject.asObservable();

  show(message: string, type: SnackbarType = 'info', duration = 6000): void {
    if (!message || !message.trim()) return;

    const id = this.nextId++;
    const item: SnackbarItem = {
      id,
      message: message.trim(),
      type,
      duration,
    };

    if (duration > 0) {
      item.timerId = setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    const current = this.itemsSubject.getValue();
    // Keep at most 3 simultaneous toasts
    const updated = [item, ...current].slice(0, 3);
    this.itemsSubject.next(updated);
  }

  showError(message: string, duration = 7000): void {
    this.show(message, 'error', duration);
  }

  showSuccess(message: string, duration = 5000): void {
    this.show(message, 'success', duration);
  }

  showWarning(message: string, duration = 6000): void {
    this.show(message, 'warning', duration);
  }

  showInfo(message: string, duration = 5000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    const current = this.itemsSubject.getValue();
    const item = current.find(i => i.id === id);
    if (item && item.timerId) {
      clearTimeout(item.timerId);
    }
    this.itemsSubject.next(current.filter(i => i.id !== id));
  }

  clearAll(): void {
    const current = this.itemsSubject.getValue();
    current.forEach(i => {
      if (i.timerId) clearTimeout(i.timerId);
    });
    this.itemsSubject.next([]);
  }
}
