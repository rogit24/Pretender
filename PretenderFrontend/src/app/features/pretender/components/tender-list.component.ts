import { Component, OnInit } from '@angular/core';
import { PretenderApiService } from '../services/pretender-api.service';
import { TenderRecord } from '../models/pretender.model';
import { SnackbarService } from '../../../common/services/snackbar.service';
import { ConfirmDialogService } from '../../../common/services/confirm-dialog.service';

@Component({
  selector: 'app-tender-list',
  standalone: false,
  templateUrl: './tender-list.component.html',
})
export class TenderListComponent implements OnInit {
  tenders: TenderRecord[] = [];
  error = '';

  constructor(
    private readonly api: PretenderApiService,
    private readonly snackbar: SnackbarService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}

  fileUrl(name: string): string {
    return this.api.fileUrl(name);
  }

  ngOnInit(): void {
    this.api.listTenders().subscribe({
      next: rows => (this.tenders = rows),
      error: () => {
        this.error = 'Could not load tenders. Check the backend connection.';
        this.snackbar.showError(this.error);
      },
    });
  }

  deleteTender(tender: TenderRecord): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Work?',
        message: 'Are you sure?',
        okText: 'Ok',
        cancelText: 'Cancel',
      })
      .then(confirmed => {
        if (confirmed) {
          this.tenders = this.tenders.filter(t => t.id !== tender.id);
          this.snackbar.showSuccess(
            `Tender #${tender.id} (${tender.tenderReferenceNumber}) deleted.`
          );
        }
      });
  }
}
