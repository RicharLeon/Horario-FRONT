import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { CambioHorarioInterface } from '../models/cambioHorario.interface';

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
}
