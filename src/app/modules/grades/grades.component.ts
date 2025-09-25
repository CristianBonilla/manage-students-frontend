import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GradesState } from '@modules/grades/models/grade-state';
import { GradeResponse, GradeResponseExtended } from '@modules/grades/models/grade.model';
import { fetchGradesAction } from '@modules/grades/store/actions/grade.actions';
import {
  getActionSelector,
  getGradesLengthSelector,
  paginateGradesSelector
} from '@modules/grades/store/selectors/grade.selectors';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, startWith, Subscription, take, withLatestFrom } from 'rxjs';
import { APP_ROUTES } from 'src/app/models/routes';
import { DEFAULT_SCROLLBAR_OPTIONS, ScrollbarOptions } from 'src/app/models/scrollbar';

const { HOME: { GRADES: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-grades',
  templateUrl: './grades.component.html',
  styles: ``
})
export class GradesComponent implements OnInit, OnDestroy {
  readonly #store = inject(Store<GradesState>);
  readonly #toastr = inject(ToastrService);
  readonly #textFieldProvider = inject(TEXT_FIELD);
  readonly scrollbarOptions: ScrollbarOptions = {
    ...DEFAULT_SCROLLBAR_OPTIONS,
    overflow: {
      y: 'visible-hidden'
    }
  };
  readonly ROUTES = ROUTES;
  readonly textControl = new FormControl('', { nonNullable: true });
  readonly pageSizeItemsControl = new FormControl(6, { nonNullable: true });
  grades$!: Observable<GradeResponseExtended[] | null>;
  gradesLength$!: Observable<number>;
  page!: number;
  pageSize!: number;
  pageSizeItems = [2, 4, 6, 8];
  textSubscription!: Subscription;
  pageSizeItemsSubscription!: Subscription;
  generalActionTypeSubscription!: Subscription;
  generalActionType$ = this.#store.select(getActionSelector('general'));
  @ViewChild('text')
  readonly textRef!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.#store.dispatch(fetchGradesAction());
    this.generalActionTypeSubscription = this.generalActionType$
      .subscribe(({ loading, error }) => {
        if (!loading && error === null) {
          this.textControl.enable();
        } else {
          this.textControl.disable();
        }
      });
    this.textSubscription = this.textControl.valueChanges
      .pipe(startWith(''))
      .subscribe(_text => {
        this.#loadGrades();
      });
    this.pageSizeItemsSubscription = this.pageSizeItemsControl.valueChanges
      .subscribe(_pageSize => {
        this.#loadGrades();
      });
    this.generalActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.gradesLength$),
        take(1)
      ).subscribe(([{ error }, length]) => {
        if (error === null) {
          this.#toastr.success(`Se cargaron '${length}' calificaciones con éxito`);
        } else {
          this.#toastr.error(
            'Se presento un error al obtener el listado de calificaciones',
            getError(error)
          );
        }
      });
  }

  ngAfterViewInit() {
    this.#textFieldProvider.add({
      control: this.textControl,
      $text: this.textRef.nativeElement
    });
    this.#textFieldProvider.focus();
  }

  ngOnDestroy() {
    this.generalActionTypeSubscription.unsubscribe();
    this.textSubscription.unsubscribe();
    this.pageSizeItemsSubscription.unsubscribe();
  }

  trackByGrades(index: number, grade: GradeResponse) {
    return `${index}-${grade.gradeId}`;
  }

  refreshGrades$(text: string | null = null) {
    return this.#store.select(paginateGradesSelector(text ?? this.textControl.value, this.page, this.pageSize));
  }

  #loadGrades() {
    const text = this.textControl.value;
    this.page = 1;
    this.pageSize = this.pageSizeItemsControl.value;
    this.grades$ = this.refreshGrades$(text);
    this.gradesLength$ = this.#store.select(getGradesLengthSelector(text));
  }
}
