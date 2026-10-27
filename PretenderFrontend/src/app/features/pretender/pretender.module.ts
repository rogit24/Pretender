import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../common/shared-module/shared.module';
import { PretenderRoutingModule } from './pretender-routing.module';
import { MasterPageComponent } from './components/master-page.component';
import { TenderFormComponent } from './components/tender-form.component';
import { TenderListComponent } from './components/tender-list.component';
import { WorkSearchComponent } from './components/work-search.component';

@NgModule({
  declarations: [MasterPageComponent, TenderFormComponent, TenderListComponent, WorkSearchComponent],
  imports: [CommonModule, FormsModule, SharedModule, PretenderRoutingModule],
  exports: [WorkSearchComponent]
})
export class PretenderModule {}