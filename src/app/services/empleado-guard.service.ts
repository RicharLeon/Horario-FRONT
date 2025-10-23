import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    // Admin y Supervisor tienen acceso a todo
    if (this.authService.isLoggedIn() && 
        (this.authService.isAdmin() || this.authService.isSupervisor() || this.authService.isEmpleado())) {
      return true;
    } else {
      // Si no está logueado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
