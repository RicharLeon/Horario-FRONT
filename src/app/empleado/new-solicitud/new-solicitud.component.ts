import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { CambioHorarioInterface } from 'src/app/models/cambioHorario.interface';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { ProyectosForEmployee } from 'src/app/models/proyectosEmpleado.interface';
import { MienbrosEquiposInterface } from 'src/app/models/mienbrosEquipos.interface';

@Component({
  selector: 'app-new-solicitud',
  templateUrl: './new-solicitud.component.html',
  styleUrls: ['./new-solicitud.component.css']
})
export class NewSolicitudComponent {
  @ViewChild('form', { static: false }) form!: NgForm;

qrModel: QrModel | undefined;

infoEmpleado: EmpleadoInterface | undefined;

infoAllEmpleado: EmpleadoInterface[] = [];
proyectsForEmployee: ProyectosForEmployee[] = [];
mienbrosEquipo: MienbrosEquiposInterface[] = [];
selectedEmpleado: EmpleadoInterface | null = null;
solicitudCambioHorario: CambioHorarioInterface = {};

  constructor(private qrServices: QrServiceService, 
    private empleadoInfo: EmpleadoService,
    private cambioHorario: CambioHorarioService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const qrId = this.route.snapshot.paramMap.get('id');

    if(qrId) {
      this.getQrEmpleadoId(Number(qrId));
      this.getIdEmpleadoInfo(Number(qrId));
      this.getAllEmpleados();
      this.getProyectsForEmployee(Number(qrId));
      this.getEquiposById(Number(qrId));
    }
  }


  getQrEmpleadoId(id: number): void{
    this.qrServices.getQrEmpleado(id)
    .subscribe(
      
      qr => {
        console.log(qr);
      this.qrModel = qr;
    },
    err => {
      console.log(err);
    })
  }

  getIdEmpleadoInfo(id: number): void {
    this.empleadoInfo.getEmpleadoPorId(id).pipe(
      tap(info => {
        console.log(info, "datos empleado");
        this.infoEmpleado = info;
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();
  }

  getProyectsForEmployee(id: number): void {
    this.empleadoInfo.getProyectsForEmployee(id).pipe(
      tap(info => {
        console.log(info, "datos proyectos");
        if (Array.isArray(info)) {
          this.proyectsForEmployee = info;
        } else {
          this.proyectsForEmployee = [];
        }
        console.log(this.proyectsForEmployee, "todos los [proyectos]");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();
  }

  getEquiposById(id: number):void {
    this.empleadoInfo.getEquipoByIdEmployee(id).pipe(
      tap(info => {
        console.log(info, "datos equipos del equipo");
        if (Array.isArray(info)) {
          this.mienbrosEquipo = info;
        } else {
          this.mienbrosEquipo = [];
        }
        console.log(this.mienbrosEquipo, "todos los [mienbros del equipo]");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();
  }

  getAllEmpleados(): void {
    this.empleadoInfo.getAllEmpleados().pipe(
      tap(info => {
        console.log(info, "datos empleado");
        if (Array.isArray(info)) {
          this.infoAllEmpleado = info;
        } else {
          this.infoAllEmpleado = [];
        }
        console.log(this.infoAllEmpleado, "todos los empleados");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();
  }



  submitForm(){

    Swal.fire({
      title: "Estas seguro de enviar la Solicitud ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No estoy seguro`
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Enviar!", "", "success");
        this.cambioHorario.postNewRequestSchedule(this.solicitudCambioHorario).subscribe(
          response => {
            console.log('Respuesta del servidor:', response);
            this.form.resetForm(); 
          },
          error => {
            console.error('Error en la solicitud:', error);
          }
        )
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    });

    
    


  }

}
