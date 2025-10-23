import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupervisorGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && (this.authService.isSupervisor() || this.authService.isAdmin())) {
      return true;
    } else {
      // Si no es supervisor o admin, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
