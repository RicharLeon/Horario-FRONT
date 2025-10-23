import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { co } from '@fullcalendar/core/internal-common';
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

  constructor(
    private authServices: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  postLoginUser(): void {
    const loginInterface: LoginInterface = this.loginForm.value;
    this.authServices.postLoginUser(loginInterface).pipe(
      tap(info => {
        // Guardar el token directamente sin JSON.stringify si ya es un string
        const token = typeof info.token === 'string' ? info.token : JSON.stringify(info.token);
        localStorage.setItem('token', token);

        // Redirigir según el rol del usuario
        this.redirectByRole();
      }),
      catchError(err => {
        console.error(err);
        if (err.status === 401) {
          this.messageUserDoesNotExist(err.error.errorMessage);
        } else {
          this.messageErrNoControll(err.message);
        }
        return throwError(err);
      })
    ).subscribe();
  }

  redirectByRole(): void {
    const userId = this.authServices.getUserId();
    const roles = this.authServices.getUserRoles();
    const isAdmin = this.authServices.isAdmin();
    const isSupervisor = this.authServices.isSupervisor();
    
    console.log('🔐 Información de redirección:');
    console.log('User ID:', userId);
    console.log('Roles:', roles);
    console.log('Es Admin:', isAdmin);
    console.log('Es Supervisor:', isSupervisor);
    console.log('Es Empleado:', this.authServices.isEmpleado());
    console.log('Redirigiendo a: /inicio/' + userId);

    this.router.navigate(['/inicio', userId]);
  }

  getErrorUsername(control: any): string {
    if (control.errors?.required && control.touched) {
      return 'Este campo es requerido !!';
    } else if (control.value.length < 5 && control.touched) {
      return 'El nombre de usuario debe contener minimo 5 caracteres'
    }
    else return '';
  }

  getErrorPassword(control: any): string {
    if (control.errors?.required && control.touched) {
      return 'Este campo es requerido !!';
    }
    else return '';
  }

  messageUserDoesNotExist(mess: String) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `	${mess}`,
    });
  }

  messageErrNoControll(err: any) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Error no controlado! " + err,
    });
  }


}
