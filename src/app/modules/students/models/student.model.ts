import { Auditable } from 'src/app/models/auditable';

export interface Student {
  documentNumber: string;
  mobile: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface StudentRequest extends Student { }

export interface StudentResponse extends Student, Auditable {
  studentId: string;
}

export enum StudentOperation {
  CREATED,
  UPDATED,
  DELETED
}
