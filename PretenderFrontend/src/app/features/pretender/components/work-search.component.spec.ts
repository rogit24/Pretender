import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PretenderModule } from '../pretender.module';
import { WorkSearchComponent } from './work-search.component';
import { PretenderApiService } from '../services/pretender-api.service';
import { SnackbarService } from '../../../common/services/snackbar.service';
import { ConfirmDialogService } from '../../../common/services/confirm-dialog.service';

describe('WorkSearchComponent (Search in sub works with 80% Dialog Table)', () => {
  let component: WorkSearchComponent;
  let fixture: ComponentFixture<WorkSearchComponent>;
  let mockApi: any;
  let mockSnackbar: any;
  let mockConfirmDialog: any;

  beforeEach(async () => {
    mockApi = {
      searchWorks: vi.fn().mockReturnValue(of([])),
      getWork: vi.fn().mockReturnValue(of(null)),
    };

    mockSnackbar = {
      showError: vi.fn(),
      showSuccess: vi.fn(),
      showWarning: vi.fn(),
      showInfo: vi.fn(),
    };

    mockConfirmDialog = {
      confirm: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [PretenderModule],
      providers: [
        { provide: PretenderApiService, useValue: mockApi },
        { provide: SnackbarService, useValue: mockSnackbar },
        { provide: ConfirmDialogService, useValue: mockConfirmDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes with slim search bar showing Search in sub works header', () => {
    expect(component.isExpanded).toBe(false);
    expect(component.isDialogOpen).toBe(false);
    const headerBar = fixture.nativeElement.querySelector('.subworks-header-bar');
    expect(headerBar).not.toBeNull();
    const title = fixture.nativeElement.querySelector('.bar-title');
    expect(title?.textContent?.trim()).toBe('Search in sub works');
    const content = fixture.nativeElement.querySelector('.subworks-content-body');
    expect(content).toBeNull();
  });

  it('expands when clicking search bar and renders all 16 search field items in the grid', async () => {
    component.toggleSearch();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isExpanded).toBe(true);
    const content = fixture.nativeElement.querySelector('.subworks-content-body');
    expect(content).not.toBeNull();

    // Verify all 16 search inputs exist
    expect(fixture.nativeElement.querySelector('#work-reg-num')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#work-name')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#sub-work-reg-num')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#sub-work-name')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#work-category')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#stipulated-start-date')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#stipulated-end-date')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#start-date')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#end-date')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#contractor-name')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#agreement-amt')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#gst-agreement-amt')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#asset-select')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#status-select')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#work-status-select')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#is-data-ported')).not.toBeNull();
  });

  it('performs search and opens the 80% screen modal dialog with WAMIS columns', async () => {
    component.toggleSearch();
    fixture.detectChanges();
    await fixture.whenStable();

    component.performSearch();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.isDialogOpen).toBe(true);
    expect(component.searchResults.length).toBeGreaterThan(0);

    const dialogBackdrop = fixture.nativeElement.querySelector('.subworks-dialog-backdrop');
    expect(dialogBackdrop).not.toBeNull();

    const dialogContainer = fixture.nativeElement.querySelector('.subworks-dialog-container');
    expect(dialogContainer).not.toBeNull();

    // Verify table columns exist matching Image 2
    const headers = Array.from(fixture.nativeElement.querySelectorAll('.wamis-table thead th')).map(
      (th: any) => th.textContent.trim()
    );
    expect(headers).toContain('Work Registration Number');
    expect(headers).toContain('Work Description');
    expect(headers).toContain('Work Type');
    expect(headers).toContain('Work Status');
    expect(headers).toContain('Work GIS Code');
    expect(headers).toContain('Budget Year');
    expect(headers).toContain('Status');
    expect(headers).toContain('Action');
    expect(headers).toContain('Close');
    expect(headers).toContain('Attachments');
    expect(headers).toContain('Sub Works');
    expect(headers).toContain('Overview');
    expect(headers).toContain('Audit Details');
  });

  it('selects a work from the table action and emits workSelected event', async () => {
    const emitSpy = vi.spyOn(component.workSelected, 'emit');

    component.toggleSearch();
    component.performSearch();
    fixture.detectChanges();
    await fixture.whenStable();

    const firstItem = component.searchResults[0];
    component.selectWork(firstItem);
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: firstItem.id,
        workNumber: firstItem.workRegistrationNumber,
      })
    );
    expect(component.selectedWorkId).toBe(firstItem.id);
    expect(component.isDialogOpen).toBe(false);
  });

  it('clears selection via confirmation dialog and emits workCleared event', async () => {
    const clearSpy = vi.spyOn(component.workCleared, 'emit');
    component.selectedWorkId = '2026080005';
    component.selectedWorkNumber = '2026080005';

    component.clearSelection();
    await fixture.whenStable();

    expect(mockConfirmDialog.confirm).toHaveBeenCalled();
    expect(component.selectedWorkId).toBeNull();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('filters by Work Registration Number correctly', () => {
    component.filters.workRegistrationNumber = '2026080005';
    component.performSearch();
    expect(component.searchResults.length).toBe(1);
    expect(component.searchResults[0].workRegistrationNumber).toBe('2026080005');
  });

  it('supports pagination with prev, next, first, last controls', () => {
    component.pageSize = 5;
    component.performSearch();
    expect(component.totalPages).toBeGreaterThan(1);
    expect(component.currentPage).toBe(1);

    component.goToNextPage();
    expect(component.currentPage).toBe(2);

    component.goToPrevPage();
    expect(component.currentPage).toBe(1);

    component.goToLastPage();
    expect(component.currentPage).toBe(component.totalPages);

    component.goToFirstPage();
    expect(component.currentPage).toBe(1);
  });
});
