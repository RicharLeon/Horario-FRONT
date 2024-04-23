import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { LoginInterface } from 'src/app/models/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });

  constructor(private authServices: AuthService, private route: ActivatedRoute) {
   }

  ngOnInit(): void {
  }

  postLoginUser(): void {
    const loginInterface: LoginInterface = this.loginForm.value; 
    this.authServices.postLoginUser(loginInterface).pipe(
      tap(info => {
        localStorage.setItem('tokenpapues', JSON.stringify(info.token));
      }),
      catchError(err => {
        console.error(err);     
        if (err.status === 401) {
          this.messageUserDoesNotExist();
        } else {
          this.messageErrNoControll(err.message);
          console.error('Error en la solicitud:', err.message);
        }
        return throwError(err);
      })
    ).subscribe();
  }

  getErrorUsername(control: any): string {
    if (control.errors?.required && control.touched){
      return 'Este campo es requerido !!';
    }else if(control.value.length < 5 && control.touched){
      return 'El nombre de usuario debe contener minimo 5 caracteres'
    }    
    else return '';
  }

  getErrorPassword(control: any): string {
    if (control.errors?.required && control.touched){
      return 'Este campo es requerido !!';
    }
    else return '';
  }

  messageUserDoesNotExist(){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "El usuario no existe!",
    });
  }

  messageErrNoControll(err: any){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error no controlado!"+err,
    });
  }


}
