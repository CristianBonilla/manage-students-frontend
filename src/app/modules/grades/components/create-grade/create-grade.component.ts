import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { selectRequired } from '@helpers/validators/select.validator';
import { GradesState } from '@modules/grades/models/grade-state';
import { GradeOperation, GradeRequest } from '@modules/grades/models/grade.model';
import { addGradeAction, fetchGradesAction } from '@modules/grades/store/actions/grade.actions';
import { getActionSelector } from '@modules/grades/store/selectors/grade.selectors';
import { StudentResponse } from '@modules/students/models/student.model';
import { clearStudentsExcludedByTeacherAction, fetchStudentByIdAction, fetchStudentsExcludedByTeacherAction } from '@modules/students/store/actions/student.actions';
import { getStudentsExcludedSelector } from '@modules/students/store/selectors/students.selectors';
import { SUBJECT_NAMES_SELECT } from '@modules/teachers/constants/teacher.constants';
import { TeacherResponse } from '@modules/teachers/models/teacher.model';
import {
  clearTeachersBySubjectAction,
  fetchTeacherByIdAction,
  fetchTeachersBySubjectAction
} from '@modules/teachers/store/actions/teacher.actions';
import { getTeachersBySubjectSelector } from '@modules/teachers/store/selectors/teacher.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { SubjectNameRequiredSelectionValue, SubjectNameSelectionValue } from '@shared/types/teachers.types';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, Subscription, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { GRADES: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-create-grade',
  templateUrl: './create-grade.component.html',
  styles: ``
})
export class CreateGradeComponent implements AfterViewInit {
  #createGradeModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<GradesState>);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  readonly subjectNames = SUBJECT_NAMES_SELECT;
  @ViewChild('createGradeTemplate')
  readonly createGradeTemplate!: TemplateRef<NgbActiveModal>;
  readonly createGradeForm = this.#formBuilder.nonNullable.group({
    subject: [this.subjectNames[0] as SubjectNameSelectionValue, [selectRequired]],
    teacher: ['', [Validators.required]],
    student: ['', [Validators.required]],
    value: [0, [Validators.required, Validators.min(0), Validators.max(5.0)]]
  });
  createActionType$ = this.#store.select(getActionSelector('create'));
  teachersBySubject$ = this.#store.select(getTeachersBySubjectSelector);
  #teachersBySubjectSubscription!: Subscription;
  studentsExcludedByTeacher$ = this.#store.select(getStudentsExcludedSelector);
  #studentsExcludedByTeacherSubscription!: Subscription;

  get subjectControl() {
    return this.createGradeForm.controls.subject;
  }

  get teacherControl() {
    return this.createGradeForm.controls.teacher;
  }

  get studentControl() {
    return this.createGradeForm.controls.student;
  }

  get valueControl() {
    return this.createGradeForm.controls.value;
  }

  ngOnInit() {
    this.#teachersBySubjectSubscription = this.subjectControl.valueChanges
      .pipe(filter(subject => !!subject.value))
      .subscribe(subject => {
        this.#store.dispatch(fetchTeachersBySubjectAction({ actionType: 'info', subject: (subject as SubjectNameRequiredSelectionValue).value }));
        this.teachersBySubject$
          .pipe(
            filter(teachers => (teachers?.length ?? 0) > 0),
            take(1)
          ).subscribe(teachers => {
            this.teacherControl.patchValue((teachers as TeacherResponse[])[0].teacherId);
          });
      });
    this.#studentsExcludedByTeacherSubscription = this.teacherControl.valueChanges
      .pipe(filter(teacherId => !!teacherId))
      .subscribe(teacherId => {
        this.#store.dispatch(fetchStudentsExcludedByTeacherAction({ actionType: 'info', teacherId: teacherId }));
        this.studentsExcludedByTeacher$
          .pipe(
            filter(students => (students?.length ?? 0) > 0),
            take(1)
          ).subscribe(students => {
            this.studentControl.patchValue((students as StudentResponse[])[0].studentId);
          });
      });
  }

  ngAfterViewInit() {
    this.#createGradeModal = this.#modal.open(this.createGradeTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  ngOnDestroy() {
    this.#teachersBySubjectSubscription.unsubscribe();
    this.#studentsExcludedByTeacherSubscription.unsubscribe();
  }

  dismiss() {
    this.#createGradeModal.dismiss(null);
  }

  createGrade() {
    if (this.createGradeForm.invalid) {
      return;
    }
    const gradeRequest: GradeRequest = {
      teacherId: this.teacherControl.value,
      studentId: this.studentControl.value,
      value: this.valueControl.value
    };
    this.#store.dispatch(addGradeAction({ payload: gradeRequest }));
    this.createActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al crear la calificación',
            getError(error)
          );
        } else {
          this.#toastr.success(
            'Se creó una nueva calificación con éxito'
          );
          this.#createGradeModal.close(GradeOperation.CREATED);
        }
      });
  }

  #actionOnCompletion() {
    this.#createGradeModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#store.dispatch(clearTeachersBySubjectAction());
        this.#store.dispatch(clearStudentsExcludedByTeacherAction());
        this.#textFieldProvider.focus();
        if (state === GradeOperation.CREATED) {
          this.#store.dispatch(fetchStudentByIdAction({ studentId: this.studentControl.value }));
          this.#store.dispatch(fetchTeacherByIdAction({ teacherId: this.teacherControl.value }));
          this.#store.dispatch(fetchGradesAction());
        }
      });
    this.#createGradeModal.hidden
      .pipe(take(1))
      .subscribe(_ => {
        this.#store.dispatch(clearTeachersBySubjectAction());
        this.#store.dispatch(clearStudentsExcludedByTeacherAction());
        this.#textFieldProvider.focus();
        this.#router.navigate([ROUTES.MAIN]);
      });
  }

  #onPopState() {
    this.#router.events
      .pipe(
        withLatestFrom(this.createActionType$),
        filter(([event]) => event instanceof NavigationStart && event.navigationTrigger === 'popstate'),
        take(1)
      ).subscribe(([_, { loading }]) => {
        if (!loading) {
          this.#createGradeModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
