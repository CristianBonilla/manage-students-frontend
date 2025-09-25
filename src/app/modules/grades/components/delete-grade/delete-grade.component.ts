import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GradesState } from '@modules/grades/models/grade-state';
import { GradeOperation, GradeResponseExtended } from '@modules/grades/models/grade.model';
import { deleteGradeAction, fetchGradeByIdAction, fetchGradesAction } from '@modules/grades/store/actions/grade.actions';
import { getActionSelector, getGradeSelector } from '@modules/grades/store/selectors/grade.selectors';
import { clearStudentSelectedAction } from '@modules/students/store/actions/student.actions';
import { clearTeacherSelectedAction } from '@modules/teachers/store/actions/teacher.actions';
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
  selector: 'msf-delete-grade',
  templateUrl: './delete-grade.component.html',
  styles: ``
})
export class DeleteGradeComponent implements OnInit, AfterViewInit {
  #deleteGradeModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<GradesState>);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('deleteGradeTemplate')
  readonly deleteGradeTemplate!: TemplateRef<NgbActiveModal>;
  gradeSelected$ = this.#store.select(getGradeSelector);
  deleteActionType$ = this.#store.select(getActionSelector('delete'));
  loadingFetchGradeById$!: Observable<boolean>;
  gradeId!: string;
  grade!: GradeResponseExtended;

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
        } else {
          this.#fetchGrade();
        }
      });
    this.#deleteGradeModal = this.#modal.open(this.deleteGradeTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#deleteGradeModal.dismiss(null);
  }

  deleteGrade() {
    this.#store.dispatch(deleteGradeAction({ gradeId: this.gradeId }));
    this.deleteActionType$
      .pipe(
        filter(({ loading }) => !loading),
        take(1)
      ).subscribe(({ error }) => {
        if (error !== null) {
          this.#toastr.error(
            'Se presento un error al eliminar la calificación',
            getError(error)
          );
        } else {
          this.#deleteGradeModal.close(GradeOperation.DELETED);
          this.#toastr.success('Se eliminó la calificación con éxito');
        }
      });
  }

  #fetchGrade() {
    this.#store.dispatch(fetchGradeByIdAction({ actionType: 'delete', gradeId: this.gradeId }));
    this.loadingFetchGradeById$ = this.deleteActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.deleteActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.gradeSelected$),
        take(1)
      ).subscribe(([{ error }, grade]) => {
        if (!error && !!grade) {
          this.grade = grade;
        } else {
          this.#deleteGradeModal.close(null);
          this.#toastr.error(
            'Se presento un error al obtener información de la calificación',
            getError(error!)
          );
        }
      });
  }

  #giveBack() {
    this.#router.navigate([ROUTES.MAIN]);
  }

  #actionOnCompletion() {
    this.#deleteGradeModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#textFieldProvider.focus();
        if (state === GradeOperation.DELETED) {
          this.#store.dispatch(clearTeacherSelectedAction());
          this.#store.dispatch(clearStudentSelectedAction());
          this.#store.dispatch(fetchGradesAction());
        }
      });
    this.#deleteGradeModal.hidden
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
          this.#deleteGradeModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
