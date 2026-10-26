import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './common/shared-module/shared.module';
@NgModule({ declarations: [AppComponent], imports: [BrowserModule, HttpClientModule, AppRoutingModule, SharedModule], bootstrap: [AppComponent] })
export class AppModule {}
