import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MasterDefinition, MasterFieldKey, MasterOption, MasterOptionDraft, MASTER_DEFINITIONS } from '../models/pretender.model';
import { PretenderApiService } from '../services/pretender-api.service';
@Component({ selector: 'app-master-page', standalone: false, templateUrl: './master-page.component.html', styleUrl: './master-page.component.css' })
export class MasterPageComponent implements OnInit {
  definition?: MasterDefinition; options: MasterOption[] = []; categories: MasterOption[] = [];
  draft: MasterOptionDraft = this.emptyDraft(); editingId: number | null = null;
  activeTab: 'add' | 'view' = 'add'; error = ''; success = ''; loading = false; loaded = false;
  constructor(private readonly route: ActivatedRoute, private readonly api: PretenderApiService, private readonly changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void { this.route.data.subscribe(data => this.setMaster(data['masterKey'] as string)); }
  private setMaster(key: string): void {
    this.definition = MASTER_DEFINITIONS.find(item => item.key === key);
    this.options = []; this.categories = []; this.reset(); this.activeTab = 'add'; this.error = ''; this.success = ''; this.loaded = false;
    this.load();
  }
  showView(): void { this.activeTab = 'view'; this.reset(); this.error = ''; if (!this.loaded && !this.loading) this.load(); }
  showAdd(): void { this.activeTab = 'add'; this.error = ''; }
  load(): void {
    if (!this.definition) return;
    const key = this.definition.key;
    this.loading = true;
    this.error = '';
    const categories = key === 'work-item-product-category' ? this.api.listMasters('tender-category').pipe(catchError(() => of(null))) : of([] as MasterOption[]);
    forkJoin({ rows: this.api.listMasters(key), categories }).subscribe({
      next: result => { if (this.definition?.key === key) { this.options = result.rows; this.categories = result.categories?.filter(option => !!option.code) || []; this.error = result.categories === null ? 'Could not load tender categories for product-category mapping.' : ''; this.loaded = true; this.loading = false; this.changeDetector.markForCheck(); } },
      error: () => { if (this.definition?.key === key) { this.error = `Could not load ${this.definition.label.toLowerCase()} values. Start the backend and check its database connection.`; this.loading = false; this.loaded = false; this.changeDetector.markForCheck(); } }
    });
  }
  save(): void {
    if (!this.definition) return;
    const value = { ...this.draft };
    const request = this.editingId === null ? this.api.createMaster(this.definition.key, value) : this.api.updateMaster(this.definition.key, this.editingId, value);
    request.subscribe({ next: () => { this.success = `${this.definition?.label} value saved.`; this.error = ''; this.reset(); this.load(); this.changeDetector.markForCheck(); }, error: () => { this.error = `Could not save this ${this.definition?.label.toLowerCase()} value. Check the required fields and category mapping.`; this.changeDetector.markForCheck(); } });
  }
  edit(option: MasterOption): void {
    this.activeTab = 'add'; this.editingId = option.id;
    this.draft = { name: option.name || '', code: option.code || '', description: option.description || '', bovalue: option.bovalue ?? null, tenderCategoryId: option.tenderCategoryId ?? null };
    this.success = ''; this.error = '';
  }
  remove(option: MasterOption): void { if (!this.definition) return; this.api.deleteMaster(this.definition.key, option.id).subscribe({ next: () => { this.success = `${this.definition?.label} value deleted.`; this.load(); this.changeDetector.markForCheck(); }, error: () => { this.error = 'This value may already be used by a tender and cannot be deleted.'; this.changeDetector.markForCheck(); } }); }
  reset(): void { this.draft = this.emptyDraft(); this.editingId = null; }
  setField(key: MasterFieldKey, value: string | number | null): void {
    if (key === 'bovalue') this.draft.bovalue = value === null || value === '' ? null : Number(value);
    else if (key === 'tenderCategoryId') this.draft.tenderCategoryId = value === null || value === '' ? null : Number(value);
    else this.draft[key] = String(value ?? '');
  }
  displayValue(option: MasterOption): string { return option.code || option.name; }
  private emptyDraft(): MasterOptionDraft { return { name: '', code: '', description: '', bovalue: null, tenderCategoryId: null }; }
}
