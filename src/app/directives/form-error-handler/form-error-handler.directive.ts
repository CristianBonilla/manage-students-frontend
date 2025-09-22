import { Directive, ElementRef, inject, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { resolveErrorMessage } from '@helpers/errors/errors';
import { delay } from 'rxjs/operators';

interface ControlElements {
  $current: HTMLElement;
  $parent: HTMLElement;
  $error: HTMLDivElement;
}

@Directive({
  selector: '[msfFormErrorHandler]'
})
export class FormErrorHandlerDirective implements OnInit {
  readonly #controlElementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #renderer = inject(Renderer2);
  #control!: AbstractControl;
  #controlTouched = true;
  @Input('msfFormErrorHandler')
  controlOptions!: AbstractControl | {
    instance: AbstractControl;
    touched?: boolean;
    focus?: boolean;
  };

  ngOnInit() {
    if (this.controlOptions instanceof AbstractControl) {
      this.#control = this.controlOptions;
    } else {
      this.#control = this.controlOptions.instance;
      this.#controlTouched = this.controlOptions.touched ?? true;
      if (!!this.controlOptions.focus) {
        this.#controlElementRef.nativeElement.focus();
      }
    }
    const controlElements = this.#getControlElements();
    this.#control.valueChanges.pipe(delay(1)).subscribe(() => {
      if (this.#hasError()) {
        this.#createErrorElement(controlElements);
      } else {
        this.#removeErrorElement(controlElements);
      }
    });
  }

  #getControlElements(): ControlElements {
    const $current = this.#controlElementRef.nativeElement;
    const $parent: HTMLElement = this.#renderer.parentNode($current);
    const $error: HTMLDivElement = this.#renderer.createElement('div');

    return { $current, $parent, $error };
  }

  #createErrorElement({ $current, $parent, $error }: ControlElements) {
    if (!$parent.contains($error)) {
      this.#renderer.appendChild($parent, $error);
    }
    const errorMessage = this.#getErrorMessage();
    if (!!errorMessage && $error.innerText !== errorMessage) {
      $error.innerText = errorMessage;
    }
    if (!this.#hasClasses($error, 'invalid-feedback')) {
      this.#renderer.addClass($error, 'invalid-feedback');
    }
    if (!this.#hasClasses($current, 'is-invalid')) {
      this.#renderer.addClass($current, 'is-invalid');
    }
  }

  #removeErrorElement({ $current, $parent, $error }: ControlElements) {
    if ($parent.contains($error)) {
      this.#renderer.removeChild($parent, $error);
    }
    if (this.#hasClasses($current)) {
      this.#renderer.removeClass($current, 'is-invalid');
    }
  }

  #hasClasses($element: HTMLElement, ...classes: string[]) {
    return classes.every(className => $element.classList.contains(className));
  }

  #getErrorMessage() {
    return this.#hasError() ? resolveErrorMessage(this.#control.errors) : null;
  }

  #hasError() {
    const { invalid, dirty, touched } = this.#control;

    return invalid && (dirty || this.#controlTouched && touched);
  }
}
