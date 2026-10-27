import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnackbarItem, SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: false,
  templateUrl: './snackbar.component.html',
})
export class SnackbarComponent implements OnInit, OnDestroy {
  items: SnackbarItem[] = [];
  copiedId: number | null = null;
  private sub?: Subscription;
  private copyTimeout?: any;

  constructor(private readonly snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.sub = this.snackbarService.snackbars$.subscribe(items => {
      this.items = items;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

  dismiss(item: SnackbarItem): void {
    this.snackbarService.dismiss(item.id);
  }

  copyText(item: SnackbarItem, event: Event): void {
    event.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(item.message).then(() => {
        this.copiedId = item.id;
        if (this.copyTimeout) clearTimeout(this.copyTimeout);
        this.copyTimeout = setTimeout(() => {
          this.copiedId = null;
        }, 1800);
      }).catch(() => {
        this.fallbackCopy(item.message);
      });
    } else {
      this.fallbackCopy(item.message);
    }
  }

  private fallbackCopy(text: string): void {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copiedId = -1;
      setTimeout(() => (this.copiedId = null), 1800);
    } catch {
      // ignore
    }
  }
}
