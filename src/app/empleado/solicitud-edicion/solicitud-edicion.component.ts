import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { CambioHorarioInterface } from 'src/app/models/cambioHorario.interface';
import { CambioHorarioConsultaInterface } from 'src/app/models/cambioHorarioConsulta.interface';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-edicion',
  templateUrl: './solicitud-edicion.component.html',
  styleUrls: ['./solicitud-edicion.component.css']
})
export class SolicitudEdicionComponent {
  @ViewChild('form', { static: false }) form!: NgForm;
  cambioHorario: CambioHorarioConsultaInterface;
  idCambioHorario: number = 0;
  
  solicitudCambioHorario: CambioHorarioInterface = {};
  esAdmin = false;
  qrId = this.route.snapshot.paramMap.get('id');
  qrModel: QrModel | undefined;
  infoAllEmpleado: EmpleadoInterface[] = [];


  constructor(private route: ActivatedRoute,
    private cambioHorarioService: CambioHorarioService,
    private qrServices: QrServiceService,
    private empleadoInfo: EmpleadoService,
    private router: Router) {
    this.cambioHorario = {
      // ID DEL APROBADOR DEBE SER DE LA SESIÖN HACE FALTA
      idEmpleadoAprobador: 0,
      nombreEmpleadoSolicitante: '',
      nombreEmpleadoAprobador: '',
      nombreEmpleadoCambio: '',
      descripcion: '',
      estado: false
    };
    this.solicitudCambioHorario = {
      idEmpleadoSolicitante: Number(this.qrId),
      estado: null
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idCambioHorario = params['idCambioHorario'];
      if (this.idCambioHorario) {
        this.cambioHorarioService.getOnlySingleRecord(this.idCambioHorario).subscribe(
          (cambio: CambioHorarioConsultaInterface) => {
            this.cambioHorario = cambio;
            console.log('Cambio de horario:', this.cambioHorario);
          },
          error => {
            console.error('Error al obtener el cambio de horario:', error);
          }
        );
      }
    });

    this.getQrEmpleadoId(Number(this.qrId));
    this.getAllEmpleados();
  }

  getQrEmpleadoId(id: number): void {
    this.qrServices.getQrEmpleado(id)
      .subscribe(

        qr => {
          console.log("este es el qr", qr);
          this.qrModel = qr;
          if (this.qrModel && this.esAdmin) {
            this.cambioHorario.nombreEmpleadoAprobador = this.qrModel.nombreEmpleado;
            this.cambioHorario.idEmpleadoAprobador = this.qrModel.idEmpleado;
          }
        },
        err => {
          console.log(err);
        })
  }

  putSolicitud() {
    this.route.queryParams.subscribe(params => {
      const idCambioHorario = params['idCambioHorario'];
      this.cambioHorarioService.putResponseSolicitud(this.cambioHorario, idCambioHorario).subscribe(
        response => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: response.mensaje,
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/solicitudes/', this.qrId]);
        },
        error => {
          console.error('Error en la solicitud:', error);
        }
      )


    })
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

  submitForm() {

    Swal.fire({
      title: "Estas seguro de enviar la Solicitud ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No estoy seguro`
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Enviar!", "", "success");
        this.cambioHorarioService.postNewRequestSchedule(this.solicitudCambioHorario).subscribe(
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