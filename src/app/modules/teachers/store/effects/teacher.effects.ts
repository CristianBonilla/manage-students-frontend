import { inject, Injectable } from '@angular/core';
import { TeacherService } from '@modules/teachers/services/teacher.service';
import {
  addTeacherAction,
  addTeacherFailureAction,
  addTeacherSuccessAction,
  deleteTeacherAction,
  deleteTeacherFailureAction,
  deleteTeacherSuccessAction,
  fetchTeacherByIdAction,
  fetchTeacherByIdFailureAction,
  fetchTeacherByIdSuccessAction,
  fetchTeachersAction,
  fetchTeachersBySubjectAction,
  fetchTeachersBySubjectFailureAction,
  fetchTeachersBySubjectSuccessAction,
  fetchTeachersFailureAction,
  fetchTeachersSuccessAction,
  updateTeacherAction,
  updateTeacherFailureAction,
  updateTeacherSuccessAction
} from '@modules/teachers/store/actions/teacher.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap, timer, zip } from 'rxjs';
import { DEFAULT_WAIT } from 'src/app/constants/common.constants';
import { ServiceError } from 'src/app/models/service-error';

@Injectable()
export class TeacherEffects {
  readonly #actions = inject(Actions);
  readonly #teacherService = inject(TeacherService);

  addTeacher$ = createEffect(() => this.#actions
    .pipe(
      ofType(addTeacherAction),
      delay(DEFAULT_WAIT),
      switchMap(({ payload }) => this.#teacherService.addTeacher(payload)
        .pipe(
          map(teacher => addTeacherSuccessAction({ teacher })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(addTeacherFailureAction({ error }));
          })
        ))
    ));

  updateTeacher$ = createEffect(() => this.#actions
    .pipe(
      ofType(updateTeacherAction),
      delay(DEFAULT_WAIT),
      switchMap(({ teacherId, payload }) => this.#teacherService.updateTeacher(teacherId, payload)
        .pipe(
          map(teacher => updateTeacherSuccessAction({ teacher })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(updateTeacherFailureAction({ error }));
          })
        ))
    ));

  deleteTeacher$ = createEffect(() => this.#actions
    .pipe(
      ofType(deleteTeacherAction),
      delay(DEFAULT_WAIT),
      switchMap(({ teacherId }) => this.#teacherService.deleteTeacher(teacherId)
        .pipe(
          map(teacher => deleteTeacherSuccessAction({ teacher })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(deleteTeacherFailureAction({ error }));
          })
        ))
    ));

  fetchTeachers$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchTeachersAction),
      delay(DEFAULT_WAIT),
      switchMap(() => this.#teacherService.fetchTeachers()
        .pipe(
          map(teachers => fetchTeachersSuccessAction({ teachers })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(fetchTeachersFailureAction({ error }));
          })
        ))
    ));

  fetchTeacherById$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchTeacherByIdAction),
      switchMap(({ actionType, teacherId }) =>
        timer(!actionType ? 0 : DEFAULT_WAIT)
          .pipe(
            switchMap(() =>
              zip([
                this.#teacherService.fetchTeacherById(teacherId),
                this.#teacherService.hasAssociatedGrades(teacherId)
              ])
              .pipe(
                map(([teacher, hasAssociatedGrades]) => fetchTeacherByIdSuccessAction({ actionType, teacher, hasAssociatedGrades })),
                catchError(httpError => {
                  const error: ServiceError = httpError.error ?? httpError;

                  return of(fetchTeacherByIdFailureAction({ actionType, error }));
                })
              ))
        ))
    ));

  fetchTeachersBySubject$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchTeachersBySubjectAction),
      switchMap(({ actionType, subject }) => this.#teacherService.fetchTeachersBySubject(subject)
        .pipe(
          map(teachers => fetchTeachersBySubjectSuccessAction({ actionType, teachers })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(fetchTeachersBySubjectFailureAction({ actionType, error }));
          })
        ))
    ));
}
