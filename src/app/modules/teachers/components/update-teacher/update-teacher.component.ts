import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { emailValidator, onlyLetters, onlyNumbers } from '@helpers/validators/formats.validator';
import { selectRequired } from '@helpers/validators/select.validator';
import { SUBJECT_NAMES_SELECT } from '@modules/teachers/constants/teacher.constants';
import { TeacherSelected, TeachersState } from '@modules/teachers/models/teacher-state';
import { TeacherOperation, TeacherRequest } from '@modules/teachers/models/teacher.model';
import { fetchTeacherByIdAction, fetchTeachersAction, updateTeacherAction } from '@modules/teachers/store/actions/teacher.actions';
import { getActionSelector, getTeacherSelector } from '@modules/teachers/store/selectors/teacher.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { SubjectNameRequiredSelectionValue, SubjectNameSelectionValue } from '@shared/types/teachers.types';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable, of, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { TEACHERS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-update-teacher',
  templateUrl: './update-teacher.component.html',
  styles: ``
})
export class UpdateTeacherComponent implements OnInit, AfterViewInit {
  #updateTeacherModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<TeachersState>);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  readonly subjectNames = SUBJECT_NAMES_SELECT;
  @ViewChild('updateTeacherTemplate')
  readonly updateTeacherTemplate!: TemplateRef<NgbActiveModal>;
  readonly updateTeacherForm = this.#formBuilder.nonNullable.group({
    subject: [this.subjectNames[0] as SubjectNameSelectionValue, [selectRequired]],
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), onlyNumbers]],
    mobile: ['', [Validators.required, Validators.minLength(10), onlyNumbers]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    email: ['', [Validators.required, emailValidator]]
  });
  teacherSelected$ = this.#store.select(getTeacherSelector);
  updateActionType$ = this.#store.select(getActionSelector('update'));
  loadingFetchTeacherById$!: Observable<boolean>;
  teacherId!: string;
  teacher!: TeacherSelected;

  get subjectControl() {
    return this.updateTeacherForm.controls.subject;
  }

  get documentNumberControl() {
    return this.updateTeacherForm.controls.documentNumber;
  }

  get mobileControl() {
    return this.updateTeacherForm.controls.mobile;
  }

  get firstnameControl() {
    return this.updateTeacherForm.controls.firstname;
  }

  get lastnameControl() {
    return this.updateTeacherForm.controls.lastname;
  }

  get emailControl() {
    return this.updateTeacherForm.controls.email;
  }

  ngOnInit() {
    const { teacherId } = this.#route.snapshot.params;
    this.teacherId = teacherId;
  }

  ngAfterViewInit() {
    if (!this.teacherId?.trim()) {
      this.#giveBack();

      return;
    }
    this.teacherSelected$
      .pipe(take(1))
      .subscribe((selected) => {
        if (selected?.teacher.teacherId === this.teacherId) {
          this.loadingFetchTeacherById$ = of(false);
          this.teacher = selected;
          this.#updateFormFields();
        } else {
          this.#fetchTeacher();
        }
      });
    this.#updateTeacherModal = this.#modal.open(this.updateTeacherTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#updateTeacherModal.dismiss(null);
  }

  updateTeacher() {
    if (this.updateTeacherForm.invalid) {
      return;
    }
    const subject = this.subjectControl.value as SubjectNameRequiredSelectionValue;
    const documentNumber = this.documentNumberControl.value;
    const teacherRequest: TeacherRequest = {
      subject: subject.value,
      documentNumber,
      mobile: this.mobileControl.value,
      firstname: this.firstnameControl.value,
      lastname: this.lastnameControl.value,
      email: this.emailControl.value
    };
    this.#store.dispatch(updateTeacherAction({ teacherId: this.teacherId, payload: teacherRequest }));
    this.updateActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al actualizar profesor',
            getError(error)
          );
        } else {
          this.#updateTeacherModal.close(TeacherOperation.UPDATED);
          this.#toastr.success(
            'Se actualizó el profesor con éxito',
            `Número de identificación: ${documentNumber}`
          );
        }
      });
  }

  #fetchTeacher() {
    this.#store.dispatch(fetchTeacherByIdAction({ actionType: 'update', teacherId: this.teacherId }));
    this.loadingFetchTeacherById$ = this.updateActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.updateActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.teacherSelected$),
        take(1)
      ).subscribe(([{ error }, teacher]) => {
        if (!error && !!teacher) {
          this.teacher = teacher;
          this.#updateFormFields();
        } else {
          this.#updateTeacherModal.close(null);
          this.#toastr.error(
            'Se presento un error al obtener información del profesor',
            getError(error!)
          );
        }
      });
  }

  #updateFormFields() {
    const { teacher } = this.teacher;
    const subject = this.subjectNames.find(({ value }) => value === teacher.subject) ?? this.subjectNames[0];
    this.subjectControl.patchValue(subject);
    this.documentNumberControl.patchValue(teacher.documentNumber);
    this.mobileControl.patchValue(teacher.mobile);
    this.firstnameControl.patchValue(teacher.firstname);
    this.lastnameControl.patchValue(teacher.lastname);
    this.emailControl.patchValue(teacher.email);
  }

  #giveBack() {
    this.#router.navigate([ROUTES.MAIN]);
  }

  #actionOnCompletion() {
    this.#updateTeacherModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#textFieldProvider.focus();
        if (state === TeacherOperation.UPDATED) {
          this.#store.dispatch(fetchTeachersAction());
        }
      });
    this.#updateTeacherModal.hidden
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
          this.#updateTeacherModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
