import { inject, Injectable } from '@angular/core';
import { StudentService } from '@modules/students/services/student.service';
import {
  addStudentAction,
  addStudentFailureAction,
  addStudentSuccessAction,
  deleteStudentAction,
  deleteStudentFailureAction,
  deleteStudentSuccessAction,
  fetchStudentByIdAction,
  fetchStudentByIdFailureAction,
  fetchStudentByIdSuccessAction,
  fetchStudentsAction,
  fetchStudentsExcludedByTeacherAction,
  fetchStudentsExcludedByTeacherFailureAction,
  fetchStudentsExcludedByTeacherSuccessAction,
  fetchStudentsFailureAction,
  fetchStudentsSuccessAction,
  updateStudentAction,
  updateStudentFailureAction,
  updateStudentSuccessAction
} from '@modules/students/store/actions/student.actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap, timer, zip } from 'rxjs';
import { DEFAULT_WAIT } from 'src/app/constants/common.constants';
import { ServiceError } from 'src/app/models/service-error';

@Injectable()
export class StudentEffects {
  readonly #actions = inject(Actions);
  readonly #studentService = inject(StudentService);

  addStudent$ = createEffect(() => this.#actions
    .pipe(
      ofType(addStudentAction),
      delay(DEFAULT_WAIT),
      switchMap(({ payload }) => this.#studentService.addStudent(payload)
        .pipe(
          map(student => addStudentSuccessAction({ student })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(addStudentFailureAction({ error }));
          })
        ))
    ));

  updateStudent$ = createEffect(() => this.#actions
    .pipe(
      ofType(updateStudentAction),
      delay(DEFAULT_WAIT),
      switchMap(({ studentId, payload }) => this.#studentService.updateStudent(studentId, payload)
        .pipe(
          map(student => updateStudentSuccessAction({ student })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(updateStudentFailureAction({ error }));
          })
        ))
    ));

  deleteStudent$ = createEffect(() => this.#actions
    .pipe(
      ofType(deleteStudentAction),
      delay(DEFAULT_WAIT),
      switchMap(({ studentId }) => this.#studentService.deleteStudent(studentId)
        .pipe(
          map(student => deleteStudentSuccessAction({ student })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(deleteStudentFailureAction({ error }));
          })
        ))
    ));

  fetchStudents$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchStudentsAction),
      delay(DEFAULT_WAIT),
      switchMap(() => this.#studentService.fetchStudents()
        .pipe(
          map(students => fetchStudentsSuccessAction({ students })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(fetchStudentsFailureAction({ error }));
          })
        ))
    ));

  fetchStudentById$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchStudentByIdAction),
      switchMap(({ actionType, studentId }) =>
        timer(!actionType ? 0 : DEFAULT_WAIT)
          .pipe(
            switchMap(() =>
              zip([
                this.#studentService.fetchStudentById(studentId),
                this.#studentService.hasAssociatedGrades(studentId)
              ])
              .pipe(
                map(([student, hasAssociatedGrades]) => fetchStudentByIdSuccessAction({ actionType, student, hasAssociatedGrades })),
                catchError(httpError => {
                  const error: ServiceError = httpError.error ?? httpError;

                  return of(fetchStudentByIdFailureAction({ actionType, error }));
                })
              ))
        ))
    ));

  fetchStudentsExcludedByTeacher$ = createEffect(() => this.#actions
    .pipe(
      ofType(fetchStudentsExcludedByTeacherAction),
      switchMap(({ actionType, teacherId }) => this.#studentService.fetchStudentsExcludedByTeacher(teacherId)
        .pipe(
          map(students => fetchStudentsExcludedByTeacherSuccessAction({ actionType, students })),
          catchError(httpError => {
            const error: ServiceError = httpError.error ?? httpError;

            return of(fetchStudentsExcludedByTeacherFailureAction({ actionType, error }));
          })
        ))
    ));
}
