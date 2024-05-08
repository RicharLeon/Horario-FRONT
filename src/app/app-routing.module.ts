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

const routes: Routes = [
  {path: 'menu/:id', component: MenuComponent},
  {path: 'menu-super', component: MenuSuperComponent},
  {path: 'inicio/:id', component: MenuGlobalComponent},
  {path: 'new-solicitud/:id', component: NewSolicitudComponent},
  {path: 'solicitudes/:id', component: SolicitudesComponent},
  {path: 'reportes', component: ReportesComponent},
  {path: 'cambio-horario', component: CambioHorarioComponent},
  {path: 'calendario', component: CalendarioComponent},
  {path: 'login', component: LoginComponent},
  {path: 'spinner', component: SpinnerComponent},
  {path: 'resonder-solicitud', component: ResponderCambioHorarioComponent},
  {path: 'ejemplo/:id', component: EjemploTablasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
