import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { clearState } from 'src/app/store/meta-reducers/meta-reducers';

export interface AppState { }

export const reducers: ActionReducerMap<AppState> = { };

export const metaReducers: MetaReducer<AppState>[] = [clearState];
