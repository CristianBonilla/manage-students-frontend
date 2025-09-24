import { GradeActions } from '@modules/grades/models/grade-state';
import { GradeRequest, GradeResponse, GradeResponseExtended } from '@modules/grades/models/grade.model';
import { createAction, props } from '@ngrx/store';
import { ServiceError } from 'src/app/models/service-error';

export enum GRADES_ACTIONS {
  ADD_GRADE = '[Grades/Store] Add Grade',
  ADD_GRADE_FAILURE = '[Grades/API] Add Grade Failure',
  ADD_GRADE_SUCCESS = '[Grades/API] Add Grade Success',
  UPDATE_GRADE = '[Grades/Store] Update Grade',
  UPDATE_GRADE_FAILURE = '[Grades/API] Update Grade Failure',
  UPDATE_GRADE_SUCCESS = '[Grades/API] Update Grade Success',
  DELETE_GRADE = '[Grades/Store] Delete Grade',
  DELETE_GRADE_FAILURE = '[Grades/API] Delete Grade Failure',
  DELETE_GRADE_SUCCESS = '[Grades/API] Delete Grade Success',
  FETCH_GRADES = '[Grades/Store] Fetch Grades',
  FETCH_GRADES_FAILURE = '[Grades/API] Fetch Grades Failure',
  FETCH_GRADES_SUCCESS = '[Grades/API] Fetch Grades Sucess',
  FETCH_GRADE_BY_ID = '[Grades/Store] Fetch Grade By Id',
  FETCH_GRADE_BY_ID_FAILURE = '[Grades/API] Fetch Grade By Id Failure',
  FETCH_GRADE_BY_ID_SUCCESS = '[Grades/API] Fetch Grade By Id Success',
}

export const addGradeAction = createAction(
  GRADES_ACTIONS.ADD_GRADE,
  props<{ payload: GradeRequest }>()
);
export const addGradeFailureAction = createAction(
  GRADES_ACTIONS.ADD_GRADE_FAILURE,
  props<{ error: ServiceError }>()
);
export const addGradeSuccessAction = createAction(
  GRADES_ACTIONS.ADD_GRADE_SUCCESS,
  props<{ grade: GradeResponseExtended }>()
);

export const updateGradeAction = createAction(
  GRADES_ACTIONS.UPDATE_GRADE,
  props<{ gradeId: string; payload: GradeRequest; }>()
);
export const updateGradeFailureAction = createAction(
  GRADES_ACTIONS.UPDATE_GRADE_FAILURE,
  props<{ error: ServiceError }>()
);
export const updateGradeSuccessAction = createAction(
  GRADES_ACTIONS.UPDATE_GRADE_SUCCESS,
  props<{ grade: GradeResponseExtended }>()
);

export const deleteGradeAction = createAction(
  GRADES_ACTIONS.DELETE_GRADE,
  props<{ gradeId: string }>()
);
export const deleteGradeFailureAction = createAction(
  GRADES_ACTIONS.DELETE_GRADE_FAILURE,
  props<{ error: ServiceError }>()
);
export const deleteGradeSuccessAction = createAction(
  GRADES_ACTIONS.DELETE_GRADE_SUCCESS,
  props<{ grade: GradeResponseExtended }>()
);

export const fetchGradesAction = createAction(GRADES_ACTIONS.FETCH_GRADES);
export const fetchGradesFailureAction = createAction(
  GRADES_ACTIONS.FETCH_GRADES_FAILURE,
  props<{ error: ServiceError }>()
);
export const fetchGradesSuccessAction = createAction(
  GRADES_ACTIONS.FETCH_GRADES_SUCCESS,
  props<{ grades: GradeResponseExtended[] }>()
);

export const fetchGradeByIdAction = createAction(
  GRADES_ACTIONS.FETCH_GRADE_BY_ID,
  props<{ actionType: keyof GradeActions, gradeId: string }>()
);
export const fetchGradeByIdFailureAction = createAction(
  GRADES_ACTIONS.FETCH_GRADE_BY_ID_FAILURE,
  props<{ actionType: keyof GradeActions, error: ServiceError }>()
);
export const fetchGradeByIdSuccessAction = createAction(
  GRADES_ACTIONS.FETCH_GRADE_BY_ID_SUCCESS,
  props<{ actionType: keyof GradeActions, grade: GradeResponseExtended }>()
);
