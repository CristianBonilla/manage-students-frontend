import { StudentActions, StudentsState } from '@modules/students/models/students-state';
import { studentsFeatureKey } from '@modules/students/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const studentsRootSelector = createFeatureSelector<StudentsState>(studentsFeatureKey);

export const getStudentsSelector = createSelector(studentsRootSelector, state => state.students);

export const getStudentSelector = createSelector(studentsRootSelector, state => state.studentSelected);

export const getStudentsExcludedSelector = createSelector(studentsRootSelector, state => state.studentsExcluded);

export const getActionSelector = (action: keyof StudentActions) => createSelector(
  studentsRootSelector,
  state => state.actions[action]
);

export const filterStudentsSelector = (text: string) => createSelector(
  getStudentsSelector,
  students => students?.filter(student =>
    Object.values(student).some(value =>
      String(value).toLowerCase().includes(text.toLowerCase().trim())
    )
  ) ?? null
);

export const paginateStudentsSelector = (text: string, page: number, pageSize: number) => createSelector(
  filterStudentsSelector(text),
  students => students?.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  ) ?? null
);

export const getStudentsLengthSelector = (text = '') => createSelector(
  filterStudentsSelector(text),
  students => students?.length ?? 0
);
