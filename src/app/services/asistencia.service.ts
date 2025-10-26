import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AsistenciaInterface, AsistenciaCreateInterface } from '../models/asistencia.interface';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'http://localhost:8081/api/assistance';
  
  constructor(private http: HttpClient) { }

  // Obtener puestos disponibles para una fecha específica
  getAvailablePositions(date: string): Observable<number> {
    const url = `${this.apiUrl}/${date}`;
    return this.http.get<number>(url)
      .pipe(catchError(err => {
        console.error('Error al obtener puestos disponibles:', err);
        throw err;
      }));
  }

  // Crear una nueva asistencia
  createAssistance(asistencia: AsistenciaCreateInterface): Observable<AsistenciaInterface> {
    const url = `${this.apiUrl}`;
    return this.http.post<AsistenciaInterface>(url, asistencia)
      .pipe(catchError(err => {
        console.error('Error al crear asistencia:', err);
        throw err;
      }));
  }

  // Obtener todas las asistencias de un empleado
  getAllAssistancesByEmployee(employeeId: Number): Observable<AsistenciaInterface[]> {
    const url = `${this.apiUrl}/foremployee/${employeeId}`;
    return this.http.get<AsistenciaInterface[]>(url)
      .pipe(catchError(err => {
        console.error('Error al obtener asistencias del empleado:', err);
        throw err;
      }));
  }
}
