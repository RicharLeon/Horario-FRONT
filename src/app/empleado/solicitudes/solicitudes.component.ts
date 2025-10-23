import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { CambioHorarioConsultaInterface } from 'src/app/models/cambioHorarioConsulta.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})


export class SolicitudesComponent implements OnInit {


  //TABLA NUEVA
  displayedColumns = ['ID SOLICITUD',
    'NOMBRE SOLICITANTE',
    'NOMBRE EMPLEADO CAMBIO',
    'NOMBRE APROBADOR',
    
     'DESCRIPCIÓN','FECHA DE SOLICITUD',
    'ESTADO SOLICITUD',
    'ACCIONES'
  ];
  
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) matsort !:MatSort;


  dataSource: MatTableDataSource<CambioHorarioConsultaInterface> = new MatTableDataSource<CambioHorarioConsultaInterface>();

  //FIN
  infoEmpleado: EmpleadoInterface | undefined;
  esAdministrador: boolean = false;
  respuesta: boolean = false;
  cambioHorarioConsultaForEmployee: CambioHorarioConsultaInterface[] = [];
  cambioHorarioConsulta: CambioHorarioConsultaInterface[] = [];
  qrId: number | null = null; // ID del usuario autenticado


  // Propiedades de la paginación
  pageSize = 10; // Tamaño de página predeterminado
  currentPage = 0; // Página actual
  pageSizeOptions: number[] = [5, 10, 25];
  totalElement: string | number = 0;

  constructor(
    private cambioHorario: CambioHorarioService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    // Obtener el ID del usuario autenticado desde el token
    this.qrId = this.authService.getUserId();
    
    if (this.esAdministrador) {
      this.getAllSolicitudes(this.pageSizeOptions[0]);
    } else {
      if (this.qrId) {
        this.getSolicitudesForIdEmployee(this.qrId, this.pageSizeOptions[0]);
      } else {
        console.error('No se pudo obtener el ID del usuario de sesión');
        this.router.navigate(['/login']);
      }
    }
  }

  getAllSolicitudes(size: number): void {
    this.cambioHorario.getAllDataRequestSchedule(this.currentPage, size).pipe(
      tap(info => {
        if (info && Array.isArray(info.content)) {
          this.cambioHorarioConsulta = info.content;
          if (info.totalElements) {
            this.totalElement = info.totalElements;
            if (this.paginator) {
              this.paginator.length = this.totalElement; // Establecer el total de elementos en el paginador
              this.dataSource.sort = this.matsort;
            }
          }
          this.dataSource = new MatTableDataSource<CambioHorarioConsultaInterface>(this.cambioHorarioConsulta);
        } else {
          this.cambioHorarioConsulta = [];
        }
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();
  }

  getSolicitudesForIdEmployee(id: Number, size: number): void {
    this.cambioHorario.getChangeScheduleForIdEmployee(id, this.currentPage, size).pipe(
      tap(info => {
        if (Array.isArray(info.content)) {
          this.cambioHorarioConsultaForEmployee = info.content;
          if (info.totalElements) {
            this.totalElement = info.totalElements;
            if (this.paginator) {
              this.paginator.length = this.totalElement; // Establecer el total de elementos en el paginador
              this.dataSource.sort = this.matsort;
            }
          }
          this.dataSource = new MatTableDataSource<CambioHorarioConsultaInterface>(this.cambioHorarioConsultaForEmployee);
        } else {
          this.cambioHorarioConsultaForEmployee = [];
        }
        console.log(this.cambioHorarioConsultaForEmployee, "solicitudes por empleado");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();

  }

  onPageChange(event: any): void {
    const pageSize = event.pageSize;
    const newPageIndex = event.pageIndex;
    const totalPages = Math.ceil(Number(this.totalElement) / pageSize);
    console.log(totalPages)
    if (newPageIndex >= totalPages) {
      this.currentPage = totalPages - 1;
    } else {
      this.currentPage = newPageIndex;
    }
    if (this.esAdministrador) {
      this.getAllSolicitudes(pageSize);
    } else {
      if (this.qrId) {
        this.getSolicitudesForIdEmployee(this.qrId, pageSize);
      }
    }
    
  }

  mostrarDetalleDeSolicitud(usuario: CambioHorarioConsultaInterface) {
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
      confirmButtonText: 'Cerrar',
      width: 'auto',
      customClass: {
        title: 'custom-title'
      }
    });

  }

  responder() {
    this.respuesta = true;
  }
  responder2(cambio: CambioHorarioConsultaInterface): void {
    this.router.navigate(['/resonder-solicitud', this.qrId], { queryParams: { idCambioHorario: cambio.idCambioHorario } });
  }

  solicitarEitar(cambio: CambioHorarioConsultaInterface): void {
    this.router.navigate(['/solicitud-edicion', this.qrId], { queryParams: { idCambioHorario: cambio.idCambioHorario } });
  }
  cancelar() {
    this.respuesta = false; // Limpiar la respuesta
  }

  handleClickInside(event: MouseEvent): void {
    console.log('Clic dentro del elemento:', event.target);
  }

  handleClickOutside(event: MouseEvent): void {
    if (this.respuesta) {
      console.log('Clic fuera del elemento:', event.target);

      this.respuesta = false;

    }

  }
  

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    } else {
      console.error('MatPaginator no está definido.');
    }
  }

}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];