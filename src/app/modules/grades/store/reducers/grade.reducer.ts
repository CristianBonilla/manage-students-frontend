import { GradeActions, GradesState } from '@modules/grades/models/grade-state';
import {
  addGradeAction,
  addGradeFailureAction,
  addGradeSuccessAction,
  deleteGradeAction,
  deleteGradeFailureAction,
  deleteGradeSuccessAction,
  fetchGradeByIdAction,
  fetchGradeByIdFailureAction,
  fetchGradeByIdSuccessAction,
  fetchGradesAction,
  fetchGradesFailureAction,
  fetchGradesSuccessAction,
  updateGradeAction,
  updateGradeFailureAction,
  updateGradeSuccessAction
} from '@modules/grades/store/actions/grade.actions';
import { addAndGetGrades, deleteAndGetGrades, getGradesOrganized, updateAndGetGrades } from '@modules/grades/utils/grade.util';
import { Action, createReducer, on } from '@ngrx/store';
import { ServiceError } from 'src/app/models/service-error';

export const INITIAL_STATE: GradesState = {
  grades: null,
  gradeSelected: null,
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
    },
    info: {
      loading: false,
      error: null
    }
  }
}

function updateAction(
  state: GradesState,
  action: keyof GradeActions,
  loading: boolean,
  error?: ServiceError | null
): GradeActions {
  return {
    ...state.actions,
    [action]: {
      loading,
      error: error === undefined ? state.actions[action].error : error
    }
  };
}

const gradesReducer = createReducer(
  INITIAL_STATE,
  on(addGradeAction, state => ({
    ...state,
    actions: updateAction(state, 'create', true, null)
  })),
  on(addGradeFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'create', false, error)
  })),
  on(addGradeSuccessAction, (state, { grade }) => ({
    ...state,
    grades: addAndGetGrades(grade, state.grades!),
    gradeSelected: grade,
    actions: updateAction(state, 'create', false)
  })),
  on(updateGradeAction, state => ({
    ...state,
    actions: updateAction(state, 'update', true, null)
  })),
  on(updateGradeFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'update', false, error)
  })),
  on(updateGradeSuccessAction, (state, { grade }) => ({
    ...state,
    grades: updateAndGetGrades(grade, state.grades!),
    gradeSelected: grade,
    actions: updateAction(state, 'update', false)
  })),
  on(deleteGradeAction, state => ({
    ...state,
    actions: updateAction(state, 'delete', true, null)
  })),
  on(deleteGradeFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'delete', false, error)
  })),
  on(deleteGradeSuccessAction, (state, { grade }) => ({
    ...state,
    grades: deleteAndGetGrades(grade, state.grades!),
    gradeSelected: grade,
    actions: updateAction(state, 'delete', false)
  })),
  on(fetchGradesAction, state => ({
    ...state,
    grades: null,
    actions: updateAction(state, 'general', true, null)
  })),
  on(fetchGradesFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'general', false, error)
  })),
  on(fetchGradesSuccessAction, (state, { grades }) => ({
    ...state,
    grades: getGradesOrganized(grades),
    actions: updateAction(state, 'general', false)
  })),
  on(fetchGradeByIdAction, (state, { actionType }) => ({
    ...state,
    actions: updateAction(state, actionType, true, null)
  })),
  on(fetchGradeByIdFailureAction, (state, { actionType, error }) => ({
    ...state,
    actions: updateAction(state, actionType, false, error)
  })),
  on(fetchGradeByIdSuccessAction, (state, { actionType, grade }) => ({
    ...state,
    gradeSelected: grade,
    actions: updateAction(state, actionType, false)
  }))
);

export function reducer(state: GradesState | undefined, action: Action) {
  return gradesReducer(state, action);
}
