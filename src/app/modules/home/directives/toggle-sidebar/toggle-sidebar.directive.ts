import { AfterViewInit, Directive, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WINDOW } from '@core/providers/window.provider';
import { ToggleSidebarService } from '@modules/home/services/toggle-sidebar/toggle-sidebar.service';
import { filter, take } from 'rxjs/operators';
import { routeFromSidebar } from 'src/app/models/routes';

@Directive({
  selector: '[msfToggleSidebar]'
})
export class ToggleSidebarDirective implements OnInit, AfterViewInit {
  readonly #window = inject(WINDOW);
  readonly #router = inject(Router);
  readonly #toggleSidebarService = inject(ToggleSidebarService);
  readonly #document = this.#window.document;
  readonly #$body = this.#document.body;
  #$toggle!: HTMLDivElement;
  #$sidebar!: HTMLDivElement;
  #$button!: HTMLButtonElement;
  visibleSidebar!: boolean;

  get buttonIsVisible() {
    if (!this.#$toggle || !this.#$button) {
      return false;
    }
    const { display } = this.#window.getComputedStyle(this.#$button);

    return this.#$toggle.contains(this.#$button) && display !== 'none';
  }

  ngOnInit() {
    this.#router.events.pipe(
      filter(event => routeFromSidebar(event) && !!this.buttonIsVisible && !!this.visibleSidebar)
    ).subscribe(_ => this.#hideSidebar());
  }

  ngAfterViewInit() {
    this.#toggleSidebarService.toggleSidebar$.pipe(
      filter(toggleSidebar => !!toggleSidebar?.$toggle && !!toggleSidebar?.$sidebar),
      take(1)
    ).subscribe(toggleSidebar => {
      this.#$toggle = toggleSidebar?.$toggle as HTMLDivElement;
      this.#$sidebar = toggleSidebar?.$sidebar as HTMLDivElement;
      this.#$button = this.#$toggle.querySelector('button') as HTMLButtonElement;
      this.#$button.addEventListener('click', _ => {
        if (this.visibleSidebar) {
          this.#hideSidebar();
        } else {
          this.#showSidebar();
        }
      });
    });
  }

  #showSidebar() {
    const $layer = this.#layerElement();
    setTimeout(() => {
      $layer.classList.add('visible');
    }, 165);
    this.#$body.classList.add('nav-open');
    this.#$sidebar.addEventListener('transitionend', () => {
      this.#$toggle.classList.add('toggled');
      $layer.addEventListener('click', _ => this.#hideSidebar(), { once: true });
    }, { once: true });
    this.visibleSidebar = true;
  }

  #hideSidebar() {
    this.#$body.classList.remove('nav-open');
    const $layer = this.#layerElement();
    $layer.classList.remove('visible');
    this.#$sidebar.addEventListener('transitionend', () => {
      this.#$toggle.classList.remove('toggled');
      $layer.remove();
    }, { once: true });
    this.visibleSidebar = false;
  }

  #layerElement(): HTMLDivElement {
    let $layer = this.#$body.querySelector<HTMLDivElement>('.close-layer');
    if ($layer) {
      return $layer;
    }
    $layer = this.#document.createElement('div');
    $layer.classList.add('close-layer');
    this.#$body.appendChild($layer);

    return this.#layerElement();
  }
}
