import { StudentActions, StudentsState } from '@modules/students/models/students-state';
import {
  addStudentAction,
  addStudentFailureAction,
  addStudentSuccessAction,
  deleteStudentAction,
  deleteStudentFailureAction,
  deleteStudentSuccessAction,
  fetchStudentsAction,
  fetchStudentsExcludedByTeacherAction,
  fetchStudentsExcludedByTeacherFailureAction,
  fetchStudentsExcludedByTeacherSuccessAction,
  fetchStudentsFailureAction,
  fetchStudentsSuccessAction,
  hasAssociatedGradesByStudentAction,
  hasAssociatedGradesByStudentFailureAction,
  hasAssociatedGradesByStudentSuccessAction,
  updateStudentAction,
  updateStudentFailureAction,
  updateStudentSuccessAction
} from '@modules/students/store/actions/student.actions';
import { Action, createReducer, on } from '@ngrx/store';
import { ServiceError } from 'src/app/models/service-error';

export const INITIAL_STATE: StudentsState = {
  students: null,
  studentsExcluded: null,
  studentSelected: null,
  actions: {
    general: {
      loading: false,
      error: null
    },
    create: {
      loading: false,
      error: null
    },
    update: {
      loading: false,
      error: null
    },
    delete: {
      loading: false,
      error: null
    }
  }
}

function updateAction(
  state: StudentsState,
  action: keyof StudentActions,
  loading?: boolean,
  error?: ServiceError | null
): StudentActions {
  return {
    ...state.actions,
    [action]: {
      loading: loading === undefined ? state.actions[action].loading : loading,
      error: error === undefined ? state.actions[action].error : error
    }
  };
}

const studentsReducer = createReducer(
  INITIAL_STATE,
  on(addStudentAction, state => ({
    ...state,
    actions: updateAction(state, 'create', true, null)
  })),
  on(addStudentFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'create', false, error)
  })),
  on(addStudentSuccessAction, (state, { student }) => ({
    ...state,
    studentSelected: {
      student,
      hasAssociatedGrades: null
    },
    actions: updateAction(state, 'create', false)
  })),
  on(updateStudentAction, state => ({
    ...state,
    actions: updateAction(state, 'update', true, null)
  })),
  on(updateStudentFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'update', false, error)
  })),
  on(updateStudentSuccessAction, (state, { student }) => ({
    ...state,
    studentSelected: {
      student,
      hasAssociatedGrades: null
    },
    actions: updateAction(state, 'update', false)
  })),
  on(deleteStudentAction, state => ({
    ...state,
    actions: updateAction(state, 'delete', true, null)
  })),
  on(deleteStudentFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'delete', false, error)
  })),
  on(deleteStudentSuccessAction, (state, { student }) => ({
    ...state,
    studentSelected: {
      student,
      hasAssociatedGrades: null
    },
    actions: updateAction(state, 'delete', false)
  })),
  on(fetchStudentsAction, state => ({
    ...state,
    students: null,
    actions: updateAction(state, 'general', true, null)
  })),
  on(fetchStudentsFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'general', false, error)
  })),
  on(fetchStudentsSuccessAction, (state, { students }) => ({
    ...state,
    students,
    actions: updateAction(state, 'general', false)
  })),
  on(fetchStudentsExcludedByTeacherAction, state => ({ ...state })),
  on(fetchStudentsExcludedByTeacherFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'general', undefined, error)
  })),
  on(fetchStudentsExcludedByTeacherSuccessAction, (state, { students }) => ({
    ...state,
    studentsExcluded: students,
    actions: updateAction(state, 'general', undefined, null)
  })),
  on(hasAssociatedGradesByStudentAction, state => ({ ...state })),
  on(hasAssociatedGradesByStudentFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'general', undefined, error)
  })),
  on(hasAssociatedGradesByStudentSuccessAction, (state, { hasAssociatedGrades }) => ({
    ...state,
    studentSelected: !!state.studentSelected ? {
      ...state.studentSelected,
      hasAssociatedGrades
    } : null,
    actions: updateAction(state, 'general', undefined, null)
  }))
);

export function reducer(state: StudentsState | undefined, action: Action) {
  return studentsReducer(state, action);
}
