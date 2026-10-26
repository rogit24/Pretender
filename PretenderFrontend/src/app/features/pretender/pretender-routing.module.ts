import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterPageComponent } from './components/master-page.component';
import { TenderFormComponent } from './components/tender-form.component';
import { TenderListComponent } from './components/tender-list.component';
const masterRoutes: Routes = [
  { path: 'masters/tender-type', component: MasterPageComponent, data: { masterKey: 'tender-type' } },
  { path: 'masters/number-of-covers', component: MasterPageComponent, data: { masterKey: 'number-of-covers' } },
  { path: 'masters/tender-category', component: MasterPageComponent, data: { masterKey: 'tender-category' } },
  { path: 'masters/work-item-product-category', component: MasterPageComponent, data: { masterKey: 'work-item-product-category' } },
  { path: 'masters/number-of-bid-openers', component: MasterPageComponent, data: { masterKey: 'number-of-bid-openers' } },
  { path: 'masters/form-of-contract', component: MasterPageComponent, data: { masterKey: 'form-of-contract' } },
  { path: 'masters/tenderer-class', component: MasterPageComponent, data: { masterKey: 'tenderer-class' } },
];
const routes: Routes = [
  { path: 'tenders/new', component: TenderFormComponent },
  { path: 'tenders', component: TenderListComponent },
  ...masterRoutes,
  { path: '', redirectTo: 'tenders/new', pathMatch: 'full' },
];
@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class PretenderRoutingModule {}