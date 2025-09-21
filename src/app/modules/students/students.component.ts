import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StudentsState } from '@modules/students/models/students-state';
import { fetchStudentsAction } from '@modules/students/store/actions/student.actions';
import {
  getActionSelector,
  getStudentsLengthSelector,
  paginateStudentsSelector
} from '@modules/students/store/selectors/students.selectors';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { filter, Observable, startWith, Subscription, take, withLatestFrom } from 'rxjs';
import { APP_ROUTES } from 'src/app/models/routes';
import { DEFAULT_SCROLLBAR_OPTIONS, ScrollbarOptions } from 'src/app/models/scrollbar';
import { StudentResponse } from './models/student.model';

const { HOME: { STUDENTS: ROUTES } } = APP_ROUTES;

@Component({
  selector: 'msf-students',
  templateUrl: './students.component.html',
  styles: ``
})
export class StudentsComponent implements OnInit, OnDestroy {
  readonly #store = inject(Store<StudentsState>);
  readonly #toastr = inject(ToastrService);
  readonly scrollbarOptions: ScrollbarOptions = {
    ...DEFAULT_SCROLLBAR_OPTIONS,
    overflow: {
      y: 'visible-hidden'
    }
  };
  readonly ROUTES = ROUTES;
  readonly textControl = new FormControl('', { nonNullable: true });
  readonly pageSizeItemsControl = new FormControl(6, { nonNullable: true });
  students$!: Observable<StudentResponse[] | null>;
  studentsLength$!: Observable<number>;
  page!: number;
  pageSize!: number;
  pageSizeItems = [2, 4, 6, 8];
  textSubscription!: Subscription;
  pageSizeItemsSubscription!: Subscription;
  generalActionTypeSubscription!: Subscription;
  generalActionType$ = this.#store.select(getActionSelector('general'));

  ngOnInit() {
    this.#store.dispatch(fetchStudentsAction());
    this.generalActionTypeSubscription = this.generalActionType$
      .subscribe(({ loading, error }) => {
        if (loading || error !== null) {
          this.textControl.disable();
        } else {
          this.textControl.enable();
        }
        this.textControl.patchValue('');
      });
    this.textSubscription = this.textControl.valueChanges
      .pipe(startWith(''))
      .subscribe(_text => {
        this.#loadStudents();
      });
    this.pageSizeItemsSubscription = this.pageSizeItemsControl.valueChanges
      .subscribe(_pageSize => {
        this.#loadStudents();
      });
    this.generalActionType$
      .pipe(
        filter(({ loading }) => !loading),
        withLatestFrom(this.studentsLength$),
        take(1)
      ).subscribe(([{ error }, length]) => {
        if (error === null) {
          this.#toastr.success(`Se cargaron '${length}' estudiantes con éxito`);
        } else {
          this.#toastr.error(
            'Se presento un error al obtener el listado de estudiantes',
            error.errors[0]
          );
        }
      });
  }

  ngOnDestroy() {
    this.generalActionTypeSubscription.unsubscribe();
    this.textSubscription.unsubscribe();
    this.pageSizeItemsSubscription.unsubscribe();
  }

  trackByStudents(index: number, student: StudentResponse) {
    return `${index}-${student.studentId}`;
  }

  refreshStudents$(text: string | null = null) {
    return this.#store.select(paginateStudentsSelector(text ?? this.textControl.value, this.page, this.pageSize));
  }

  #loadStudents() {
    const text = this.textControl.value;
    this.page = 1;
    this.pageSize = this.pageSizeItemsControl.value;
    this.students$ = this.refreshStudents$(text);
    this.studentsLength$ = this.#store.select(getStudentsLengthSelector(text));
  }
}
