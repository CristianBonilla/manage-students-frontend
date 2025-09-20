import { Injectable } from '@angular/core';
import { ToggleSidebar } from '@modules/home/models/toggle-sidebar';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ToggleSidebarService {
  readonly #toggleSidebarSubject = new BehaviorSubject<ToggleSidebar | null>(null);
  readonly toggleSidebar$ = this.#toggleSidebarSubject.asObservable();

  addToggle($toggle: HTMLDivElement) {
    const toggleSidebar = this.#toggleSidebarSubject.getValue();
    const $sidebar = toggleSidebar?.$sidebar ?? null;
    this.#toggleSidebarSubject.next({ $toggle, $sidebar });
  }

  addSidebar($sidebar: HTMLDivElement) {
    const toggleSidebar = this.#toggleSidebarSubject.getValue();
    const $toggle = toggleSidebar?.$toggle ?? null;
    this.#toggleSidebarSubject.next({ $sidebar, $toggle });
  }
}
