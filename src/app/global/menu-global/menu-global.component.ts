import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-global',
  templateUrl: './menu-global.component.html',
  styleUrls: ['./menu-global.component.css']
})
export class MenuGlobalComponent implements OnInit {

  isAdministrator: boolean = false;
  showButton: boolean = false;
  qrModel: QrModel | undefined;
  infoAllEmpleado: EmpleadoInterface[] = [];
  infoEmpleado: EmpleadoInterface | undefined;

  idEmpelado: number | undefined;


  constructor(
    private qrServices: QrServiceService,
    private empleadoInfo: EmpleadoService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    const idString = this.route.snapshot.paramMap.get('id');
    this.idEmpelado = idString ? Number(idString) : undefined;
  }

  ngOnInit(): void {
    console.log('MenuGlobalComponent iniciado ✅');
    console.log('ID Empleado recibido:', this.idEmpelado);
    console.log(this.infoEmpleado, "RRRRRRRR");
    
    // Validar rol primero
    this.validateUserRole();
    
    if (this.idEmpelado) {
      this.getQrEmpleadoId(Number(this.idEmpelado));
      this.getIdEmpleadoInfo(Number(this.idEmpelado)).subscribe();
    } else {
      console.error('⚠️ No se recibió ID de empleado');
      
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
      this.isAdministrator = true;
    } else {
      this.isAdministrator = false;
    }

    console.log('isAdministrator:', this.isAdministrator);
  }

  hideGetStartedButton() {
    this.showButton = false;

  }

  getQrEmpleadoId(id: number): void {
    this.qrServices.getQrEmpleado(id)
      .subscribe(

        qr => {
          console.log(qr);
          this.qrModel = qr;
        },
        err => {
          console.log(err);
        })
  }

  getIdEmpleadoInfo(id: number): Observable<any> {
    return this.empleadoInfo.getEmpleadoPorId(id).pipe(
      tap(info => {
        console.log(info, "✅ Datos empleado cargados");
        this.infoEmpleado = info;
      }),
      catchError(err => {
        console.error('❌ Error al cargar datos del empleado:', err);
        // Crear un objeto empleado temporal para que la vista no falle
        this.infoEmpleado = {
          idEmpleado: id,
          nombre: 'Usuario',
          apellido: '',
          tipoDocumento: '',
          documento: '',
          nombreCargo: 'Administrador',
          nombreContrato: '',
          nombreArea: '',
          nombreProyectos: '',
          descripcionProyecto: ''
        } as EmpleadoInterface;
        return throwError(err);
      })
    );
  }

}