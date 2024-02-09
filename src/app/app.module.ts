import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './empleado/menu/menu.component';
import { MenuSuperComponent } from './supervisor/menu-super/menu-super.component';
import { HttpClientModule } from '@angular/common/http';
import { QrServiceService } from './services/qr-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuSuperComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [QrServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
