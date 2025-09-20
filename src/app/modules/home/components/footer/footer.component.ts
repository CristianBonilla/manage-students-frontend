import { Component } from '@angular/core';

@Component({
  selector: 'msf-footer',
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
