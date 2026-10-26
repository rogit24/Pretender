import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PretenderApiService } from '../services/pretender-api.service';
import { TenderRecord } from '../models/pretender.model';
import { ActivatedRoute } from '@angular/router';
import { finalize, timeout } from 'rxjs';
@Component({ selector: 'app-tender-list', standalone: false, templateUrl: './tender-list.component.html', styleUrl: './tender-list.component.css' })
export class TenderListComponent implements OnInit {
  tenders: TenderRecord[] = []; error = ''; loading = false; success = '';
  constructor(private readonly api: PretenderApiService, private readonly route: ActivatedRoute, private readonly changeDetector: ChangeDetectorRef) {}
  fileUrl(name: string): string { return this.api.fileUrl(name); }
  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('saved');
    const action = this.route.snapshot.queryParamMap.get('action');
    if (id) this.success = `Pre-tender record #${id} ${action === 'updated' ? 'updated' : 'saved'}.`;
    this.loadTenders();
  }
  loadTenders(): void {
    this.loading = true; this.error = '';
    this.api.listTenders().pipe(timeout({ first: 15000 }), finalize(() => { this.loading = false; this.changeDetector.markForCheck(); })).subscribe({
      next: rows => { this.tenders = rows; this.changeDetector.markForCheck(); },
      error: err => { this.error = err?.name === 'TimeoutError' ? 'The server did not respond within 15 seconds. Confirm that the backend is running, then retry.' : err?.error?.error || err?.error?.message || 'Could not load tenders. Check the backend connection.'; this.changeDetector.markForCheck(); },
    });
  }
}
