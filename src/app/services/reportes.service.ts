import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ReportesInterface } from '../models/reportes.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = 'http://localhost:8081/api/reportes';


  constructor(private http: HttpClient) { }

  getAllReportes():Observable<ReportesInterface>{
    const url = `${this.apiUrl}`;
    return this.http.get<ReportesInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

  downloadReport(): Observable<Blob>{
    const url = `${this.apiUrl}/empleados`
    return this.http.get(url, {responseType: 'blob'});
  }

}
