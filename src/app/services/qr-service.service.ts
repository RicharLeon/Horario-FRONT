import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { QrModel } from '../models/qr.interface';

@Injectable({
  providedIn: 'root'
})
export class QrServiceService {
  private apiUrl = 'http://localhost:8081/api/codigoQr';


  constructor(private http: HttpClient) { }


  getQrEmpleado(id: number):Observable<QrModel>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<QrModel>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }

}
