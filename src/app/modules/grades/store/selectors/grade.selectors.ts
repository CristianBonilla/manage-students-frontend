import { GradeActions, GradesState } from '@modules/grades/models/grade-state';
import { gradesFeatureKey } from '@modules/grades/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const gradesRootSelector = createFeatureSelector<GradesState>(gradesFeatureKey);

export const getGradesSelector = createSelector(gradesRootSelector, state => state.grades);

export const getGradeSelector = createSelector(gradesRootSelector, state => state.gradeSelected);

export const getActionSelector = (action: keyof GradeActions) => createSelector(
  gradesRootSelector,
  state => state.actions[action]
);

export const filterGradesSelector = (text: string) => createSelector(
  getGradesSelector,
  grades => grades?.filter(grade =>
    Object.values(grade).some(value =>
      String(value).toLowerCase().includes(text.toLowerCase().trim())
    )
  ) ?? null
);

export const paginateGradesSelector = (text: string, page: number, pageSize: number) => createSelector(
  filterGradesSelector(text),
  grades => grades?.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  ) ?? null
);

export const getGradesLengthSelector = (text = '') => createSelector(
  filterGradesSelector(text),
  grades => grades?.length ?? 0
);
