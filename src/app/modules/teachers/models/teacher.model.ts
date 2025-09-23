import { Auditable } from 'src/app/models/auditable';
import { SubjectName } from '@modules/teachers/enums/subject-name.enum';

export interface Teacher {
  documentNumber: string;
  mobile: string;
  firstname: string;
  lastname: string;
  email: string;
  subject: SubjectName;
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
