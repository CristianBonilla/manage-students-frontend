import { Component } from '@angular/core';
import { PartialOptions } from 'overlayscrollbars';
import { SIDEBAR_ROUTES } from 'src/app/models/routes';
import { DEFAULT_SCROLLBAR_OPTIONS } from 'src/app/models/scrollbar';

@Component({
  selector: 'msf-sidebar-wrapper',
  templateUrl: './sidebar-wrapper.component.html',
  styles: ``
})
export class SidebarWrapperComponent {
  readonly scrollbarOptions: PartialOptions = {
    ...DEFAULT_SCROLLBAR_OPTIONS,
    overflow: {
      x: 'visible-hidden'
    }
  };
  readonly ROUTES = SIDEBAR_ROUTES;
}
