import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { CambioHorarioConsultaInterface } from 'src/app/models/cambioHorarioConsulta.interface';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { CambioHorarioService } from 'src/app/services/cambio-horario.service';

@Component({
  selector: 'app-ejemplo-tablas',
  templateUrl: './ejemplo-tablas.component.html',
  styleUrls: ['./ejemplo-tablas.component.css']
})
export class EjemploTablasComponent {
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
  esAdministrador: boolean = true;
  respuesta: boolean = false;
  cambioHorarioConsultaForEmployee: CambioHorarioConsultaInterface[] = [];
  cambioHorarioConsulta: CambioHorarioConsultaInterface[] = [];
  qrId = this.route.snapshot.paramMap.get('id');

  // Propiedades de la paginación
  pageSize = 10; // Tamaño de página predeterminado
  currentPage = 0; // Página actual
  pageSizeOptions: number[] = [5, 10, 25];
  totalElement: string | number = 0;

  constructor(
    private cambioHorario: CambioHorarioService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.getAllSolicitudes(this.pageSizeOptions[0]);
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
    this.getAllSolicitudes(pageSize);
  }


}
