import { TeacherActions, TeachersState } from '@modules/teachers/models/teacher-state';
import { teachersFeatureKey } from '@modules/teachers/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const teachersRootSelector = createFeatureSelector<TeachersState>(teachersFeatureKey);

export const getTeachersSelector = createSelector(teachersRootSelector, state => state.teachers);

export const getTeacherSelector = createSelector(teachersRootSelector, state => state.teacherSelected);

export const getTeachersBySubjectSelector = createSelector(teachersRootSelector, state => state.teachersBySubject);

export const getActionSelector = (action: keyof TeacherActions) => createSelector(
  teachersRootSelector,
  state => state.actions[action]
);

export const filterTeachersSelector = (text: string) => createSelector(
  getTeachersSelector,
  teachers => teachers?.filter(teacher =>
    Object.values(teacher).some(value =>
      String(value).toLowerCase().includes(text.toLowerCase().trim())
    )
  ) ?? null
);

export const paginateTeachersSelector = (text: string, page: number, pageSize: number) => createSelector(
  filterTeachersSelector(text),
  teachers => teachers?.slice(
    (page - 1) * pageSize,
    (page - 1) * pageSize + pageSize
  ) ?? null
);

export const getTeachersLengthSelector = (text = '') => createSelector(
  filterTeachersSelector(text),
  teachers => teachers?.length ?? 0
);
