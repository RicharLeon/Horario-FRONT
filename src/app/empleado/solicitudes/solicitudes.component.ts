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
import { CambioHorarioConsultaInterface } from 'src/app/models/cambioHorarioConsulta.interface';
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent {
  @ViewChild('form', { static: false }) form!: NgForm;

  qrModel: QrModel | undefined;

  infoEmpleado: EmpleadoInterface | undefined;
  esAdministrador: boolean = false;
  cambioHorarioConsulta: CambioHorarioConsultaInterface[] = [];
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


     
      this.getAllSolicitudes();
    
  }

  getAllSolicitudes(): void {
    this.cambioHorario.getAllDataRequestSchedule().pipe(
      tap(info => {
        console.log(info, "datos solicitud");
        if (Array.isArray(info)) {
          this.cambioHorarioConsulta = info;
        } else {
          this.cambioHorarioConsulta = [];
        }
        console.log(this.cambioHorarioConsulta, "todas las solicitudes");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();

  }


  mostrarDetalleUsuario(usuario: CambioHorarioConsultaInterface) {
    const contenidoHTML = `
    <div style="display: flex;">
    <div style="width: 50%; padding-right: 20px;">
      <p><strong>ID:</strong> ${usuario.idCambioHorario}</p>
      <p><strong>Solicitante:</strong> ${usuario.nombreEmpleadoSolicitante}</p>
      <p><strong>Aprobador:</strong> ${usuario.nombreEmpleadoAprobador}</p>
    </div>
    <div style="width: 50%;">
      <p><strong>Empleado Cambio:</strong> ${usuario.nombreEmpleadoCambio}</p>
      <p><strong>Estado:</strong> ${usuario.estado ? 'Aprobado' : 'Pendiente'}</p>
      <p><strong>Descripción:</strong> ${usuario.descripcion}</p>
    </div>
  </div>
    `;
  
    Swal.fire({
      title: '<span class="">Información del cambio de horario</span>',
      html: `<div class="text-left">${contenidoHTML}</div>`,
      icon: 'info',
      iconHtml: '<i class="fas fa-info-circle" style="font-size: 20px;"></i>', 
      confirmButtonText: 'Cerrar',
      width: 'auto',
      customClass: {
        title: 'custom-title'
      }
    });

  }


}
