import { SubjectName } from '@modules/teachers/enums/subject-name.enum';
import { FormSelectOption } from '@shared/types/form.types';

export const SUBJECT_NAMES_SELECT: [FormSelectOption<'Seleccionar asignatura', ''>, ...FormSelectOption<string, SubjectName>[]] = [
  {
    text: 'Seleccionar asignatura',
    value: '',
    selected: true
  },
  {
    text: 'Matemáticas',
    value: SubjectName.Mathematics,
    selected: false
  },
  {
    text: 'Español',
    value: SubjectName.Spanish,
    selected: false
  },
  {
    text: 'Biología',
    value: SubjectName.Biology,
    selected: false
  },
  {
    text: 'Física',
    value: SubjectName.Physics,
    selected: false
  },
  {
    text: 'Química',
    value: SubjectName.Chemistry,
    selected: false
  },
  {
    text: 'Ciencias Políticas',
    value: SubjectName.PoliticalScience,
    selected: false
  },
  {
    text: 'Educación Física',
    value: SubjectName.PhysicalEducation,
    selected: false
  }
];
