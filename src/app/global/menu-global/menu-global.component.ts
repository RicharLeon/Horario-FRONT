import { Component } from '@angular/core';
import { QrModel } from 'src/app/models/qr.interface';

@Component({
  selector: 'app-menu-global',
  templateUrl: './menu-global.component.html',
  styleUrls: ['./menu-global.component.css']
})
export class MenuGlobalComponent {
  showButton: boolean = false;
  qrModel: QrModel | undefined;

  showGetStartedButton(event: Event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    this.showButton = true;

  }

  hideGetStartedButton() {
    this.showButton = false;
  
  }

}
