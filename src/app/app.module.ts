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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MenuGlobalComponent } from './global/menu-global/menu-global.component';
import { FooterComponent } from './global/global/footer/footer.component';
import { HeaderComponent } from './global/global/header/header.component';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuSuperComponent,
    MenuGlobalComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [QrServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
