import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  showButton: boolean = false;

  showGetStartedButton(event: Event) {
    event.preventDefault(); // Evita el comportamiento predeterminado del enlace
    this.showButton = true;

  }

  hideGetStartedButton() {
    this.showButton = false;
  
  }

}
