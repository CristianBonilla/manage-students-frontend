import { Auditable } from 'src/app/models/auditable';

export interface Grade {
  teacherId: string;
  studentId: string;
  value: number;
}

export interface GradeRequest extends Grade { }

export interface GradeResponse extends Auditable {
  gradeId: string;
}

export enum GradeOperation {
  CREATED,
  UPDATED,
  DELETED,
  INFO
}
