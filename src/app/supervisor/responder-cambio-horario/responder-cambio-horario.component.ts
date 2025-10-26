import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { CambioHorarioConsultaInterface } from 'src/app/models/cambioHorarioConsulta.interface';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responder-cambio-horario',
  templateUrl: './responder-cambio-horario.component.html',
  styleUrls: ['./responder-cambio-horario.component.css']
})
export class ResponderCambioHorarioComponent {
  @ViewChild('form', { static: false }) form!: NgForm;
  cambioHorario: CambioHorarioConsultaInterface;
  idCambioHorario: number = 0;
  idempleadoAprobador: number = 0;
 
  esAdmin = false;
  qrId: number | null = null; // ID del usuario en sesión
  qrModel: QrModel | undefined;

  constructor(private route: ActivatedRoute, 
    private cambioHorarioService: CambioHorarioService,
    private qrServices: QrServiceService,
    private router: Router,
    private authService: AuthService) {
    
    // Obtener el ID del usuario autenticado
    this.qrId = this.authService.getUserId();

    this.cambioHorario = {
      // ID DEL APROBADOR DEBE SER DE LA SESIÖN HACE FALTA
      idEmpleadoAprobador: this.qrId ?? 0,
      nombreEmpleadoSolicitante: '',
      nombreEmpleadoAprobador: '',
      nombreEmpleadoCambio: '',
      fechaSolicitud: new Date(),  
      descripcion: '',
      estado: false
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idCambioHorario = params['idCambioHorario'];
      if (this.idCambioHorario) {
        this.cambioHorarioService.getOnlySingleRecord(this.idCambioHorario).subscribe(
          (cambio: CambioHorarioConsultaInterface) => {
            this.cambioHorario = cambio;
            console.log('Cambio de horario:', this.cambioHorario);
            if (this.qrId) {
            this.cambioHorario.idEmpleadoAprobador = this.qrId;
          }
          },
          error => {
            console.error('Error al obtener el cambio de horario:', error);
          }
        );
      }
    });
    this.validateUserRole();
    
    console.log(this.esAdmin);
    this.getIdEmployeeAprobador(this.qrId || 0);

    if (this.qrId) {
      this.getQrEmpleadoId(this.qrId);
    }
    
  }

  getIdEmployeeAprobador(id: number): void {
    if(this.esAdmin) {
      this.idempleadoAprobador = id;
    }
  }

    validateUserRole() {
    // Obtener el rol directamente del token JWT usando AuthService
    const isAdmin = this.authService.isAdmin();
    const isSupervisor = this.authService.isSupervisor();
    const roles = this.authService.getUserRoles();

    console.log('Roles del usuario desde el token:', roles);
    console.log('¿Es Admin?:', isAdmin);
    console.log('¿Es Supervisor?:', isSupervisor);

    // Si es admin o supervisor, mostrar como administrador
    if (isAdmin || isSupervisor) {
      this.esAdmin = true;
    } else {
      this.esAdmin = false;
    }

    console.log('isAdministrator:', this.esAdmin);
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
          this.router.navigate(['/solicitudes', this.qrId]);
        },
        error => {
          console.error('Error en la solicitud:', error);
        }
      )
     

    })
  }

}
