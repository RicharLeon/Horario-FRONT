import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { CambioHorarioInterface } from '../models/cambioHorario.interface';
import { CambioHorarioConsultaInterface } from '../models/cambioHorarioConsulta.interface';

@Injectable({
  providedIn: 'root'
})
export class CambioHorarioService {

  private apiUrl = 'http://localhost:8081/api/cambio-horario';
  constructor(private http: HttpClient) { }

  postNewRequestSchedule(cambioHorario: CambioHorarioInterface):Observable<CambioHorarioInterface>{
    const url = `${this.apiUrl}`;
    return this.http.post<CambioHorarioInterface>(url, cambioHorario)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  getAllDataRequestSchedule():Observable<CambioHorarioConsultaInterface>{
    const url = `${this.apiUrl}`;
    return this.http.get<CambioHorarioConsultaInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  getChangeScheduleForIdEmployee(id: Number):Observable<CambioHorarioConsultaInterface>{
    const url = `${this.apiUrl}/empleado/ ${id}`;
    return this.http.get<CambioHorarioConsultaInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  getOnlySingleRecord(id: Number):Observable<CambioHorarioConsultaInterface>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<CambioHorarioConsultaInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }    




}
