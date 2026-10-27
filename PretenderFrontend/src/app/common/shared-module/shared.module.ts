import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkspaceShellComponent } from '../workspace-shell/workspace-shell.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [WorkspaceShellComponent, SnackbarComponent, ConfirmDialogComponent],
  imports: [CommonModule, RouterModule],
  exports: [WorkspaceShellComponent, SnackbarComponent, ConfirmDialogComponent, CommonModule, RouterModule]
})
export class SharedModule {}