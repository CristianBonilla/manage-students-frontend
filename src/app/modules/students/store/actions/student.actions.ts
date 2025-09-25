import { StudentRequest, StudentResponse } from "@modules/students/models/student.model";
import { StudentActions, StudentSelected } from "@modules/students/models/students-state";
import { createAction, props } from "@ngrx/store";
import { ServiceError } from "src/app/models/service-error";

export enum STUDENTS_ACTIONS {
  ADD_STUDENT = '[Students/Store] Add Student',
  ADD_STUDENT_FAILURE = '[Students/API] Add Student Failure',
  ADD_STUDENT_SUCCESS = '[Students/API] Add Student Success',
  UPDATE_STUDENT = '[Students/Store] Update Student',
  UPDATE_STUDENT_FAILURE = '[Students/API] Update Student Failure',
  UPDATE_STUDENT_SUCCESS = '[Students/API] Update Student Success',
  DELETE_STUDENT = '[Students/Store] Delete Student',
  DELETE_STUDENT_FAILURE = '[Students/API] Delete Student Failure',
  DELETE_STUDENT_SUCCESS = '[Students/API] Delete Student Success',
  FETCH_STUDENTS = '[Students/Store] Fetch Students',
  FETCH_STUDENTS_FAILURE = '[Students/API] Fetch Students Failure',
  FETCH_STUDENTS_SUCCESS = '[Students/API] Fetch Students Sucess',
  FETCH_STUDENT_BY_ID = '[Students/Store] Fetch Student By Id',
  FETCH_STUDENT_BY_ID_FAILURE = '[Students/API] Fetch Student By Id Failure',
  FETCH_STUDENT_BY_ID_SUCCESS = '[Students/API] Fetch Student By Id Success',
  FETCH_STUDENTS_EXCLUDED_BY_TEACHER = '[Students/Store] Fetch Students Except Teacher Id',
  FETCH_STUDENTS_EXCLUDED_BY_TEACHER_FAILURE = '[Students/API] Fetch Students Except Teacher Id Failure',
  FETCH_STUDENTS_EXCLUDED_BY_TEACHER_SUCCESS = '[Students/API] Fetch Students Except Teacher Id Success',
  CLEAR_STUDENTS_EXCLUDED_BY_TEACHER = '[Students/Store] Clear Students Except Teacher Id',
  CLEAR_STUDENT_SELECTED = '[Students/Store] Clear Student Selected'
}

export const addStudentAction = createAction(
  STUDENTS_ACTIONS.ADD_STUDENT,
  props<{ payload: StudentRequest }>()
);
export const addStudentFailureAction = createAction(
  STUDENTS_ACTIONS.ADD_STUDENT_FAILURE,
  props<{ error: ServiceError }>()
);
export const addStudentSuccessAction = createAction(
  STUDENTS_ACTIONS.ADD_STUDENT_SUCCESS,
  props<{ student: StudentResponse }>()
);

export const updateStudentAction = createAction(
  STUDENTS_ACTIONS.UPDATE_STUDENT,
  props<{ studentId: string; payload: StudentRequest; }>()
);
export const updateStudentFailureAction = createAction(
  STUDENTS_ACTIONS.UPDATE_STUDENT_FAILURE,
  props<{ error: ServiceError }>()
);
export const updateStudentSuccessAction = createAction(
  STUDENTS_ACTIONS.UPDATE_STUDENT_SUCCESS,
  props<{ student: StudentResponse }>()
);

export const deleteStudentAction = createAction(
  STUDENTS_ACTIONS.DELETE_STUDENT,
  props<{ studentId: string }>()
);
export const deleteStudentFailureAction = createAction(
  STUDENTS_ACTIONS.DELETE_STUDENT_FAILURE,
  props<{ error: ServiceError }>()
);
export const deleteStudentSuccessAction = createAction(
  STUDENTS_ACTIONS.DELETE_STUDENT_SUCCESS,
  props<{ student: StudentResponse }>()
);

export const fetchStudentsAction = createAction(STUDENTS_ACTIONS.FETCH_STUDENTS);
export const fetchStudentsFailureAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENTS_FAILURE,
  props<{ error: ServiceError }>()
);
export const fetchStudentsSuccessAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENTS_SUCCESS,
  props<{ students: StudentResponse[] }>()
);

export const fetchStudentByIdAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENT_BY_ID,
  props<{ actionType?: keyof StudentActions, studentId: string }>()
);
export const fetchStudentByIdFailureAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENT_BY_ID_FAILURE,
  props<{ actionType?: keyof StudentActions, error: ServiceError }>()
);
export const fetchStudentByIdSuccessAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENT_BY_ID_SUCCESS,
  props<{ actionType?: keyof StudentActions, student: StudentResponse, hasAssociatedGrades: boolean }>()
);

export const fetchStudentsExcludedByTeacherAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENTS_EXCLUDED_BY_TEACHER,
  props<{ actionType: keyof StudentActions, teacherId: string }>()
);
export const fetchStudentsExcludedByTeacherFailureAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENTS_EXCLUDED_BY_TEACHER_FAILURE,
  props<{ actionType: keyof StudentActions, error: ServiceError }>()
);
export const fetchStudentsExcludedByTeacherSuccessAction = createAction(
  STUDENTS_ACTIONS.FETCH_STUDENTS_EXCLUDED_BY_TEACHER_SUCCESS,
  props<{ actionType: keyof StudentActions, students: StudentResponse[] }>()
);

export const clearStudentsExcludedByTeacherAction = createAction(STUDENTS_ACTIONS.CLEAR_STUDENTS_EXCLUDED_BY_TEACHER);

export const clearStudentSelectedAction = createAction(STUDENTS_ACTIONS.CLEAR_STUDENT_SELECTED);
