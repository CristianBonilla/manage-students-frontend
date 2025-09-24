import { inject, Injectable } from '@angular/core';
import { GradeService } from '@modules/grades/services/grade.service';
import {
  addGradeAction,
  addGradeFailureAction,
  addGradeSuccessAction,
  deleteGradeAction,
  deleteGradeFailureAction,
  deleteGradeSuccessAction,
  fetchGradeByIdAction,
  fetchGradeByIdFailureAction,
  fetchGradeByIdSuccessAction,
  fetchGradesAction,
  fetchGradesFailureAction,
  fetchGradesSuccessAction,
  updateGradeAction,
  updateGradeFailureAction,
  updateGradeSuccessAction
} from '@modules/grades/store/actions/grade.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import { DEFAULT_WAIT } from 'src/app/constants/common.constants';
import { ServiceError } from 'src/app/models/service-error';

@Injectable()
export class GradeEffects {
  readonly #actions = inject(Actions);
  readonly #gradeService = inject(GradeService);

  addGrade$ = createEffect(() => this.#actions
    .pipe(
      ofType(addGradeAction),
      delay(DEFAULT_WAIT),
      switchMap(({ payload }) => this.#gradeService.addGrade(payload)
        .pipe(
          map(grade => addGradeSuccessAction({ grade })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(addGradeFailureAction({ error }));
          })
        ))
    ));

  updateGrade$ = createEffect(() => this.#actions
    .pipe(
      ofType(updateGradeAction),
      delay(DEFAULT_WAIT),
      switchMap(({ gradeId, payload }) => this.#gradeService.updateGrade(gradeId, payload)
        .pipe(
          map(grade => updateGradeSuccessAction({ grade })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(updateGradeFailureAction({ error }));
          })
        ))
    ));

  deleteGrade$ = createEffect(() => this.#actions
    .pipe(
      ofType(deleteGradeAction),
      delay(DEFAULT_WAIT),
      switchMap(({ gradeId }) => this.#gradeService.deleteGrade(gradeId)
        .pipe(
          map(grade => deleteGradeSuccessAction({ grade })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(deleteGradeFailureAction({ error }));
          })
        ))
    ));

  fetchGrades$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchGradesAction),
      delay(DEFAULT_WAIT),
      switchMap(() => this.#gradeService.fetchGrades()
        .pipe(
          map(grades => fetchGradesSuccessAction({ grades })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(fetchGradesFailureAction({ error }));
          })
        ))
    ));

  fetchGradeById$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchGradeByIdAction),
      delay(DEFAULT_WAIT),
      switchMap(({ actionType, gradeId }) => this.#gradeService.fetchGradeById(gradeId)
        .pipe(
          map((grade) => fetchGradeByIdSuccessAction({ actionType, grade })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(fetchGradeByIdFailureAction({ actionType, error }));
          })
        ))
    ));
}
