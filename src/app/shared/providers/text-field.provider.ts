import { ClassProvider, inject, InjectionToken } from '@angular/core';
import { WINDOW } from '@core/providers/window.provider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { asyncScheduler, filter, map, ReplaySubject, startWith, switchMap, take } from 'rxjs';
import { TextFieldInfo } from 'src/app/models/text-field';

export class TextField {
  readonly #window = inject(WINDOW);
  readonly #document = this.#window.document;
  readonly #modal = inject(NgbModal);
  readonly #textField$ = new ReplaySubject<TextFieldInfo>(1);

  add(info: TextFieldInfo) {
    this.#textField$.next(info);
  }

  focus() {
    this.#textField$
      .pipe(
        switchMap(info => info.control.statusChanges.pipe(startWith(null), map(_ => info))),
        filter(({ control, $text }) => control.enabled && this.#document.activeElement !== $text),
        take(1)
      ).subscribe(({ $text }) => {
        asyncScheduler.schedule(() => {
          if (!this.#modal.hasOpenModals()) {
            $text.focus();
          }
        });
      });
  }

  clear() {
    this.#textField$.complete();
  }
}

export const TEXT_FIELD = new InjectionToken<TextField>('textField');

export const TEXT_FIELD_PROVIDER: ClassProvider = {
  provide: TEXT_FIELD,
  useClass: TextField
};
