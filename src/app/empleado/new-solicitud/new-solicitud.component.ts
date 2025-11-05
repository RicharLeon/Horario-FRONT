import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { CambioHorarioInterface } from 'src/app/models/cambioHorario.interface';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';
import { AuthService } from 'src/app/services/auth.service';
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
  qrId: number | null = null; // ID del usuario en sesión
  isEditMode: boolean = false; // Indicador de modo edición
  idCambioHorario: number | null = null; // ID de la solicitud a editar

  constructor(private qrServices: QrServiceService,
    private empleadoInfo: EmpleadoService,
    private cambioHorario: CambioHorarioService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) {

    // Obtener el ID del usuario autenticado
    this.qrId = this.authService.getUserId();

    this.solicitudCambioHorario = {
      idEmpleadoSolicitante: this.qrId || 0,
      estado: null
    }
  }

  ngOnInit(): void {
    if (this.qrId) {
      this.getQrEmpleadoId(this.qrId);
      this.getIdEmpleadoInfo(this.qrId);
      this.getAllEmpleados();
      this.getProyectsForEmployee(this.qrId);
      this.getEquiposById(this.qrId);

      // Verificar si viene un ID de solicitud para editar
      this.route.queryParams.subscribe(params => {
        if (params['idCambioHorario']) {
          this.isEditMode = true;
          this.idCambioHorario = +params['idCambioHorario'];
          this.cargarSolicitudParaEditar(this.idCambioHorario);
        }
      });
    }
  }

  cargarSolicitudParaEditar(idCambioHorario: number): void {
    this.cambioHorario.getOnlySingleRecord(idCambioHorario).pipe(
      tap(solicitud => {
        console.log('Solicitud cargada para editar:', solicitud);
        // Extraer diaCambio de la descripción o usar un valor predeterminado
        let diaCambio = 'Seleccione un dia';

        // Mapear los datos de CambioHorarioConsultaInterface a CambioHorarioInterface
        this.solicitudCambioHorario = {
          idEmpleadoSolicitante: solicitud.idEmpleadoSolicitante,
          idEmpleadoCambio: solicitud.idEmpleadoCambio,
          diaCambio: diaCambio,
          descripcion: solicitud.descripcion,
          estado: solicitud.estado
        };

        // Si necesitas pre-cargar más información, agrégala aquí
        console.log('Solicitud mapeada:', this.solicitudCambioHorario);
      }),
      catchError(err => {
        console.error('Error al cargar la solicitud:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.mensaje || 'Ocurrió un error al procesar la solicitud'
        });

        return throwError(() => err);
      })
    ).subscribe();
  }

  extraerDiaDeCambio(descripcion: string): string {
    // Intenta extraer el día de la descripción si está en el formato esperado
    // Si no puede, devuelve una cadena vacía
    return '';
  }


  getQrEmpleadoId(id: number): void {
    this.qrServices.getQrEmpleado(id)
      .subscribe(

        qr => {
          console.log("este es el qr", qr);
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

  getEquiposById(id: number): void {
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



  submitForm() {
    this.solicitudCambioHorario.estado = null;

    const tituloModal = this.isEditMode ? 'actualizar' : 'enviar';
    const textoConfirmacion = this.isEditMode
      ? '¿Estás seguro de actualizar la Solicitud?'
      : '¿Estás seguro de enviar la Solicitud?';

    Swal.fire({
      title: textoConfirmacion,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Sí",
      denyButtonText: `No estoy seguro`
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.isEditMode && this.idCambioHorario) {
          // Actualizar solicitud existente
          this.cambioHorario.putResponseSolicitud(this.solicitudCambioHorario, this.idCambioHorario).subscribe(
            response => {
              console.log('Respuesta del servidor:', response);
              Swal.fire("¡Actualizado!", "La solicitud ha sido actualizada correctamente.", "success");
              this.form.resetForm();
              // Opcional: navegar de vuelta a la lista de solicitudes
              this.router.navigate(['/solicitudes', this.qrId]);
            },
            error => {
              console.error('Error en la solicitud:', error);

              const mensajeError = error?.error?.mensaje || "Ocurrió un error inesperado.";
              Swal.fire("Error", mensajeError, "error");
            }
          );
        } else {
          // Crear nueva solicitud
          this.cambioHorario.postNewRequestSchedule(this.solicitudCambioHorario).subscribe(
            response => {
              console.log('Respuesta del servidor:', response);
              Swal.fire("¡Enviado!", "La solicitud ha sido enviada correctamente.", "success");
              this.form.resetForm();
            },
            error => {
              console.error('Error en la solicitud:', error);

              const mensajeError = error?.error?.mensaje || "Ocurrió un error inesperado.";
              Swal.fire("Error", mensajeError, "error");
            }
          );
        }
      } else if (result.isDenied) {
        Swal.fire("Cambios no guardados", "", "info");
      }
    });
  }

}
