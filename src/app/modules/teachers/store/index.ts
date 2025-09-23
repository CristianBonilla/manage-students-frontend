import { TeachersState } from '@modules/teachers/models/teacher-state';
import { reducer as teachersReducer } from '@modules/teachers/store/reducers/teacher.reducer';
import { ActionReducer } from '@ngrx/store';

export const teachersFeatureKey = 'teachers';

export const reducer: ActionReducer<TeachersState> = teachersReducer;
