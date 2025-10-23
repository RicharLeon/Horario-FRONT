import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterInterface } from '../models/register.interface';
import { Observable, catchError } from 'rxjs';
import { LoginInterface } from '../models/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth/';
  constructor(private http: HttpClient) { }

  postNewUser(registerUser: RegisterInterface):Observable<RegisterInterface>{
    const url = `${this.apiUrl}register`;
    return this.http.post<RegisterInterface>(url, registerUser)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  postLoginUser(loginUser: LoginInterface):Observable<LoginInterface>{
    const url = `${this.apiUrl}login`;
    return this.http.post<LoginInterface>(url, loginUser)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  getToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    // Si el token está envuelto en comillas (JSON stringified), removerlas
    try {
      const parsed = JSON.parse(token);
      return typeof parsed === 'string' ? parsed : token;
    } catch {
      return token;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verificar si el token ha expirado
    const decodedToken = this.decodeToken();
    if (!decodedToken) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp > currentTime;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  // Decodificar el token JWT
  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Obtener los roles del usuario
  getUserRoles(): string[] {
    const decodedToken = this.decodeToken();
    return decodedToken?.authorities || [];
  }

  // Obtener el ID del usuario
  getUserId(): number | null {
    const decodedToken = this.decodeToken();
    return decodedToken?.usuario_id || null;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('ADMIN');
  }

  // Verificar si el usuario es supervisor
  isSupervisor(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('SUPERVISOR') || roles.includes('SUPER');
  }

  // Verificar si el usuario es empleado (si no es admin ni supervisor, es empleado)
  isEmpleado(): boolean {
    const roles = this.getUserRoles();
    // Es empleado si tiene rol EMPLEADO o USER, o si no es admin ni supervisor
    return roles.includes('EMPLEADO') || 
           roles.includes('USER') || 
           (!this.isAdmin() && !this.isSupervisor() && roles.length > 0);
  }


}
