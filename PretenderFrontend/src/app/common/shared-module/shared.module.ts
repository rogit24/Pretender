import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkspaceShellComponent } from '../workspace-shell/workspace-shell.component';
@NgModule({ declarations: [WorkspaceShellComponent], imports: [CommonModule, RouterModule], exports: [WorkspaceShellComponent] })
export class SharedModule {}