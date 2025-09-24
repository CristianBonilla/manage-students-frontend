import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GradeRequest, GradeResponse } from '@modules/grades/models/grade.model';
import { ENDPOINTS } from 'src/app/models/endpoints';

@Injectable()
export class GradeService {
  readonly #http = inject(HttpClient);
  readonly #headerOptions = new Headers({
    'Content-Type': 'application/json'
  });
  readonly #endpointUrl = ENDPOINTS.GRADES;

  addGrade(grade: GradeRequest) {
    const grade$ = this.#http.post<GradeResponse>(this.#endpointUrl.DEFAULT, grade, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return grade$;
  }

  updateGrade(gradeId: string, grade: GradeRequest) {
    const grade$ = this.#http.put<GradeResponse>(`${this.#endpointUrl.DEFAULT}/${gradeId}`, grade, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return grade$;
  }

  deleteGrade(gradeId: string) {
    const grade$ = this.#http.delete<GradeResponse>(`${this.#endpointUrl.DEFAULT}/${gradeId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return grade$;
  }

  fetchGrades() {
    const grades$ = this.#http.get<GradeResponse[]>(this.#endpointUrl.DEFAULT, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return grades$;
  }

  fetchGradeById(gradeId: string) {
    const grade$ = this.#http.get<GradeResponse>(`${this.#endpointUrl.DEFAULT}/${gradeId}`, {
      responseType: 'json',
      ...this.#headerOptions
    });

    return grade$;
  }
}
