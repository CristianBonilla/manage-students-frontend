import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ToggleSidebarService } from '@modules/home/services/toggle-sidebar/toggle-sidebar.service';

@Component({
  selector: 'msf-navbar',
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent implements AfterViewInit {
  readonly #toggleSidebarService = inject(ToggleSidebarService);
  @ViewChild('toggle')
  readonly toggleRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.#toggleSidebarService.addToggle(this.toggleRef.nativeElement);
  }
}
