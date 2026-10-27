import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MasterDefinition, MasterFieldKey, MasterOption, MasterOptionDraft, MASTER_DEFINITIONS } from '../models/pretender.model';
import { PretenderApiService } from '../services/pretender-api.service';
import { SnackbarService } from '../../../common/services/snackbar.service';
import { ConfirmDialogService } from '../../../common/services/confirm-dialog.service';

@Component({ selector: 'app-master-page', standalone: false, templateUrl: './master-page.component.html' })
export class MasterPageComponent implements OnInit {
  definition?: MasterDefinition; options: MasterOption[] = []; categories: MasterOption[] = [];
  draft: MasterOptionDraft = this.emptyDraft(); editingId: number | null = null;
  activeTab: 'add' | 'view' = 'add'; error = ''; success = ''; loading = false; loaded = false;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: PretenderApiService,
    private readonly snackbar: SnackbarService,
    private readonly confirmDialog: ConfirmDialogService
  ) {}
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
      next: result => {
        if (this.definition?.key === key) {
          this.options = result.rows;
          this.categories = result.categories?.filter(option => !!option.code) || [];
          if (result.categories === null) {
            this.error = 'Could not load tender categories for product-category mapping.';
            this.snackbar.showError(this.error);
          }
          this.loaded = true;
          this.loading = false;
        }
      },
      error: () => {
        if (this.definition?.key === key) {
          this.error = `Could not load ${this.definition.label.toLowerCase()} values. Start the backend and check its database connection.`;
          this.snackbar.showError(this.error);
          this.loading = false;
          this.loaded = false;
        }
      }
    });
  }
  save(): void {
    if (!this.definition) return;
    const value = { ...this.draft };
    const request = this.editingId === null ? this.api.createMaster(this.definition.key, value) : this.api.updateMaster(this.definition.key, this.editingId, value);
    request.subscribe({
      next: () => {
        const msg = `${this.definition?.label} value saved.`;
        this.success = msg;
        this.error = '';
        this.snackbar.showSuccess(msg);
        this.reset();
        this.load();
      },
      error: () => {
        const err = `Could not save this ${this.definition?.label.toLowerCase()} value. Check the required fields and category mapping.`;
        this.error = err;
        this.snackbar.showError(err);
      }
    });
  }
  edit(option: MasterOption): void {
    this.activeTab = 'add'; this.editingId = option.id;
    this.draft = { name: option.name || '', code: option.code || '', description: option.description || '', bovalue: option.bovalue ?? null, tenderCategoryId: option.tenderCategoryId ?? null };
    this.success = ''; this.error = '';
  }
  remove(option: MasterOption): void {
    if (!this.definition) return;
    this.confirmDialog.confirm({
      title: 'Delete Work?',
      message: 'Are you sure?',
      okText: 'Ok',
      cancelText: 'Cancel'
    }).then(confirmed => {
      if (!confirmed || !this.definition) return;
      this.api.deleteMaster(this.definition.key, option.id).subscribe({
        next: () => {
          const msg = `${this.definition?.label} value deleted.`;
          this.success = msg;
          this.snackbar.showSuccess(msg);
          this.load();
        },
        error: () => {
          const err = 'This value may already be used by a tender and cannot be deleted.';
          this.error = err;
          this.snackbar.showError(err);
        }
      });
    });
  }
  reset(): void { this.draft = this.emptyDraft(); this.editingId = null; }
  setField(key: MasterFieldKey, value: string | number | null): void {
    if (key === 'bovalue') this.draft.bovalue = value === null || value === '' ? null : Number(value);
    else if (key === 'tenderCategoryId') this.draft.tenderCategoryId = value === null || value === '' ? null : Number(value);
    else this.draft[key] = String(value ?? '');
  }
  displayValue(option: MasterOption): string { return option.code || option.name; }
  private emptyDraft(): MasterOptionDraft { return { name: '', code: '', description: '', bovalue: null, tenderCategoryId: null }; }
}
