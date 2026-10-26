import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, of, timeout } from 'rxjs';
import { MASTER_DEFINITIONS, MasterOption, TenderDraft, emptyTender } from '../models/pretender.model';
import { WorkSummary } from '../models/work-summary.model';
import { PretenderApiService } from '../services/pretender-api.service';
type UploadField = 'nitFileName'|'dtcnFileName'|'otherFileName';
@Component({ selector: 'app-tender-form', standalone: false, templateUrl: './tender-form.component.html', styleUrl: './tender-form.component.css' })
export class TenderFormComponent implements OnInit {
  tender: TenderDraft = emptyTender(); options: Record<string, MasterOption[]> = {}; activeTab: 'add' | 'view' = 'add'; error = ''; success = ''; mastersLoading = false;
  saving = false; loadingRecord = false; recordId: number | null = null; works: WorkSummary[] = []; worksLoading = false; workError = '';
  private readonly files: Partial<Record<UploadField, File>> = {};
  constructor(private readonly api: PretenderApiService, private readonly route: ActivatedRoute, private readonly router: Router, private readonly changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void { this.loadMasters(); this.loadWorks(); this.route.paramMap.subscribe(params => { const id = Number(params.get('id')); if (Number.isInteger(id) && id > 0) this.loadRecord(id); }); }
  private loadWorks(): void { this.worksLoading = true; this.api.listWorks().subscribe({ next: rows => { this.works = rows; this.worksLoading = false; this.changeDetector.markForCheck(); }, error: err => { this.workError = this.apiError(err, 'Could not load available works.'); this.worksLoading = false; this.changeDetector.markForCheck(); } }); }
  private loadRecord(id: number): void {
    this.loadingRecord = true; this.recordId = id;
    this.api.getTender(id).subscribe({ next: value => { const { id: _id, tenderType: _type, tenderCategory: _category, numberOfCovers: _covers, workItemProductCategory: _product, numberOfBidOpeners: _openers, formOfContract: _contract, tendererClass: _class, ...draft } = value; this.tender = draft; this.loadingRecord = false; this.changeDetector.markForCheck(); }, error: err => { this.error = this.apiError(err, 'Could not load this pre-tender record.'); this.loadingRecord = false; this.changeDetector.markForCheck(); } });
  }
  loadMasters(): void {
    this.mastersLoading = true;
    this.error = '';
    forkJoin(MASTER_DEFINITIONS.map(master => this.api.listMasters(master.key).pipe(catchError(() => of(null))))).subscribe(lists => {
      this.options = {};
      lists.forEach((list, index) => { if (list) this.options[MASTER_DEFINITIONS[index].key] = list; });
      this.mastersLoading = false;
      if (lists.some(list => list === null)) this.error = 'Some dropdown values could not be loaded. Start the backend, then retry.';
      this.changeDetector.markForCheck();
    });
  }
  list(key: string): MasterOption[] { return this.options[key] || []; }
  tenderCategories(): MasterOption[] { return this.list('tender-category').filter(option => !!option.code); }
  productCategoryOptions(): MasterOption[] {
    return this.list('work-item-product-category').filter(option => option.tenderCategoryId === this.tender.tenderCategoryId);
  }
  changeTenderCategory(categoryId: number | null): void {
    this.tender.tenderCategoryId = categoryId;
    const selected = this.list('work-item-product-category').find(option => option.id === this.tender.workItemProductCategoryId);
    if (selected && selected.tenderCategoryId !== categoryId) this.tender.workItemProductCategoryId = null;
  }
  chooseFile(event: Event, field: UploadField): void { const file = (event.target as HTMLInputElement).files?.[0]; if (file) { this.files[field] = file; this.tender[field] = file.name; } }
  selectWork(work: WorkSummary): void { this.tender.parentWorkId = work.id; this.tender.parentWorkNumber = work.workNumber; this.tender.parentWorkDescription = work.description; this.workError = ''; }
  selectWorkById(id: string | null): void { const selected = this.works.find(work => work.id === id); if (selected) this.selectWork(selected); else { this.tender.parentWorkId = null; this.tender.parentWorkNumber = null; this.tender.parentWorkDescription = null; } }
  save(): void {
    this.error = ''; this.success = ''; this.saving = true;
    const wasEditing = this.recordId !== null;
    const fields = Object.keys(this.files) as UploadField[];
    const request = fields.length ? (this.recordId ? this.api.updateTenderWithFiles(this.recordId, this.tender, this.files) : this.api.saveTenderWithFiles(this.tender, this.files)) : (this.recordId ? this.api.updateTender(this.recordId, this.tender) : this.api.saveTender(this.tender));
    request.pipe(timeout({ first: 30000 }), finalize(() => { this.saving = false; this.changeDetector.markForCheck(); })).subscribe({
      next: result => {
        this.clearFiles();
        this.router.navigate(['/pretender/tenders'], { queryParams: { saved: result.id, action: wasEditing ? 'updated' : 'saved' } });
      },
      error: err => { this.error = err?.name === 'TimeoutError' ? 'The save request timed out waiting for a response. Check View before retrying to avoid creating a duplicate.' : this.apiError(err, 'Could not save pre-tender details. Check the fields and backend.'); this.changeDetector.markForCheck(); }
    });
  }
  private apiError(err: any, fallback: string): string { return err?.error?.error || err?.error?.message || fallback; }
  clear(): void { if (this.recordId) { this.router.navigate(['/pretender/tenders']); return; } this.tender = emptyTender(); this.clearFiles(); this.error = ''; this.success = ''; }
  private clearFiles(): void { Object.keys(this.files).forEach(key => delete this.files[key as UploadField]); }
}

