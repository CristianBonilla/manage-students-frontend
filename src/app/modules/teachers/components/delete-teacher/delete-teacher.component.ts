import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { TeacherSelected, TeachersState } from '@modules/teachers/models/teacher-state';
import { TeacherOperation } from '@modules/teachers/models/teacher.model';
import { deleteTeacherAction, fetchTeacherByIdAction } from '@modules/teachers/store/actions/teacher.actions';
import { getActionSelector, getTeacherSelector } from '@modules/teachers/store/selectors/teacher.selectors';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable, of, take, withLatestFrom } from 'rxjs';
import { DEFAULT_MODAL_OPTIONS } from 'src/app/models/modal';
import { APP_ROUTES } from 'src/app/models/routes';

const { HOME: { TEACHERS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-delete-teacher',
  templateUrl: './delete-teacher.component.html',
  styles: ``
})
export class DeleteTeacherComponent implements OnInit, AfterViewInit {
  #deleteTeacherModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<TeachersState>);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('deleteTeacherTemplate')
  readonly deleteTeacherTemplate!: TemplateRef<NgbActiveModal>;
  teacherSelected$ = this.#store.select(getTeacherSelector);
  deleteActionType$ = this.#store.select(getActionSelector('delete'));
  loadingFetchTeacherById$!: Observable<boolean>;
  teacherId!: string;
  teacher!: TeacherSelected;

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
    this.#deleteTeacherModal = this.#modal.open(this.deleteTeacherTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#deleteTeacherModal.dismiss(null);
  }

  deleteTeacher() {
    const { documentNumber } = this.teacher.teacher;
    this.#store.dispatch(deleteTeacherAction({ teacherId: this.teacherId }));
    this.deleteActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al eliminar profesor',
            getError(error)
          );
        } else {
          this.#deleteTeacherModal.close(TeacherOperation.DELETED);
          this.#toastr.success(
            'Se eliminó el profesor con éxito',
            `Número de identificación: ${documentNumber}`
          );
        }
      });
  }

  #fetchTeacher() {
    this.#store.dispatch(fetchTeacherByIdAction({ actionType: 'delete', teacherId: this.teacherId }));
    this.loadingFetchTeacherById$ = this.deleteActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.deleteActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.teacherSelected$),
        take(1)
      ).subscribe(([{ error }, teacher]) => {
        if (!error && !!teacher) {
          this.teacher = teacher;
        } else {
          this.#deleteTeacherModal.close(null);
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
    this.#deleteTeacherModal.closed
      .pipe(take(1))
      .subscribe(_state => {
        this.#textFieldProvider.focus();
      });
    this.#deleteTeacherModal.hidden
      .pipe(take(1))
      .subscribe(_ => {
        this.#textFieldProvider.focus();
        this.#router.navigate([ROUTES.MAIN]);
      });
  }

  #onPopState() {
    this.#router.events
      .pipe(
        withLatestFrom(this.deleteActionType$),
        filter(([event]) => event instanceof NavigationStart && event.navigationTrigger === 'popstate'),
        take(1)
      ).subscribe(([_, { loading }]) => {
        if (!loading) {
          this.#deleteTeacherModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
