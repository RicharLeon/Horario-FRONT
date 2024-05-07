import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CambioHorarioConsultaInterface } from 'src/app/models/cambioHorarioConsulta.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responder-cambio-horario',
  templateUrl: './responder-cambio-horario.component.html',
  styleUrls: ['./responder-cambio-horario.component.css']
})
export class ResponderCambioHorarioComponent {
  @ViewChild('form', { static: false }) form!: NgForm;
  cambioHorario: CambioHorarioConsultaInterface;

  constructor(private route: ActivatedRoute, private cambioHorarioService: CambioHorarioService) {
    this.cambioHorario = {
      // ID DEL APROBADOR DEBE SER DE LA SESIÖN HACE FALTA
      idEmpleadoAprobador: 0,
      nombreEmpleadoSolicitante: '',
      nombreEmpleadoAprobador: '',
      nombreEmpleadoCambio: '',
      descripcion: '',
      estado: false
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idCambioHorario = params['idCambioHorario'];
      if (idCambioHorario) {
        this.cambioHorarioService.getOnlySingleRecord(idCambioHorario).subscribe(
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
        },
        error => {
          console.error('Error en la solicitud:', error);
        }
      )
     

    })
  }

}
