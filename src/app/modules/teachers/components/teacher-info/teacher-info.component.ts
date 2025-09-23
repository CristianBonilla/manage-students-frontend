import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { SUBJECT_NAMES_SELECT } from '@modules/teachers/constants/teacher.constants';
import { TeacherSelected, TeachersState } from '@modules/teachers/models/teacher-state';
import { TeacherOperation } from '@modules/teachers/models/teacher.model';
import { fetchTeacherByIdAction, fetchTeachersAction } from '@modules/teachers/store/actions/teacher.actions';
import { getActionSelector, getTeacherSelector } from '@modules/teachers/store/selectors/teacher.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { SubjectNameRequiredSelectionValue } from '@shared/types/teachers.types';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable, of, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { TEACHERS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-teacher-info',
  templateUrl: './teacher-info.component.html',
  styles: ``
})
export class TeacherInfoComponent implements OnInit, AfterViewInit {
  #teacherInfoModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<TeachersState>);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('teacherInfoTemplate')
  readonly teacherInfoTemplate!: TemplateRef<NgbActiveModal>;
  teacherSelected$ = this.#store.select(getTeacherSelector);
  infoActionType$ = this.#store.select(getActionSelector('info'));
  loadingFetchTeacherById$!: Observable<boolean>;
  teacherId!: string;
  teacher!: TeacherSelected;

  get subjectText() {
    const { teacher } = this.teacher;

    return SUBJECT_NAMES_SELECT.find(({ value }) => value === teacher?.subject)?.text ?? 'No tiene asignatura';
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
        } else {
          this.#fetchTeacher();
        }
      });
    this.#teacherInfoModal = this.#modal.open(this.teacherInfoTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#teacherInfoModal.dismiss(null);
  }

  #fetchTeacher() {
    this.#store.dispatch(fetchTeacherByIdAction({ actionType: 'info', teacherId: this.teacherId }));
    this.loadingFetchTeacherById$ = this.infoActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.infoActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.teacherSelected$),
        take(1)
      ).subscribe(([{ error }, teacher]) => {
        if (!error && !!teacher) {
          this.teacher = teacher;
        } else {
          this.#teacherInfoModal.close(null);
          this.#toastr.error(
            'Se presento un error al obtener información del profesor',
            getError(error!)
          );
        }
      });
  }

  #giveBack() {
    this.#router.navigate([ROUTES.MAIN]);
  }

  #actionOnCompletion() {
    this.#teacherInfoModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#textFieldProvider.focus();
        if (state === TeacherOperation.INFO) {
          this.#store.dispatch(fetchTeachersAction());
        }
      });
    this.#teacherInfoModal.hidden
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
          this.#teacherInfoModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
