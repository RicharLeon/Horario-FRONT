import { Injectable } from '@angular/core';
import { Router, Route, Routes } from '@angular/router';
import { MenuInterface } from '../models/menu.interface';
import { SolicitudesComponent } from '../empleado/solicitudes/solicitudes.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicRoutesService {

  constructor(private router: Router) { }


  addDynamicRoutes(menuGrupo: MenuInterface[], idEmpleado?: number): void {
    const dynamicRoutes: Routes = menuGrupo
      .filter(menu => !!menu.rutaMenuOpcion)
      .map(menu => {
        let path = this.cleanPath(menu.rutaMenuOpcion.toString());

        // 🔄 Reemplaza el placeholder ":id" por el valor real del empleado
        if (idEmpleado) {
          path = path.replace(':id', idEmpleado.toString());
        }

        return {
          path,
          component: this.getComponentForMenu(menu.claveMenuOpcion as string),
        };
      });

    const existingRoutes = this.router.config;
    const newRoutes = [...existingRoutes, ...dynamicRoutes];
    this.router.resetConfig(newRoutes);

    console.log('✅ Rutas dinámicas agregadas:', newRoutes);
  }

  /**
   * Limpia la ruta para quitar posibles "/" iniciales
   * (Angular no necesita que empiece con "/")
   */
  private cleanPath(ruta: string): string {
    return ruta.startsWith('/') ? ruta.substring(1) : ruta;
  }

  private getComponentForMenu(claveMenuOpcion: string): any {
    switch (claveMenuOpcion) {
      case 'solicitudes':
        return SolicitudesComponent;
      // 👉 puedes añadir más casos:
      // case 'usuarios': return UsuariosComponent;
      default:
        return null;
    }
  }
}

