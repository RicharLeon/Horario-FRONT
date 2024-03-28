import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './empleado/menu/menu.component';
import { MenuSuperComponent } from './supervisor/menu-super/menu-super.component';
import { MenuGlobalComponent } from './global/menu-global/menu-global.component';
import { NewSolicitudComponent } from './empleado/new-solicitud/new-solicitud.component';

const routes: Routes = [
  {path: 'menu/:id', component: MenuComponent},
  {path: 'menu-super', component: MenuSuperComponent},
  {
    path: 'global', component: MenuGlobalComponent
  },
  {
    path: 'new-solicitud', component: NewSolicitudComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
