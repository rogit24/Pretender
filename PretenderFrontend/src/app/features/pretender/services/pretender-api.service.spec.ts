import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigurationService } from '../../../app-configuration.service';
import { PretenderApiService } from './pretender-api.service';

describe('PretenderApiService parent-work lookup', () => {
  let api: PretenderApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: AppConfigurationService, useValue: { apiBaseUrl: '/api' } },
      ],
    });
    api = TestBed.inject(PretenderApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the available works for the parent-work dropdown', () => {
    let count = 0;
    api.listWorks().subscribe(rows => count = rows.length);
    const request = http.expectOne('/api/works');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 'mock-work-1001', workNumber: 'MOCK-WORK-1001', description: 'Sample road', source: 'DEVELOPMENT MOCK — NOT WAMIS CORE', mock: true }]);
    expect(count).toBe(1);
  });

  it('searches the local works API and returns the clearly marked mock result', () => {
    let result: unknown;
    api.searchWorks('bridge').subscribe(value => result = value);
    const request = http.expectOne('/api/works/search?q=bridge');
    expect(request.request.method).toBe('GET');
    request.flush([{ id: 'mock-work-1002', workNumber: 'MOCK-WORK-1002', description: 'Bridge mock', source: 'DEVELOPMENT MOCK — NOT WAMIS CORE', mock: true }]);
    expect(result).toEqual([expect.objectContaining({ id: 'mock-work-1002', mock: true })]);
  });

  it('surfaces lookup errors from the backend', () => {
    let message = '';
    api.getWork('missing-id').subscribe({ error: error => message = error.message });
    http.expectOne('/api/works/missing-id').flush({ error: 'Work missing-id was not found' }, { status: 404, statusText: 'Not Found' });
    expect(message).toContain('404');
  });
});
