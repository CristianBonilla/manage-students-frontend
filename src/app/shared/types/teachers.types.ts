import { SubjectName } from "@modules/teachers/enums/subject-name.enum";
import { FormSelectOption } from "@shared/types/form.types";

export type SubjectNameRequiredSelectionValue = FormSelectOption<string, SubjectName>;

export type SubjectNameSelectionValue = FormSelectOption<'Seleccionar asignatura', ''> | SubjectNameRequiredSelectionValue;
