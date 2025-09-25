import { SubjectName } from '@modules/teachers/enums/subject-name.enum';
import { TeacherActions } from '@modules/teachers/models/teacher-state';
import { TeacherRequest, TeacherResponse } from '@modules/teachers/models/teacher.model';
import { createAction, props } from '@ngrx/store';
import { ServiceError } from 'src/app/models/service-error';

export enum TEACHERS_ACTIONS {
  ADD_TEACHER = '[Teachers/Store] Add Teacher',
  ADD_TEACHER_FAILURE = '[Teachers/API] Add Teacher Failure',
  ADD_TEACHER_SUCCESS = '[Teachers/API] Add Teacher Success',
  UPDATE_TEACHER = '[Teachers/Store] Update Teacher',
  UPDATE_TEACHER_FAILURE = '[Teachers/API] Update Teacher Failure',
  UPDATE_TEACHER_SUCCESS = '[Teachers/API] Update Teacher Success',
  DELETE_TEACHER = '[Teachers/Store] Delete Teacher',
  DELETE_TEACHER_FAILURE = '[Teachers/API] Delete Teacher Failure',
  DELETE_TEACHER_SUCCESS = '[Teachers/API] Delete Teacher Success',
  FETCH_TEACHERS = '[Teachers/Store] Fetch Teachers',
  FETCH_TEACHERS_FAILURE = '[Teachers/API] Fetch Teachers Failure',
  FETCH_TEACHERS_SUCCESS = '[Teachers/API] Fetch Teachers Sucess',
  FETCH_TEACHER_BY_ID = '[Teachers/Store] Fetch Teacher By Id',
  FETCH_TEACHER_BY_ID_FAILURE = '[Teachers/API] Fetch Teacher By Id Failure',
  FETCH_TEACHER_BY_ID_SUCCESS = '[Teachers/API] Fetch Teacher By Id Success',
  FETCH_TEACHERS_BY_SUBJECT = '[Teachers/Store] Fetch Teacher By Subject',
  FETCH_TEACHERS_BY_SUBJECT_FAILURE = '[Teachers/API] Fetch Teachers By Subject Failure',
  FETCH_TEACHERS_BY_SUBJECT_SUCCESS = '[Teachers/API] Fetch Teachers By Subject Success',
  CLEAR_TEACHERS_BY_SUBJECT = '[Teachers/Store] Clear Teachers By Subject',
}

export const addTeacherAction = createAction(
  TEACHERS_ACTIONS.ADD_TEACHER,
  props<{ payload: TeacherRequest }>()
);
export const addTeacherFailureAction = createAction(
  TEACHERS_ACTIONS.ADD_TEACHER_FAILURE,
  props<{ error: ServiceError }>()
);
export const addTeacherSuccessAction = createAction(
  TEACHERS_ACTIONS.ADD_TEACHER_SUCCESS,
  props<{ teacher: TeacherResponse }>()
);

export const updateTeacherAction = createAction(
  TEACHERS_ACTIONS.UPDATE_TEACHER,
  props<{ teacherId: string; payload: TeacherRequest; }>()
);
export const updateTeacherFailureAction = createAction(
  TEACHERS_ACTIONS.UPDATE_TEACHER_FAILURE,
  props<{ error: ServiceError }>()
);
export const updateTeacherSuccessAction = createAction(
  TEACHERS_ACTIONS.UPDATE_TEACHER_SUCCESS,
  props<{ teacher: TeacherResponse }>()
);

export const deleteTeacherAction = createAction(
  TEACHERS_ACTIONS.DELETE_TEACHER,
  props<{ teacherId: string }>()
);
export const deleteTeacherFailureAction = createAction(
  TEACHERS_ACTIONS.DELETE_TEACHER_FAILURE,
  props<{ error: ServiceError }>()
);
export const deleteTeacherSuccessAction = createAction(
  TEACHERS_ACTIONS.DELETE_TEACHER_SUCCESS,
  props<{ teacher: TeacherResponse }>()
);

export const fetchTeachersAction = createAction(TEACHERS_ACTIONS.FETCH_TEACHERS);
export const fetchTeachersFailureAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHERS_FAILURE,
  props<{ error: ServiceError }>()
);
export const fetchTeachersSuccessAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHERS_SUCCESS,
  props<{ teachers: TeacherResponse[] }>()
);

export const fetchTeacherByIdAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHER_BY_ID,
  props<{ actionType?: keyof TeacherActions, teacherId: string }>()
);
export const fetchTeacherByIdFailureAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHER_BY_ID_FAILURE,
  props<{ actionType?: keyof TeacherActions, error: ServiceError }>()
);
export const fetchTeacherByIdSuccessAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHER_BY_ID_SUCCESS,
  props<{ actionType?: keyof TeacherActions, teacher: TeacherResponse, hasAssociatedGrades: boolean }>()
);

export const fetchTeachersBySubjectAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHERS_BY_SUBJECT,
  props<{ actionType: keyof TeacherActions, subject: SubjectName }>()
);
export const fetchTeachersBySubjectFailureAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHERS_BY_SUBJECT_FAILURE,
  props<{ actionType: keyof TeacherActions, error: ServiceError }>()
);
export const fetchTeachersBySubjectSuccessAction = createAction(
  TEACHERS_ACTIONS.FETCH_TEACHERS_BY_SUBJECT_SUCCESS,
  props<{ actionType: keyof TeacherActions, teachers: TeacherResponse[] }>()
);

export const clearTeachersBySubjectAction = createAction(TEACHERS_ACTIONS.CLEAR_TEACHERS_BY_SUBJECT);
