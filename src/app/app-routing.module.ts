import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './empleado/menu/menu.component';
import { MenuSuperComponent } from './supervisor/menu-super/menu-super.component';

const routes: Routes = [
  {path: 'menu/:id', component: MenuComponent},
  {path: 'menu-super', component: MenuSuperComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
