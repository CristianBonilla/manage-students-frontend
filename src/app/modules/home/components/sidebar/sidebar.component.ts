import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { WINDOW } from '@core/providers/window.provider';
import { ToggleSidebarService } from '@modules/home/services/toggle-sidebar/toggle-sidebar.service';

@Component({
  selector: 'msf-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent implements AfterViewInit {
  readonly #window = inject(WINDOW);
  readonly #toggleSidebar = inject(ToggleSidebarService);
  readonly #$body = this.#window.document.body;
  @ViewChild('sidebar')
  readonly sidebarRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.#toggleSidebar.addSidebar(this.sidebarRef.nativeElement);
  }

  minimize() {
    this.#$body.classList.toggle('sidebar-mini');
  }
}
