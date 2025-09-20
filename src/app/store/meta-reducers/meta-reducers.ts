import { ActionReducer } from '@ngrx/store';

export const CLEAR_STATE_TYPE = '[App/Meta] ClearState';

export function clearState(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => reducer(action.type === CLEAR_STATE_TYPE ? undefined : state, action);
}
