import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { EmpleadoInterface } from '../models/empelado.interface';
import { ProyectosForEmployee } from '../models/proyectosEmpleado.interface';
import { MienbrosEquiposInterface } from '../models/mienbrosEquipos.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:8081/api/empleado';

  constructor(private http: HttpClient) { }

  getEmpleadoPorId(id: number):Observable<EmpleadoInterface>{
    const url = `${this.apiUrl}/data/${id}`;
    return this.http.get<EmpleadoInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  getAllEmpleados():Observable<EmpleadoInterface>{
    const url = `${this.apiUrl}s`;
    return this.http.get<EmpleadoInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  getProyectsForEmployee(id: number):Observable<ProyectosForEmployee>{
    const url = `${this.apiUrl}/proyectos/${id}`;
    return this.http.get<ProyectosForEmployee>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }))
  }

  getEquipoByIdEmployee(id: number):Observable<MienbrosEquiposInterface>{
    const url = `${this.apiUrl}/equipos/${id}`
    return this.http.get<MienbrosEquiposInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }))
  }

}
