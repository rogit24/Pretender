import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterDefinition, MasterOption, MASTER_DEFINITIONS } from '../models/pretender.model';
import { PretenderApiService } from '../services/pretender-api.service';
@Component({ selector: 'app-master-page', standalone: false, templateUrl: './master-page.component.html', styleUrl: './master-page.component.css' })
export class MasterPageComponent implements OnInit {
  definition?: MasterDefinition; options: MasterOption[] = []; name = ''; editingId: number | null = null;
  activeTab: 'add' | 'view' = 'add'; error = ''; success = ''; loading = false; loaded = false;
  constructor(private readonly route: ActivatedRoute, private readonly api: PretenderApiService) {}
  ngOnInit(): void { this.route.data.subscribe(data => this.setMaster(data['masterKey'] as string)); }
  private setMaster(key: string): void {
    this.definition = MASTER_DEFINITIONS.find(item => item.key === key);
    this.options = []; this.name = ''; this.editingId = null; this.activeTab = 'add'; this.error = ''; this.success = ''; this.loaded = false;
    this.load();
  }
  showView(): void { this.activeTab = 'view'; this.editingId = null; this.name = ''; this.error = ''; if (!this.loaded && !this.loading) this.load(); }
  showAdd(): void { this.activeTab = 'add'; this.error = ''; }
  load(): void {
    if (!this.definition) return;
    const key = this.definition.key;
    this.loading = true;
    this.error = '';
    this.api.listMasters(key).subscribe({
      next: rows => { if (this.definition?.key === key) { this.options = rows; this.error = ''; this.loaded = true; this.loading = false; } },
      error: () => { if (this.definition?.key === key) { this.error = `Could not load ${this.definition.label.toLowerCase()} values. Start the backend and check its database connection.`; this.loading = false; this.loaded = false; } }
    });
  }
  save(): void {
    if (!this.definition || !this.name.trim()) return;
    const request = this.editingId === null ? this.api.createMaster(this.definition.key, this.name.trim()) : this.api.updateMaster(this.definition.key, this.editingId, this.name.trim());
    request.subscribe({ next: () => { this.success = `${this.definition?.label} value saved.`; this.error = ''; this.reset(); this.load(); }, error: () => this.error = `Could not save this ${this.definition?.label.toLowerCase()} value. Names must be unique.` });
  }
  edit(option: MasterOption): void { this.activeTab = 'add'; this.editingId = option.id; this.name = option.name; this.success = ''; this.error = ''; }
  remove(option: MasterOption): void { if (!this.definition) return; this.api.deleteMaster(this.definition.key, option.id).subscribe({ next: () => { this.success = `${this.definition?.label} value deleted.`; this.load(); }, error: () => this.error = 'This value may already be used by a tender and cannot be deleted.' }); }
  reset(): void { this.name = ''; this.editingId = null; }
}
