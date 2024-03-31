import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { response } from 'express';
import { catchError, tap, throwError } from 'rxjs';
import { ReportesInterface } from 'src/app/models/reportes.interface';
import { ReportesService } from 'src/app/services/reportes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  esAdministrador: boolean = false;
  todosLosReportes: ReportesInterface[] = [];
  descargaEstaEnProceso = false;

  constructor(private route: ActivatedRoute,
    private reporteServices: ReportesService,
    private http: HttpClient) { }

  ngOnInit(): void {
    const qrId = this.route.snapshot.paramMap.get('id');
    this.getAllSolicitudes();

  }


  getAllSolicitudes(): void {
    this.reporteServices.getAllReportes().pipe(
      tap(info => {
        console.log(info, "datos reportes");
        if (Array.isArray(info)) {
          this.todosLosReportes = info;
        } else {
          this.todosLosReportes = [];
        }
        console.log(this.todosLosReportes, "todas las solicitudes");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();

  }

  mostrarDetalleReporte(reoprte: ReportesInterface) {
    const contenidoHTML = `
    <div style="display: flex;">
    <div style="width: 50%; padding-right: 20px;">
      <p><strong>ID:</strong> ${reoprte.idEmpleado}</p>
      <p><strong>Nombre:</strong> ${reoprte.nombre}</p>
      <p><strong>Area:</strong> ${reoprte.nombreArea}</p>
    </div>
    <div style="width: 50%;">
      <p><strong>Proyecto:</strong> ${reoprte.nombreProyecto}</p>
      <p><strong>Asistencia:</strong> ${reoprte.asistencia ? 'Si Asistió' : 'No Asistió'}</p>
      <p><strong>Fecha Asistencia:</strong> ${reoprte.fechaAsistencia}</p>
    </div>
  </div>
    `;

    Swal.fire({
      title: '<span class="">Información del cambio de horario</span>',
      html: `<div class="text-left">${contenidoHTML}</div>`,
      confirmButtonText: 'Cerrar',
      width: 'auto',
      customClass: {
        title: 'custom-title'
      }
    });
  }

  downloadReport() {
    const url = 'http://localhost:8081/api/reportes/empleados';

    // Realiza una solicitud GET para obtener el archivo
    this.http.get(url, { responseType: 'blob' }).subscribe((response: Blob) => {
      // Crea un objeto URL para el blob
      const blob = new Blob([response], { type: 'application/xlsx' }); // Cambia el tipo MIME según el tipo de archivo

      // Crea un enlace temporal y lo oculta
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'reporte.xlsx'; // Nombre del archivo a descargar

      // Simula un clic en el enlace para descargar el archivo
      link.click();

      // Limpia el enlace y el objeto URL
      window.URL.revokeObjectURL(link.href);
    });

  }

  downloadAllReports() {

    this.descargaEstaEnProceso = true;

    setTimeout(() => {
      this.reporteServices.downloadReport().subscribe((response: Blob) => {
      this.downloadOfFilesGeneral(response, "xlsx");

      this.descargaEstaEnProceso = false;
    });
    }, 1500);

    
  }


  downloadOfFilesGeneral(response: Blob, typeFile: String){
    const blob = new Blob([response], { type: `application/${typeFile}` });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte.${typeFile}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  }


}