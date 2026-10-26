import { Component, OnInit } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { MASTER_DEFINITIONS, MasterOption, TenderDraft, emptyTender } from '../models/pretender.model';
import { PretenderApiService } from '../services/pretender-api.service';
type UploadField = 'nitFileName'|'dtcnFileName'|'otherFileName';
@Component({ selector: 'app-tender-form', standalone: false, templateUrl: './tender-form.component.html', styleUrl: './tender-form.component.css' })
export class TenderFormComponent implements OnInit {
  tender: TenderDraft = emptyTender(); options: Record<string, MasterOption[]> = {}; activeTab: 'add' | 'view' = 'add'; error = ''; success = ''; mastersLoading = false;
  private readonly files: Partial<Record<UploadField, File>> = {};
  constructor(private readonly api: PretenderApiService) {}
  ngOnInit(): void { this.loadMasters(); }
  loadMasters(): void {
    this.mastersLoading = true;
    this.error = '';
    forkJoin(MASTER_DEFINITIONS.map(master => this.api.listMasters(master.key).pipe(catchError(() => of(null))))).subscribe(lists => {
      this.options = {};
      lists.forEach((list, index) => { if (list) this.options[MASTER_DEFINITIONS[index].key] = list; });
      this.mastersLoading = false;
      if (lists.some(list => list === null)) this.error = 'Some dropdown values could not be loaded. Start the backend, then retry.';
    });
  }
  list(key: string): MasterOption[] { return this.options[key] || []; }
  chooseFile(event: Event, field: UploadField): void { const file = (event.target as HTMLInputElement).files?.[0]; if (file) { this.files[field] = file; this.tender[field] = file.name; } }
  save(): void {
    this.error = ''; this.success = '';
    const fields = Object.keys(this.files) as UploadField[];
    const request = fields.length ? forkJoin(fields.map(field => this.api.uploadFile(this.files[field]!))) : of([]);
    request.subscribe({
      next: results => {
        fields.forEach((field, index) => { const result = (results as Array<{fileName:string}>)[index]; if (result) this.tender[field] = result.fileName; });
        this.api.saveTender(this.tender).subscribe({ next: result => { this.success = `Pre-tender details saved (record #${result.id}).`; this.error = ''; this.clearFiles(); }, error: () => this.error = 'Files uploaded, but tender details could not be saved. Check the required fields and database.' });
      }, error: () => this.error = 'A document could not be uploaded. Check the backend and try again.'
    });
  }
  clear(): void { this.tender = emptyTender(); this.clearFiles(); this.error = ''; this.success = ''; }
  private clearFiles(): void { Object.keys(this.files).forEach(key => delete this.files[key as UploadField]); }
}

