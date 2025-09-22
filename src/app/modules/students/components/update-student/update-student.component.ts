import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { emailValidator, onlyLetters, onlyNumbers } from '@helpers/validators/formats.validator';
import { StudentOperation, StudentRequest } from '@modules/students/models/student.model';
import { StudentSelected, StudentsState } from '@modules/students/models/students-state';
import { fetchStudentByIdAction, fetchStudentsAction, hasAssociatedGradesByStudentAction, updateStudentAction } from '@modules/students/store/actions/student.actions';
import { getActionSelector, getStudentSelector } from '@modules/students/store/selectors/students.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable, of, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { STUDENTS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-update-student',
  templateUrl: './update-student.component.html',
  styles: ``
})
export class UpdateStudentComponent implements OnInit, AfterViewInit {
  #updateStudentModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<StudentsState>);
  readonly #formBuilder = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('updateStudentTemplate')
  readonly updateStudentTemplate!: TemplateRef<NgbActiveModal>;
  readonly updateStudentForm = this.#formBuilder.nonNullable.group({
    documentNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), onlyNumbers]],
    mobile: ['', [Validators.required, Validators.minLength(10), onlyNumbers]],
    firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLetters]],
    email: ['', [Validators.required, emailValidator]]
  });
  studentSelected$ = this.#store.select(getStudentSelector);
  updateActionType$ = this.#store.select(getActionSelector('update'));
  loadingFetchStudentById$!: Observable<boolean>;
  studentId!: string;
  student!: StudentSelected;

  get documentNumberControl() {
    return this.updateStudentForm.controls.documentNumber;
  }

  get mobileControl() {
    return this.updateStudentForm.controls.mobile;
  }

  get firstnameControl() {
    return this.updateStudentForm.controls.firstname;
  }

  get lastnameControl() {
    return this.updateStudentForm.controls.lastname;
  }

  get emailControl() {
    return this.updateStudentForm.controls.email;
  }

  ngOnInit() {
    const { studentId } = this.#route.snapshot.params;
    this.studentId = studentId;
  }

  ngAfterViewInit() {
    if (!this.studentId?.trim()) {
      this.#giveBack();

      return;
    }
    this.studentSelected$
      .pipe(take(1))
      .subscribe((selected) => {
        if (selected?.student.studentId === this.studentId) {
          this.loadingFetchStudentById$ = of(false);
          this.student = selected;
          if (selected.hasAssociatedGrades === null) {
            this.#store.dispatch(hasAssociatedGradesByStudentAction({ actionType: 'update', studentId: this.studentId }));
          }
          this.#updateFormFields();
        } else {
          this.#fetchStudent();
        }
      });
    this.#updateStudentModal = this.#modal.open(this.updateStudentTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#updateStudentModal.dismiss(null);
  }

  updateStudent() {
    if (this.updateStudentForm.invalid) {
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
    this.#store.dispatch(updateStudentAction({ studentId: this.studentId, payload: studentRequest }));
    this.updateActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al actualizar estudiante',
            getError(error)
          );
        } else {
          this.#toastr.success(
            'Se actualizó el estudiante con éxito',
            `Número de identificación: ${documentNumber}`
          );
          this.#updateStudentModal.close(StudentOperation.UPDATED);
        }
      });
  }

  #fetchStudent() {
    this.#store.dispatch(fetchStudentByIdAction({ actionType: 'update', studentId: this.studentId }));
    this.loadingFetchStudentById$ = this.updateActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.updateActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.studentSelected$),
        take(1)
      ).subscribe(([{ error }, student]) => {
        if (!error && !!student) {
          this.student = student;
          this.#store.dispatch(hasAssociatedGradesByStudentAction({ actionType: 'update', studentId: this.studentId }));
          this.#updateFormFields();
        } else {
          this.#updateStudentModal.close(null);
          this.#giveBack();
          this.#toastr.error(
            'Se presento un error al obtener información del estudiante',
            getError(error!)
          );
        }
      });
  }

  #updateFormFields() {
    const { student } = this.student;
    this.documentNumberControl.patchValue(student.documentNumber);
    this.mobileControl.patchValue(student.mobile);
    this.firstnameControl.patchValue(student.firstname);
    this.lastnameControl.patchValue(student.lastname);
    this.emailControl.patchValue(student.email);
  }

  #giveBack() {
    this.#router.navigate([ROUTES.MAIN]);
  }

  #actionOnCompletion() {
    this.#updateStudentModal.closed
      .pipe(
        filter<StudentOperation>(state => state === StudentOperation.UPDATED),
        take(1)
      ).subscribe(_ => {
        this.#textFieldProvider.focus();
        this.#store.dispatch(fetchStudentsAction());
      });
    this.#updateStudentModal.hidden
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
          this.#updateStudentModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
