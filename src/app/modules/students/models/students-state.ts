import { StudentResponse } from '@modules/students/models/student.model';
import { ServiceError } from 'src/app/models/service-error';

export interface StudentActionInfo {
  loading: boolean;
  error: ServiceError | null;
}

export interface StudentActions {
  general: StudentActionInfo;
  create: StudentActionInfo;
  update: StudentActionInfo;
  delete: StudentActionInfo;
}

export interface StudentsState {
  students: StudentResponse[] | null;
  studentsExcluded: StudentResponse[] | null;
  studentSelected: {
    student: StudentResponse;
    hasAssociatedGrades: boolean | null;
  } | null;
  actions: StudentActions;
}
