import { Component, inject, OnInit } from '@angular/core';
import { WINDOW } from '@core/providers/window.provider';
import { DEFAULT_SCROLLBAR_OPTIONS, ScrollbarOptions } from 'src/app/models/scrollbar';

@Component({
  selector: 'msf-home',
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent implements OnInit {
  readonly #window = inject(WINDOW);
  readonly #$body = this.#window.document.body;
  readonly scrollbarOptions: ScrollbarOptions = {
    ...DEFAULT_SCROLLBAR_OPTIONS,
    overflow: {
      x: 'visible-hidden'
    }
  };

  ngOnInit() {
    this.#$body.classList.add('sidebar-mini');
  }
}
