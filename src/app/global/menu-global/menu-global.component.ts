import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-global',
  templateUrl: './menu-global.component.html',
  styleUrls: ['./menu-global.component.css']
})
export class MenuGlobalComponent {
  showButton: boolean = false;

  showGetStartedButton(event: Event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    this.showButton = true;
  }

  hideGetStartedButton() {
    this.showButton = false;
  }
}
