import { GradesState } from '@modules/grades/models/grade-state';
import { reducer as gradesReducer } from '@modules/grades/store/reducers/grade.reducer';
import { ActionReducer } from '@ngrx/store';

export const gradesFeatureKey = 'grades';

export const reducer: ActionReducer<GradesState> = gradesReducer;
