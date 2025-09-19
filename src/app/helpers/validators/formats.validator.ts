import { AbstractControl } from '@angular/forms';

export function numberValidator({ value }: AbstractControl) {
  if (value && isNaN(+value)) {
    return { isNaN: true };
  }
  return null;
}

export function emailValidator({ value }: AbstractControl) {
  const emailUnicode = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return !!value && !emailUnicode.test(value) ? { email: true } : null;
}

export function onlyNumbers({ value }: AbstractControl) {
  return !!value && !/^\d*$/.test(value) ? { onlyNumbers: true } : null;
}

export function onlyLetters({ value }: AbstractControl) {
  return !!value && !/^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$/.test(value) ? { onlyLetters: true } : null;
}
