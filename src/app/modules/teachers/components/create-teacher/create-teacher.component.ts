import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { emailValidator, onlyLetters, onlyNumbers } from '@helpers/validators/formats.validator';
import { selectRequired } from '@helpers/validators/select.validator';
import { SUBJECT_NAMES_SELECT } from '@modules/teachers/constants/teacher.constants';
import { TeachersState } from '@modules/teachers/models/teacher-state';
import { TeacherOperation, TeacherRequest } from '@modules/teachers/models/teacher.model';
import { addTeacherAction } from '@modules/teachers/store/actions/teacher.actions';
import { getActionSelector } from '@modules/teachers/store/selectors/teacher.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { SubjectNameRequiredSelectionValue, SubjectNameSelectionValue } from '@shared/types/teachers.types';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { TEACHERS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-create-teacher',
  templateUrl: './create-teacher.component.html',
  styles: ``
})
export class CreateTeacherComponent implements AfterViewInit {
  #createTeacherModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<TeachersState>);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  readonly subjectNames = SUBJECT_NAMES_SELECT;
  @ViewChild('createTeacherTemplate')
  readonly createTeacherTemplate!: TemplateRef<NgbActiveModal>;
  readonly createTeacherForm = this.#formBuilder.nonNullable.group({
    subject: [this.subjectNames[0] as SubjectNameSelectionValue, [selectRequired]],
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), onlyNumbers]],
    mobile: ['', [Validators.required, Validators.minLength(10), onlyNumbers]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    email: ['', [Validators.required, emailValidator]]
  });
  createActionType$ = this.#store.select(getActionSelector('create'));

  get subjectControl() {
    return this.createTeacherForm.controls.subject;
  }

  get documentNumberControl() {
    return this.createTeacherForm.controls.documentNumber;
  }

  get mobileControl() {
    return this.createTeacherForm.controls.mobile;
  }

  get firstnameControl() {
    return this.createTeacherForm.controls.firstname;
  }

  get lastnameControl() {
    return this.createTeacherForm.controls.lastname;
  }

  get emailControl() {
    return this.createTeacherForm.controls.email;
  }

  ngAfterViewInit() {
    this.#createTeacherModal = this.#modal.open(this.createTeacherTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#createTeacherModal.dismiss(null);
  }

  createTeacher() {
    if (this.createTeacherForm.invalid) {
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
    this.#store.dispatch(addTeacherAction({ payload: teacherRequest }));
    this.createActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al crear profesor',
            getError(error)
          );
        } else {
          this.#toastr.success(
            'Se creó un nuevo profesor con éxito',
            `Número de identificación: ${documentNumber}`
          );
          this.#createTeacherModal.close(TeacherOperation.CREATED);
        }
      });
  }

  #actionOnCompletion() {
    this.#createTeacherModal.closed
      .pipe(take(1))
      .subscribe(_state => {
        this.#textFieldProvider.focus();
      });
    this.#createTeacherModal.hidden
      .pipe(take(1))
      .subscribe(_ => {
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
          this.#createTeacherModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
