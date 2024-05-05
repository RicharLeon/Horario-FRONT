import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { EmpleadoInterface } from 'src/app/models/empelado.interface';
import { QrModel } from 'src/app/models/qr.interface';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { QrServiceService } from 'src/app/services/qr-service.service';

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


  constructor(private qrServices: QrServiceService,
    private empleadoInfo: EmpleadoService,
    private route: ActivatedRoute) {
      const idString = this.route.snapshot.paramMap.get('id');
  this.idEmpelado = idString ? Number(idString) : undefined;
     }

  ngOnInit(): void {

    if (this.idEmpelado) {
      this.getQrEmpleadoId(Number(this.idEmpelado));
      this.getIdEmpleadoInfo(Number(this.idEmpelado));
      this.valdiationTypeOfEmployee();
    }

  }


  showGetStartedButton(event: Event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    this.showButton = true;

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
        console.log(info, "datos empleado");
        this.infoEmpleado = info;
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  valdiationTypeOfEmployee() {

    this.getIdEmpleadoInfo(Number(this.idEmpelado)).subscribe((data: any[]) => {
      const tipoDeUsuario = 'Gerente'; // Tipo de USUARIO
      const documentosEncontrados = data.filter(empleado => empleado.nombreCargo === tipoDeUsuario);
      
      if (documentosEncontrados.length > 0) {
        this.isAdministrator = true;
      } 
    })
  }

}
