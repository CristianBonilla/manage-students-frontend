import { GradeResponseExtended } from '@modules/grades/models/grade.model';
import { ServiceError } from 'src/app/models/service-error';

export interface GradeActionInfo {
  loading: boolean;
  error: ServiceError | null;
}

export interface GradeActions {
  general: GradeActionInfo;
  create: GradeActionInfo;
  update: GradeActionInfo;
  delete: GradeActionInfo;
  info: GradeActionInfo;
}

export interface GradesState {
  grades: GradeResponseExtended[] | null;
  gradeSelected: GradeResponseExtended | null;
  actions: GradeActions;
}
