import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'pretender/tenders/new', pathMatch: 'full' },
  { path: 'pretender', loadChildren: () => import('./features/pretender/pretender.module').then(m => m.PretenderModule) },
  { path: '**', redirectTo: 'pretender/tenders/new' },
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}