import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogService, ConfirmDialogState } from '../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit, OnDestroy {
  dialogState: ConfirmDialogState = {
    isOpen: false,
    title: 'Delete Work?',
    message: 'Are you sure?',
    okText: 'Ok',
    cancelText: 'Cancel',
  };

  private sub?: Subscription;

  constructor(private readonly dialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.sub = this.dialogService.dialogState$.subscribe(state => {
      this.dialogState = state;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onOk(): void {
    this.dialogService.confirmAction();
  }

  onCancel(): void {
    this.dialogService.cancelAction();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.dialogState.isOpen) {
      this.onCancel();
    }
  }
}
