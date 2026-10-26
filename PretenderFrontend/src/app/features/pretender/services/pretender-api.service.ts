import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigurationService } from '../../../app-configuration.service';
import { MasterOption, TenderDraft } from '../models/pretender.model';
@Injectable({ providedIn: 'root' })
export class PretenderApiService {
  private readonly api: string;
  constructor(private readonly http: HttpClient, config: AppConfigurationService) { this.api = config.apiBaseUrl; }
  listMasters(key: string): Observable<MasterOption[]> { return this.http.get<MasterOption[]>(`${this.api}/masters/${key}`); }
  createMaster(key: string, name: string): Observable<MasterOption> { return this.http.post<MasterOption>(`${this.api}/masters/${key}`, { name }); }
  updateMaster(key: string, id: number, name: string): Observable<MasterOption> { return this.http.put<MasterOption>(`${this.api}/masters/${key}/${id}`, { name }); }
  deleteMaster(key: string, id: number): Observable<void> { return this.http.delete<void>(`${this.api}/masters/${key}/${id}`); }
  uploadFile(file: File): Observable<{fileName:string; originalName:string}> { const data = new FormData(); data.append('file', file); return this.http.post<{fileName:string; originalName:string}>(`${this.api}/files`, data); }
  saveTender(tender: TenderDraft): Observable<{id:number}> { return this.http.post<{id:number}>(`${this.api}/tenders`, tender); }
  listTenders(): Observable<any[]> { return this.http.get<any[]>(`${this.api}/tenders`); }
  fileUrl(fileName: string): string { return `${this.api}/files/${encodeURIComponent(fileName)}`; }
}
