import { Component, OnInit } from '@angular/core';
import { PretenderApiService } from '../services/pretender-api.service';
@Component({ selector: 'app-tender-list', standalone: false, templateUrl: './tender-list.component.html', styleUrl: './tender-list.component.css' })
export class TenderListComponent implements OnInit {
  tenders: any[] = []; error = '';
  constructor(private readonly api: PretenderApiService) {}
  fileUrl(name: string): string { return this.api.fileUrl(name); }
  ngOnInit(): void { this.api.listTenders().subscribe({ next: rows => this.tenders = rows, error: () => this.error = 'Could not load tenders. Check the backend connection.' }); }
}