import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { SubjectNameSelectionValue } from '@shared/types/teachers.types';

  export function selectRequired(control: AbstractControl<SubjectNameSelectionValue>): ValidationErrors | null {
  const { selected, value } = control.value;

  return selected && !value ? { required: true } : null;
}
