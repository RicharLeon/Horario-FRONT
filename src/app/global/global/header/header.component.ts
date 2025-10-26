import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { MenuInterface } from 'src/app/models/menu.interface';
import { AuthService } from 'src/app/services/auth.service';
import { DynamicRoutesService } from 'src/app/services/dynamic-routes.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  @Input() idEmpelado: number | undefined ;
  idUser: number | null = null;
  

  constructor(private menuServices: MenuService, private router: Router,
    private dynamicRoutesService: DynamicRoutesService, private authService: AuthService
  ){}

  ngOnInit(): void {
    this.idUser = this.authService.getUserId();
    this.getMenuGrupo("Funcionario Administrador");
    
  }

  opcionesConSubmenus:any[]=[];
  menuGrupo: MenuInterface [] = [];
  showButton: boolean = false;

  showGetStartedButton(event: Event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    this.showButton = true;

  }

  hideGetStartedButton() {
    this.showButton = false;
  }

  toggleSubMenu(opcion: any) {
    opcion.mostrarSubmenu = !opcion.mostrarSubmenu;
  }

  getMenuGrupo(grupo: String){
    this.menuServices.getMenuPorGrupo(grupo).pipe(
      tap((info: any) => {
        console.log(info, "datos menu");
        if (Array.isArray(info)) {
          this.menuGrupo = info;
          this.validationOfMenu();

          this.dynamicRoutesService.addDynamicRoutes(this.menuGrupo, this.idEmpelado);
        } else {
          this.menuGrupo = [];
        }
        console.log(this.opcionesConSubmenus, "todos los [menus]");
      }),
      catchError(err => {
        console.error(err);
        return throwError(err);
      })
    ).subscribe();
  }

  validationOfMenu(){
    const opcionesPrincipales = this.menuGrupo.filter(item => item.idPadreMenuOpcion === null);
    const submenus = this.menuGrupo.filter(item => item.idPadreMenuOpcion !== null);

    this.opcionesConSubmenus = opcionesPrincipales.map(opcion => {
      const submenusRelacionados = submenus.filter(submenu => submenu.idPadreMenuOpcion === opcion.idMenuOpcion);
      return { opcion, submenusRelacionados, mostrarSubmenu: true};
    });

    console.log('Opciones principales:', opcionesPrincipales);
    console.log('Submenus', submenus);
    console.log('Opciones con submenus relacionados', this.opcionesConSubmenus);
  }

  returnMenu(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/inicio/', this.idUser]);
    });
    
  }

}
