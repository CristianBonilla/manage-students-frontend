import { TeacherActions, TeachersState } from '@modules/teachers/models/teacher-state';
import { addTeacherAction, addTeacherFailureAction, addTeacherSuccessAction, clearTeachersBySubjectAction, deleteTeacherAction, deleteTeacherFailureAction, deleteTeacherSuccessAction, fetchTeacherByIdAction, fetchTeacherByIdFailureAction, fetchTeacherByIdSuccessAction, fetchTeachersAction, fetchTeachersBySubjectAction, fetchTeachersBySubjectFailureAction, fetchTeachersBySubjectSuccessAction, fetchTeachersFailureAction, fetchTeachersSuccessAction, updateTeacherAction, updateTeacherFailureAction, updateTeacherSuccessAction } from '@modules/teachers/store/actions/teacher.actions';
import { addAndGetTeachers, deleteAndGetTeachers, getTeachersOrganized, updateAndGetTeachers } from '@modules/teachers/utils/teacher.util';
import { Action, createReducer, on } from '@ngrx/store';
import { ServiceError } from 'src/app/models/service-error';

export const INITIAL_STATE: TeachersState = {
  teachers: null,
  teachersBySubject: null,
  teacherSelected: null,
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
  state: TeachersState,
  action: keyof TeacherActions,
  loading: boolean,
  error?: ServiceError | null
): TeacherActions {
  return {
    ...state.actions,
    [action]: {
      loading,
      error: error === undefined ? state.actions[action].error : error
    }
  };
}

const teachersReducer = createReducer(
  INITIAL_STATE,
  on(addTeacherAction, state => ({
    ...state,
    actions: updateAction(state, 'create', true, null)
  })),
  on(addTeacherFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'create', false, error)
  })),
  on(addTeacherSuccessAction, (state, { teacher }) => ({
    ...state,
    teachers: addAndGetTeachers(teacher, state.teachers!),
    teacherSelected: {
      teacher,
      hasAssociatedGrades: null
    },
    actions: updateAction(state, 'create', false)
  })),
  on(updateTeacherAction, state => ({
    ...state,
    actions: updateAction(state, 'update', true, null)
  })),
  on(updateTeacherFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'update', false, error)
  })),
  on(updateTeacherSuccessAction, (state, { teacher }) => ({
    ...state,
    teachers: updateAndGetTeachers(teacher, state.teachers!),
    teacherSelected: {
      teacher,
      hasAssociatedGrades: teacher.teacherId === state.teacherSelected?.teacher.teacherId
        ? state.teacherSelected.hasAssociatedGrades
        : null
    },
    actions: updateAction(state, 'update', false)
  })),
  on(deleteTeacherAction, state => ({
    ...state,
    actions: updateAction(state, 'delete', true, null)
  })),
  on(deleteTeacherFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'delete', false, error)
  })),
  on(deleteTeacherSuccessAction, (state, { teacher }) => ({
    ...state,
    teachers: deleteAndGetTeachers(teacher, state.teachers!),
    teacherSelected: {
      teacher,
      hasAssociatedGrades: teacher.teacherId === state.teacherSelected?.teacher.teacherId
        ? state.teacherSelected.hasAssociatedGrades
        : null
    },
    actions: updateAction(state, 'delete', false)
  })),
  on(fetchTeachersAction, state => ({
    ...state,
    teachers: null,
    actions: updateAction(state, 'general', true, null)
  })),
  on(fetchTeachersFailureAction, (state, { error }) => ({
    ...state,
    actions: updateAction(state, 'general', false, error)
  })),
  on(fetchTeachersSuccessAction, (state, { teachers }) => ({
    ...state,
    teachers: getTeachersOrganized(teachers),
    actions: updateAction(state, 'general', false)
  })),
  on(fetchTeacherByIdAction, (state, { actionType }) => ({
    ...state,
    actions: !actionType ? state.actions : updateAction(state, actionType, true, null)
  })),
  on(fetchTeacherByIdFailureAction, (state, { actionType, error }) => ({
    ...state,
    actions: !actionType ? state.actions : updateAction(state, actionType, false, error)
  })),
  on(fetchTeacherByIdSuccessAction, (state, { actionType, teacher, hasAssociatedGrades }) => ({
    ...state,
    teacherSelected: {
      teacher,
      hasAssociatedGrades
    },
    actions: !actionType ? state.actions : updateAction(state, actionType, false)
  })),
  on(fetchTeachersBySubjectAction, (state, { actionType }) => ({
    ...state,
    actions: updateAction(state, actionType, true, null)
  })),
  on(fetchTeachersBySubjectFailureAction, (state, { actionType, error }) => ({
    ...state,
    actions: updateAction(state, actionType, false, error)
  })),
  on(fetchTeachersBySubjectSuccessAction, (state, { actionType, teachers }) => ({
    ...state,
    teachersBySubject: teachers,
    actions: updateAction(state, actionType, false)
  })),
  on(clearTeachersBySubjectAction, state => ({
    ...state,
    teachersBySubject: null
  }))
);

export function reducer(state: TeachersState | undefined, action: Action) {
  return teachersReducer(state, action);
}
