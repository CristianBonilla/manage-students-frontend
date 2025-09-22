import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { emailValidator, onlyLetters, onlyNumbers } from '@helpers/validators/formats.validator';
import { StudentOperation, StudentRequest } from '@modules/students/models/student.model';
import { StudentsState } from '@modules/students/models/students-state';
import { addStudentAction, fetchStudentsAction } from '@modules/students/store/actions/student.actions';
import { getActionSelector } from '@modules/students/store/selectors/students.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { STUDENTS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-create-student',
  templateUrl: './create-student.component.html',
  styles: ``
})
export class CreateStudentComponent implements AfterViewInit {
  #createStudentModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<StudentsState>);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('createStudentTemplate')
  readonly createStudentTemplate!: TemplateRef<NgbActiveModal>;
  readonly createStudentForm = this.#formBuilder.nonNullable.group({
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), onlyNumbers]],
    mobile: ['', [Validators.required, Validators.minLength(10), onlyNumbers]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    email: ['', [Validators.required, emailValidator]]
  });
  createActionType$ = this.#store.select(getActionSelector('create'));

  get documentNumberControl() {
    return this.createStudentForm.controls.documentNumber;
  }

  get mobileControl() {
    return this.createStudentForm.controls.mobile;
  }

  get firstnameControl() {
    return this.createStudentForm.controls.firstname;
  }

  get lastnameControl() {
    return this.createStudentForm.controls.lastname;
  }

  get emailControl() {
    return this.createStudentForm.controls.email;
  }

  ngAfterViewInit() {
    this.#createStudentModal = this.#modal.open(this.createStudentTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#createStudentModal.dismiss(null);
  }

  createStudent() {
    if (this.createStudentForm.invalid) {
      return;
    }
    const documentNumber = this.documentNumberControl.value;
    const studentRequest: StudentRequest = {
      documentNumber,
      mobile: this.mobileControl.value,
      firstname: this.firstnameControl.value,
      lastname: this.lastnameControl.value,
      email: this.emailControl.value
    };
    this.#store.dispatch(addStudentAction({ payload: studentRequest }));
    this.createActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al crear estudiante',
            getError(error)
          );
        } else {
          this.#toastr.success(
            'Se creó un nuevo estudiante con éxito',
            `Número de identificación: ${documentNumber}`
          );
          this.#createStudentModal.close(StudentOperation.CREATED);
        }
      });
  }

  #actionOnCompletion() {
    this.#createStudentModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#textFieldProvider.focus();
        if (state === StudentOperation.CREATED) {
          this.#store.dispatch(fetchStudentsAction());
        }
      });
    this.#createStudentModal.hidden
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
          this.#createStudentModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
