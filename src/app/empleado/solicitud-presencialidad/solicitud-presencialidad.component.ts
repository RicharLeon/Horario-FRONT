import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AsistenciaCreateInterface } from 'src/app/models/asistencia.interface';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-presencialidad',
  templateUrl: './solicitud-presencialidad.component.html',
  styleUrls: ['./solicitud-presencialidad.component.css']
})
export class SolicitudPresencialidadComponent implements OnInit {
  @ViewChild('form', { static: false }) form!: NgForm;

  qrModel: QrModel | undefined;
  infoEmpleado: EmpleadoInterface | undefined;
  qrId: number | null = null;
  puestosDisponibles: number = 0;
  cargandoPuestos: boolean = false;

  solicitudAsistencia: AsistenciaCreateInterface = {
    idEmpleado: 0,
    fechaAsistencia: '',
    estadoAsistencia: 'CREADO-POR-EL-USUARIO'
  };

  // Fecha mínima (hoy)
  fechaMinima: string = '';

  constructor(
    private asistenciaService: AsistenciaService,
    private qrServices: QrServiceService,
    private empleadoInfo: EmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Obtener el ID del usuario autenticado
    this.qrId = this.authService.getUserId();
    this.solicitudAsistencia.idEmpleado = this.qrId || 0;

    // Establecer fecha mínima (hoy)
    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    if (this.qrId) {
      this.getQrEmpleadoId(this.qrId);
      this.getIdEmpleadoInfo(this.qrId);
    }
  }

  getQrEmpleadoId(id: number): void {
    this.qrServices.getQrEmpleado(id).subscribe(
      qr => {
        console.log("QR del empleado:", qr);
        this.qrModel = qr;
      },
      err => {
        console.error('Error al obtener QR:', err);
      }
    );
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

  onFechaChange(fecha: string): void {
    if (fecha) {
      this.consultarPuestosDisponibles(fecha);
      console.log('Fecha seleccionada RRRRRR:', fecha);
    }
  }

  consultarPuestosDisponibles(fecha: string): void {
    this.cargandoPuestos = true;
    // Convertir fecha a formato ISO DateTime (agregar hora)
    const fechaDateTime = `${fecha}`;

    this.asistenciaService.getAvailablePositions(fechaDateTime).pipe(
      tap(disponibles => {
        this.puestosDisponibles = disponibles;
        console.log('Puestos disponibles:', disponibles);

        if (disponibles === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Sin disponibilidad',
            text: 'No hay puestos disponibles para esta fecha',
            confirmButtonText: 'Entendido'
          });
        }
      }),
      catchError(err => {
        console.error('Error al consultar puestos disponibles:', err);
        this.puestosDisponibles = 0;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo consultar la disponibilidad de puestos'
        });
        return throwError(err);
      })
    ).subscribe(() => {
      this.cargandoPuestos = false;
    });
  }

  submitForm(): void {
    if (!this.solicitudAsistencia.fechaAsistencia) {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Por favor seleccione una fecha'
      });
      return;
    }

    if (this.puestosDisponibles === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sin disponibilidad',
        text: 'No hay puestos disponibles para la fecha seleccionada'
      });
      return;
    }

    Swal.fire({
      title: '¿Estás seguro de solicitar asistencia presencial?',
      html: `<p>Fecha: <strong>${this.formatearFecha(this.solicitudAsistencia.fechaAsistencia)}</strong></p>
             <p>Puestos disponibles: <strong>${this.puestosDisponibles}</strong></p>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, solicitar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearAsistencia();
      }
    });
  }

  crearAsistencia(): void {
    // Convertir fecha a formato ISO DateTime
    const fechaDateTime = `${this.solicitudAsistencia.fechaAsistencia}T08:00:00`;

    const asistenciaAEnviar: AsistenciaCreateInterface = {
      idEmpleado: this.solicitudAsistencia.idEmpleado,
      fechaAsistencia: fechaDateTime,
      estadoAsistencia: 'CREADO-POR-EL-USUARIO'
    };

    this.asistenciaService.createAssistance(asistenciaAEnviar).subscribe(
      response => {
        console.log('Asistencia creada:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Solicitud creada!',
          text: 'Tu solicitud de asistencia presencial ha sido registrada',
          confirmButtonText: 'Ver mis solicitudes'
        }).then(() => {
          // Navegar a la lista de asistencias
          this.router.navigate(['/lista-asistencias', this.qrId]);
        });
        this.form.resetForm();
        this.puestosDisponibles = 0;
      },
      error => {
        console.error('Error al crear asistencia:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.mensaje || 'No se pudo crear la solicitud de asistencia'
        });
      }

    );
  }



  formatearFecha(fecha: string | Date): string {
    const date = new Date(fecha); // convierte string o Date a Date
    const fechaLocal = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

    return fechaLocal.toLocaleDateString('es-ES', {
      weekday: 'long',   // día de la semana
      year: 'numeric',   // año
      month: 'long',     // mes
      day: 'numeric'     // día del mes
    });
  }




  verMisAsistencias(): void {
    this.router.navigate(['/lista-asistencias', this.qrId]);
  }
}
