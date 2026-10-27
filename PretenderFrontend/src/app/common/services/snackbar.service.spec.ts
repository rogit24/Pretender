import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: SnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarService);
  });

  it('adds and dismisses an error snackbar', () => {
    service.showError('Road data could not be loaded.');
    let items: any[] = [];
    service.snackbars$.subscribe(val => (items = val));

    expect(items.length).toBe(1);
    expect(items[0].message).toBe('Road data could not be loaded.');
    expect(items[0].type).toBe('error');

    service.dismiss(items[0].id);
    expect(items.length).toBe(0);
  });

  it('adds and clears all snackbars', () => {
    service.showSuccess('Operation successful.');
    service.showInfo('Information note.');
    let items: any[] = [];
    service.snackbars$.subscribe(val => (items = val));

    expect(items.length).toBe(2);
    service.clearAll();
    expect(items.length).toBe(0);
  });
});
