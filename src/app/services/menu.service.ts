import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { MenuInterface } from '../models/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:8081/api/menu';

  constructor(private http: HttpClient) { }

  getMenuPorGrupo(grupo: String):Observable<MenuInterface>{
    const url = `${this.apiUrl}/${grupo}`;
    return this.http.get<MenuInterface>(url)
    .pipe(catchError(err => {
      console.error(err);
      throw err;
    }));
  }
 
}
