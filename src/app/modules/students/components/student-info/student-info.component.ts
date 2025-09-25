import { Location } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { StudentOperation } from '@modules/students/models/student.model';
import { StudentSelected, StudentsState } from '@modules/students/models/students-state';
import { fetchStudentByIdAction, fetchStudentsAction } from '@modules/students/store/actions/student.actions';
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
  selector: 'msf-student-info',
  templateUrl: './student-info.component.html',
  styles: ``
})
export class StudentInfoComponent {
  #studentInfoModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<StudentsState>);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('studentInfoTemplate')
  readonly studentInfoTemplate!: TemplateRef<NgbActiveModal>;
  studentSelected$ = this.#store.select(getStudentSelector);
  infoActionType$ = this.#store.select(getActionSelector('info'));
  loadingFetchStudentById$!: Observable<boolean>;
  studentId!: string;
  student!: StudentSelected;

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
        } else {
          this.#fetchStudent();
        }
      });
    this.#studentInfoModal = this.#modal.open(this.studentInfoTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#studentInfoModal.dismiss(null);
  }

  #fetchStudent() {
    this.#store.dispatch(fetchStudentByIdAction({ actionType: 'info', studentId: this.studentId }));
    this.loadingFetchStudentById$ = this.infoActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.infoActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.studentSelected$),
        take(1)
      ).subscribe(([{ error }, student]) => {
        if (!error && !!student) {
          this.student = student;
        } else {
          this.#studentInfoModal.close(null);
          this.#toastr.error(
            'Se presento un error al obtener información del estudiante',
            getError(error!)
          );
        }
      });
  }

  #giveBack() {
    this.#router.navigate([ROUTES.MAIN]);
  }

  #actionOnCompletion() {
    this.#studentInfoModal.closed
      .pipe(take(1))
      .subscribe(_state => {
        this.#textFieldProvider.focus();
      });
    this.#studentInfoModal.hidden
      .pipe(take(1))
      .subscribe(_ => {
        this.#textFieldProvider.focus();
        this.#router.navigate([ROUTES.MAIN]);
      });
  }

  #onPopState() {
    this.#router.events
      .pipe(
        withLatestFrom(this.infoActionType$),
        filter(([event]) => event instanceof NavigationStart && event.navigationTrigger === 'popstate'),
        take(1)
      ).subscribe(([_, { loading }]) => {
        if (!loading) {
          this.#studentInfoModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
