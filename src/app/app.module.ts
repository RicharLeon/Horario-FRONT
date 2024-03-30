import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './empleado/menu/menu.component';
import { MenuSuperComponent } from './supervisor/menu-super/menu-super.component';
import { HttpClientModule } from '@angular/common/http';
import { QrServiceService } from './services/qr-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MenuGlobalComponent } from './global/menu-global/menu-global.component';
import { FooterComponent } from './global/global/footer/footer.component';
import { HeaderComponent } from './global/global/header/header.component';
import { NewSolicitudComponent } from './empleado/new-solicitud/new-solicitud.component';
import { SolicitudesComponent } from './empleado/solicitudes/solicitudes.component';
import { ReportesComponent } from './supervisor/reportes/reportes.component';
import { CambioHorarioComponent } from './supervisor/cambio-horario/cambio-horario.component';
import { CalendarioComponent } from './empleado/calendario/calendario.component';
import { LoginComponent } from './auth/login/login.component';
import { FullCalendarModule } from '@fullcalendar/angular';
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuSuperComponent,
    MenuGlobalComponent,
    FooterComponent,
    HeaderComponent,
    NewSolicitudComponent,
    SolicitudesComponent,
    ReportesComponent,
    CambioHorarioComponent,
    CalendarioComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [QrServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
