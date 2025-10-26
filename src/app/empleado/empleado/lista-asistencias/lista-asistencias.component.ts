import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AsistenciaInterface } from 'src/app/models/asistencia.interface';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-asistencias',
  templateUrl: './lista-asistencias.component.html',
  styleUrls: ['./lista-asistencias.component.css']
})
export class ListaAsistenciasComponent implements OnInit {

  displayedColumns: string[] = [
    'ID',
    'Fecha Asistencia',
    'Fecha Actualización',
    'Estado',
    'Acciones'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) matsort!: MatSort;

  dataSource: MatTableDataSource<AsistenciaInterface> = new MatTableDataSource<AsistenciaInterface>();
  asistencias: AsistenciaInterface[] = [];
  qrId: number | null = null;
  cargando: boolean = false;

  constructor(
    private asistenciaService: AsistenciaService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.qrId = this.authService.getUserId();
    
    if (this.qrId) {
      this.cargarAsistencias();
    } else {
      console.error('No se pudo obtener el ID del usuario');
      this.router.navigate(['/login']);
    }
  }

  cargarAsistencias(): void {
    if (!this.qrId) return;
    
    this.cargando = true;
    this.asistenciaService.getAllAssistancesByEmployee(this.qrId).pipe(
      tap(asistencias => {
        console.log('Asistencias cargadas:', asistencias);
        if (Array.isArray(asistencias)) {
          this.asistencias = asistencias;
          this.dataSource = new MatTableDataSource<AsistenciaInterface>(this.asistencias);
          
          // Configurar paginador y ordenamiento después de cargar los datos
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.matsort) {
            this.dataSource.sort = this.matsort;
          }
        } else {
          this.asistencias = [];
        }
        this.cargando = false;
      }),
      catchError(err => {
        console.error('Error al cargar asistencias:', err);
        this.cargando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las asistencias'
        });
        return throwError(err);
      })
    ).subscribe();
  }

  verDetalle(asistencia: AsistenciaInterface): void {
    const contenidoHTML = `
      <div style="text-align: left; padding: 10px;">
        <p><strong>ID:</strong> ${asistencia.idAsistencia}</p>
        <p><strong>Fecha de Asistencia:</strong> ${this.formatearFecha(asistencia.fechaAsistencia)}</p>
        <p><strong>Fecha de Actualización:</strong> ${this.formatearFecha(asistencia.fechaActualizacion)}</p>
        <p><strong>Estado:</strong> <span class="badge ${this.getEstadoClass(asistencia.estadoAsistencia?.toString() || '')}">${asistencia.estadoAsistencia}</span></p>
      </div>
    `;

    Swal.fire({
      title: '<span>Detalle de Asistencia Presencial</span>',
      html: contenidoHTML,
      confirmButtonText: 'Cerrar',
      width: 'auto'
    });
  }

  formatearFecha(fecha: any): string {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'CREADO-POR-EL-USUARIO':
        return 'bg-info';
      case 'APROBADO':
        return 'bg-success';
      case 'RECHAZADO':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getEstadoBadgeClass(estado: string | undefined): string {
    if (!estado) return 'badge bg-secondary';
    
    switch (estado) {
      case 'CREADO-POR-EL-USUARIO':
        return 'badge bg-info';
      case 'APROBADO':
        return 'badge bg-success';
      case 'RECHAZADO':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  nuevaSolicitud(): void {
    this.router.navigate(['/solicitud-presencialidad', this.qrId]);
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.matsort) {
      this.dataSource.sort = this.matsort;
    }
  }
}
