import { TeacherResponse } from '@modules/teachers/models/teacher.model';
import { ServiceError } from 'src/app/models/service-error';

export interface TeacherActionInfo {
  loading: boolean;
  error: ServiceError | null;
}

export interface TeacherActions {
  general: TeacherActionInfo;
  create: TeacherActionInfo;
  update: TeacherActionInfo;
  delete: TeacherActionInfo;
  info: TeacherActionInfo;
}

export interface TeacherSelected {
  teacher: TeacherResponse;
  hasAssociatedGrades: boolean | null;
}

export interface TeachersState {
  teachers: TeacherResponse[] | null;
  teachersExcluded: TeacherResponse[] | null;
  teacherSelected: TeacherSelected | null;
  actions: TeacherActions;
}
