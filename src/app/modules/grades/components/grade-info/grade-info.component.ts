import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { GradesState } from '@modules/grades/models/grade-state';
import { GradeOperation, GradeResponseExtended } from '@modules/grades/models/grade.model';
import { fetchGradeByIdAction, fetchGradesAction } from '@modules/grades/store/actions/grade.actions';
import { getActionSelector, getGradeSelector } from '@modules/grades/store/selectors/grade.selectors';
import { SUBJECT_NAMES_SELECT } from '@modules/teachers/constants/teacher.constants';
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
  selector: 'msf-grade-info',
  templateUrl: './grade-info.component.html',
  styles: ``
})
export class GradeInfoComponent implements OnInit, AfterViewInit {
  #gradeInfoModal!: NgbModalRef;
  readonly #modal = inject(NgbModal);
  readonly #store = inject(Store<GradesState>);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #location = inject(Location);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  @ViewChild('gradeInfoTemplate')
  readonly gradeInfoTemplate!: TemplateRef<NgbActiveModal>;
  gradeSelected$ = this.#store.select(getGradeSelector);
  infoActionType$ = this.#store.select(getActionSelector('info'));
  loadingFetchGradeById$!: Observable<boolean>;
  gradeId!: string;
  grade!: GradeResponseExtended;

  get subjectText() {
    const { teacher } = this.grade;

    return SUBJECT_NAMES_SELECT.find(({ value }) => value === teacher?.subject)?.text ?? 'No tiene asignatura';
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
        } else {
          this.#fetchGrade();
        }
      });
    this.#gradeInfoModal = this.#modal.open(this.gradeInfoTemplate, DEFAULT_MODAL_OPTIONS);
    this.#actionOnCompletion();
    this.#onPopState();
  }

  dismiss() {
    this.#gradeInfoModal.dismiss(null);
  }

  #fetchGrade() {
    this.#store.dispatch(fetchGradeByIdAction({ actionType: 'info', gradeId: this.gradeId }));
    this.loadingFetchGradeById$ = this.infoActionType$
      .pipe(
        map(({ loading }) => loading),
        take(2)
      );
    this.infoActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.gradeSelected$),
        take(1)
      ).subscribe(([{ error }, grade]) => {
        if (!error && !!grade) {
          this.grade = grade;
        } else {
          this.#gradeInfoModal.close(null);
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
    this.#gradeInfoModal.closed
      .pipe(take(1))
      .subscribe(state => {
        this.#textFieldProvider.focus();
        if (state === GradeOperation.INFO) {
          this.#store.dispatch(fetchGradesAction());
        }
      });
    this.#gradeInfoModal.hidden
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
          this.#gradeInfoModal.close(null);
        } else {
          this.#router.navigateByUrl(this.#router.url);
          this.#location.go(this.#router.url);
        }
      });
  }
}
