import { ClassProvider, InjectionToken } from '@angular/core';
import { asyncScheduler, filter, map, ReplaySubject, startWith, switchMap, take } from 'rxjs';
import { TextFieldInfo } from 'src/app/models/text-field';

export class TextField {
  readonly #textField$ = new ReplaySubject<TextFieldInfo>(1);

  add(info: TextFieldInfo) {
    this.#textField$.next(info);
  }

  focus() {
    this.#textField$
      .pipe(
        switchMap(info => info.control.statusChanges.pipe(startWith(null), map(_ => info))),
        filter(({ control }) => control.enabled),
        take(1)
      ).subscribe(({ $text }) => {
        asyncScheduler.schedule(() => {
          $text.focus();
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
