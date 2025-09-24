import { StudentResponse } from '@modules/students/models/student.model';
import { TeacherResponse } from '@modules/teachers/models/teacher.model';
import { Auditable } from 'src/app/models/auditable';

export interface Grade {
  teacherId: string;
  studentId: string;
  value: number;
}

export interface GradeRequest extends Grade { }

export interface GradeResponse extends Grade, Auditable {
  gradeId: string;
}

export interface GradeResponseExtended extends GradeResponse {
  teacher: TeacherResponse;
  student: StudentResponse;
}

export enum GradeOperation {
  CREATED,
  UPDATED,
  DELETED,
  INFO
}
