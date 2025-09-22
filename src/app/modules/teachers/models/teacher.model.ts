import { Auditable } from 'src/app/models/auditable';

export interface Teacher {
  documentNumber: string;
  mobile: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface TeacherRequest extends Teacher { }

export interface TeacherResponse extends Teacher, Auditable {
  teacherId: string;
}

export enum TeacherOperation {
  CREATED,
  UPDATED,
  DELETED,
  INFO
}
