import { Location } from '@angular/common';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GradesState } from '@modules/grades/models/grade-state';
import { GradeOperation, GradeRequest, GradeResponseExtended } from '@modules/grades/models/grade.model';
import { fetchGradeByIdAction, fetchGradesAction, updateGradeAction } from '@modules/grades/store/actions/grade.actions';
import { getActionSelector, getGradeSelector } from '@modules/grades/store/selectors/grade.selectors';
import { fetchStudentByIdAction } from '@modules/students/store/actions/student.actions';
import { SUBJECT_NAMES_SELECT } from '@modules/teachers/constants/teacher.constants';
import { fetchTeacherByIdAction } from '@modules/teachers/store/actions/teacher.actions';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable, of, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { GRADES: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-update-grade',
  templateUrl: './update-grade.component.html',
  styles: ``
})
export class UpdateGradeComponent implements OnInit {
  #updateGradeModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<GradesState>);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  readonly subjectNames = SUBJECT_NAMES_SELECT;
  @ViewChild('updateGradeTemplate')
  readonly updateGradeTemplate!: TemplateRef<NgbActiveModal>;
  readonly updateGradeForm = this.#formBuilder.nonNullable.group({
    subject: ['', [Validators.required]],
    teacher: ['', [Validators.required]],
    student: ['', [Validators.required]],
    value: [0, [Validators.required, Validators.min(0), Validators.max(5.0)]]
  });
  gradeSelected$ = this.#store.select(getGradeSelector);
  updateActionType$ = this.#store.select(getActionSelector('update'));
  loadingFetchGradeById$!: Observable<boolean>;
  gradeId!: string;
  grade!: GradeResponseExtended;

  get subjectControl() {
    return this.updateGradeForm.controls.subject;
  }

  get teacherControl() {
    return this.updateGradeForm.controls.teacher;
  }

  get studentControl() {
    return this.updateGradeForm.controls.student;
  }

  get valueControl() {
    return this.updateGradeForm.controls.value;
  }

  ngOnInit() {
    const { gradeId } = this.#route.snapshot.params;
    this.gradeId = gradeId;
  }

  ngAfterViewInit() {
    if (!this.gradeId?.trim()) {
      this.#giveBack();

      return;
    }
    this.gradeSelected$
      .pipe(take(1))
      .subscribe((selected) => {
        if (selected?.gradeId === this.gradeId) {
          this.loadingFetchGradeById$ = of(false);
          this.grade = selected;
          this.#updateFormFields();
        } else {
          this.#fetchGrade();
        }
      });
    this.#updateGradeModal = this.#modal.open(this.updateGradeTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#updateGradeModal.dismiss(null);
  }

  updateGrade() {
    if (this.updateGradeForm.invalid) {
      return;
    }
    const gradeRequest: GradeRequest = {
      teacherId: this.grade.teacherId,
      studentId: this.grade.studentId,
      value: this.valueControl.value
    };
    this.#store.dispatch(updateGradeAction({ gradeId: this.gradeId, payload: gradeRequest }));
    this.updateActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al actualizar la calificación',
            getError(error)
          );
        } else {
          this.#updateGradeModal.close(GradeOperation.UPDATED);
          this.#toastr.success('Se actualizó la calificación con éxito');
        }
      });
  }

  #fetchGrade() {
    this.#store.dispatch(fetchGradeByIdAction({ actionType: 'update', gradeId: this.gradeId }));
    this.loadingFetchGradeById$ = this.updateActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.updateActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.gradeSelected$),
        take(1)
      ).subscribe(([{ error }, grade]) => {
        if (!error && !!grade) {
          this.grade = grade;
          this.#updateFormFields();
        } else {
          this.#updateGradeModal.close(null);
          this.#toastr.error(
            'Se presento un error al obtener información de la calificación',
            getError(error!)
          );
        }
      });
  }

  #updateFormFields() {
    const { teacher, student } = this.grade;
    const subject = this.subjectNames.find(({ value }) => value === teacher.subject) ?? this.subjectNames[0];
    this.subjectControl.patchValue(subject.text);
    this.teacherControl.patchValue(`${teacher.documentNumber}, ${teacher.firstname} ${teacher.lastname}`);
    this.studentControl.patchValue(`${student.documentNumber}, ${student.firstname} ${student.lastname}`);
    this.valueControl.patchValue(this.grade.value);
    this.subjectControl.disable();
    this.teacherControl.disable();
    this.studentControl.disable();
  }

  #giveBack() {
    this.#router.navigate([ROUTES.MAIN]);
  }

  #actionOnCompletion() {
    this.#updateGradeModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#textFieldProvider.focus();
        if (state === GradeOperation.UPDATED) {
          this.#store.dispatch(fetchStudentByIdAction({ studentId: this.grade.studentId }));
          this.#store.dispatch(fetchTeacherByIdAction({ teacherId: this.grade.teacherId }));
          this.#store.dispatch(fetchGradesAction());
        }
      });
    this.#updateGradeModal.hidden
      .pipe(take(1))
      .subscribe(_ => {
        this.#textFieldProvider.focus();
        this.#router.navigate([ROUTES.MAIN]);
      });
  }

  #onPopState() {
    this.#router.events
      .pipe(
        withLatestFrom(this.updateActionType$),
        filter(([event]) => event instanceof NavigationStart && event.navigationTrigger === 'popstate'),
        take(1)
      ).subscribe(([_, { loading }]) => {
        if (!loading) {
          this.#updateGradeModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
