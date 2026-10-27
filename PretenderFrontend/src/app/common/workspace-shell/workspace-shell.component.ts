import { Component } from '@angular/core';
@Component({ selector: 'app-workspace-shell', standalone: false, templateUrl: './workspace-shell.component.html' })
export class WorkspaceShellComponent {
  activeModule = '';
  mastersOpen = false;
  pretenderMenuOpen = false;
  toggleModule(name: string): void {
    if (this.activeModule === name) { this.activeModule = ''; return; }
    this.activeModule = name;
    this.mastersOpen = false;
    this.pretenderMenuOpen = false;
  }
  toggleMasters(): void { this.mastersOpen = !this.mastersOpen; }
  togglePretenderMenu(): void { this.pretenderMenuOpen = !this.pretenderMenuOpen; }
}