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

  getToken():String | null{
    return localStorage.getItem("token");
  }

  isLoggedIn():boolean{
    const token = this.getToken();
    return !!token;
  }

  logout(): void{
    localStorage.removeItem('token');
  }


}
