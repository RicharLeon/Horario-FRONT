import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './empleado/menu/menu.component';
import { MenuSuperComponent } from './supervisor/menu-super/menu-super.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { SpinnerComponent } from './global/global/spinner/spinner.component';
import { NgIconsModule } from '@ng-icons/core';
import { featherAirplay } from '@ng-icons/feather-icons';
import {  heroChevronDoubleLeft, heroUsers } from '@ng-icons/heroicons/outline';
import { ionIceCream } from '@ng-icons/ionicons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { ResponderCambioHorarioComponent } from './supervisor/responder-cambio-horario/responder-cambio-horario.component';
import { NgxPaginationModule  } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { EjemploTablasComponent } from './empleado/ejemplo-tablas/ejemplo-tablas.component';
import { SolicitudEdicionComponent } from './empleado/solicitud-edicion/solicitud-edicion.component';

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
    LoginComponent,
    SpinnerComponent,
    ResponderCambioHorarioComponent,
    EjemploTablasComponent,
    SolicitudEdicionComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    NgIconsModule.withIcons({ featherAirplay, heroUsers, heroChevronDoubleLeft }),
    MatIconModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    NgxDatatableModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [QrServiceService,
    SolicitudesComponent
 //   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
