import { StudentsState } from '@modules/students/models/students-state';
import { reducer as studentsReducer } from '@modules/students/store/reducers/student.reducer';
import { ActionReducer } from '@ngrx/store';

export const studentsFeatureKey = 'students';

export const reducer: ActionReducer<StudentsState> = studentsReducer;
