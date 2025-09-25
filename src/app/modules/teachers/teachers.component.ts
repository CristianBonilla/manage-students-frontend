import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TeachersState } from '@modules/teachers/models/teacher-state';
import { TeacherResponse } from '@modules/teachers/models/teacher.model';
import { fetchTeachersAction } from '@modules/teachers/store/actions/teacher.actions';
import {
  getActionSelector,
  getTeachersLengthSelector,
  paginateTeachersSelector
} from '@modules/teachers/store/selectors/teacher.selectors';
import { Store } from '@ngrx/store';
import { TEXT_FIELD } from '@shared/providers/text-field.provider';
import { getError } from '@shared/utils/service-error.util';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, startWith, Subscription, take, withLatestFrom } from 'rxjs';
import { APP_ROUTES } from 'src/app/models/routes';
import { DEFAULT_SCROLLBAR_OPTIONS, ScrollbarOptions } from 'src/app/models/scrollbar';

const { HOME: { TEACHERS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-teachers',
  templateUrl: './teachers.component.html',
  styles: ``
})
export class TeachersComponent implements OnInit, OnDestroy {
  readonly #store = inject(Store<TeachersState>);
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
  teachers$!: Observable<TeacherResponse[] | null>;
  teachersLength$!: Observable<number>;
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
    this.#store.dispatch(fetchTeachersAction());
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
        this.#loadTeachers();
      });
    this.pageSizeItemsSubscription = this.pageSizeItemsControl.valueChanges
      .subscribe(_pageSize => {
        this.#loadTeachers();
      });
    this.generalActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.teachersLength$),
        take(1)
      ).subscribe(([{ error }, length]) => {
        if (error === null) {
          this.#toastr.success(`Se cargaron '${length}' profesores con éxito`);
        } else {
          this.#toastr.error(
            'Se presento un error al obtener el listado de profesores',
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

  trackByTeachers(index: number, teacher: TeacherResponse) {
    return `${index}-${teacher.teacherId}`;
  }

  refreshTeachers$(text: string | null = null) {
    return this.#store.select(paginateTeachersSelector(text ?? this.textControl.value, this.page, this.pageSize));
  }

  #loadTeachers() {
    const text = this.textControl.value;
    this.page = 1;
    this.pageSize = this.pageSizeItemsControl.value;
    this.teachers$ = this.refreshTeachers$(text);
    this.teachersLength$ = this.#store.select(getTeachersLengthSelector(text));
  }
}
