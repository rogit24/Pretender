import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmDialogService);
  });

  it('opens confirmation dialog with default options and resolves true when confirmed', async () => {
    let result: boolean | undefined;
    const promise = service.confirm().then(res => (result = res));

    let state: any;
    service.dialogState$.subscribe(s => (state = s));

    expect(state.isOpen).toBe(true);
    expect(state.title).toBe('Delete Work?');
    expect(state.message).toBe('Are you sure?');
    expect(state.okText).toBe('Ok');
    expect(state.cancelText).toBe('Cancel');

    service.confirmAction();
    await promise;

    expect(result).toBe(true);
    expect(state.isOpen).toBe(false);
  });

  it('resolves false when canceled', async () => {
    let result: boolean | undefined;
    const promise = service.confirm({ title: 'Delete Tender?' }).then(res => (result = res));

    service.cancelAction();
    await promise;

    expect(result).toBe(false);
  });
});
