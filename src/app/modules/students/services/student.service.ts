import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StudentRequest, StudentResponse } from '@modules/students/models/student.model';
import { ENDPOINTS } from 'src/app/models/endpoints';

@Injectable()
export class StudentService {
  readonly #http = inject(HttpClient);
  readonly #headerOptions = new Headers({
    'Content-Type': 'application/json'
  });
  readonly #endpointUrl = ENDPOINTS.STUDENTS;

  addStudent(student: StudentRequest) {
    const student$ = this.#http.post<StudentResponse>(this.#endpointUrl.DEFAULT, student, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return student$;
  }

  updateStudent(studentId: string, student: StudentRequest) {
    const student$ = this.#http.put<StudentResponse>(`${this.#endpointUrl.DEFAULT}/${studentId}`, student, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return student$;
  }

  deleteStudent(studentId: string) {
    const student$ = this.#http.delete<StudentResponse>(`${this.#endpointUrl.DEFAULT}/${studentId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return student$;
  }

  fetchStudents() {
    const students$ = this.#http.get<StudentResponse[]>(this.#endpointUrl.DEFAULT, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return students$;
  }

  fetchStudentById(studentId: string) {
    const student$ = this.#http.get<StudentResponse>(`${this.#endpointUrl.DEFAULT}/${studentId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return student$;
  }

  fetchStudentsExcludedByTeacher(teacherId: string) {
    const students$ = this.#http.get<StudentResponse[]>(`${this.#endpointUrl.EXCEPT}/${teacherId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return students$;
  }

  hasAssociatedGrades(studentId: string) {
    const student$ = this.#http.get<boolean>(`${this.#endpointUrl.HAS_ASSOCIATED_GRADES}/${studentId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return student$;
  }
}
