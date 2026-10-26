import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PretenderRoutingModule } from './pretender-routing.module';
import { MasterPageComponent } from './components/master-page.component';
import { TenderFormComponent } from './components/tender-form.component';
import { TenderListComponent } from './components/tender-list.component';
@NgModule({ declarations: [MasterPageComponent, TenderFormComponent, TenderListComponent], imports: [CommonModule, FormsModule, PretenderRoutingModule] })
export class PretenderModule {}