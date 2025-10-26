import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './empleado/menu/menu.component';
import { MenuSuperComponent } from './supervisor/menu-super/menu-super.component';
import { MenuGlobalComponent } from './global/menu-global/menu-global.component';
import { NewSolicitudComponent } from './empleado/new-solicitud/new-solicitud.component';
import { SolicitudesComponent } from './empleado/solicitudes/solicitudes.component';
import { ReportesComponent } from './supervisor/reportes/reportes.component';
import { CambioHorarioComponent } from './supervisor/cambio-horario/cambio-horario.component';
import { CalendarioComponent } from './empleado/calendario/calendario.component';
import { LoginComponent } from './auth/login/login.component';
import { SpinnerComponent } from './global/global/spinner/spinner.component';
import { ResponderCambioHorarioComponent } from './supervisor/responder-cambio-horario/responder-cambio-horario.component';
import { EjemploTablasComponent } from './empleado/ejemplo-tablas/ejemplo-tablas.component';
import { SolicitudEdicionComponent } from './empleado/solicitud-edicion/solicitud-edicion.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { SupervisorGuardService } from './services/supervisor-guard.service';
import { EmpleadoGuardService } from './services/empleado-guard.service';

const routes: Routes = [
  // Ruta principal para Admin/Supervisor (MenuGlobalComponent)
  {path: 'inicio/:id', component: MenuGlobalComponent, canActivate: [EmpleadoGuardService]},
  
  // Rutas de empleados (protegidas con EmpleadoGuardService)
  {path: 'menu/:id', component: MenuComponent, canActivate: [EmpleadoGuardService]},
  {path: 'new-solicitud/:id', component: NewSolicitudComponent, canActivate: [EmpleadoGuardService]},
  {path: 'solicitudes/:id', component: SolicitudesComponent, canActivate: [EmpleadoGuardService]},
  {path: 'calendario', component: CalendarioComponent, canActivate: [EmpleadoGuardService]},
  {path: 'ejemplo/:id', component: EjemploTablasComponent, canActivate: [EmpleadoGuardService]},
  {path: 'solicitud-edicion/:id', component: SolicitudEdicionComponent, canActivate: [EmpleadoGuardService]},
  
  // Rutas de supervisor/admin (protegidas con SupervisorGuardService que permite SUPERVISOR y ADMIN)
  {path: 'menu-super', component: MenuSuperComponent, canActivate: [SupervisorGuardService]},
  {path: 'reportes', component: ReportesComponent, canActivate: [SupervisorGuardService]},
  {path: 'cambio-horario', component: CambioHorarioComponent, canActivate: [SupervisorGuardService]},
  {path: 'resonder-solicitud/:id', component: ResponderCambioHorarioComponent, canActivate: [EmpleadoGuardService]},
  
  // Rutas generales (protegidas con AuthGuardService básico)
  {path: 'spinner', component: SpinnerComponent, canActivate: [AuthGuardService]},
  
  // Ruta pública
  {path: 'login', component: LoginComponent},
  
  // Redirección por defecto
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
