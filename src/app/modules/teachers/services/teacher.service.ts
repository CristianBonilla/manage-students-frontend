import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SubjectName } from '@modules/teachers/enums/subject-name.enum';
import { TeacherRequest, TeacherResponse } from '@modules/teachers/models/teacher.model';
import { ENDPOINTS } from 'src/app/models/endpoints';

@Injectable()
export class TeacherService {
  readonly #http = inject(HttpClient);
  readonly #headerOptions = new Headers({
    'Content-Type': 'application/json'
  });
  readonly #endpointUrl = ENDPOINTS.TEACHERS;

  addTeacher(teacher: TeacherRequest) {
    const teacher$ = this.#http.post<TeacherResponse>(this.#endpointUrl.DEFAULT, teacher, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return teacher$;
  }

  updateTeacher(teacherId: string, teacher: TeacherRequest) {
    const teacher$ = this.#http.put<TeacherResponse>(`${this.#endpointUrl.DEFAULT}/${teacherId}`, teacher, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return teacher$;
  }

  deleteTeacher(teacherId: string) {
    const teacher$ = this.#http.delete<TeacherResponse>(`${this.#endpointUrl.DEFAULT}/${teacherId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return teacher$;
  }

  fetchTeachers() {
    const teachers$ = this.#http.get<TeacherResponse[]>(this.#endpointUrl.DEFAULT, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return teachers$;
  }

  fetchTeacherById(teacherId: string) {
    const teacher$ = this.#http.get<TeacherResponse>(`${this.#endpointUrl.DEFAULT}/${teacherId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return teacher$;
  }

  fetchTeachersBySubject(subject: SubjectName) {
    const teachers$ = this.#http.get<TeacherResponse[]>(`${this.#endpointUrl.SEARCH}/${subject}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return teachers$;
  }

  hasAssociatedGrades(teacherId: string) {
    const hasAssociatedGrades$ = this.#http.get<boolean>(`${this.#endpointUrl.HAS_ASSOCIATED_GRADES}/${teacherId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return hasAssociatedGrades$;
  }
}
