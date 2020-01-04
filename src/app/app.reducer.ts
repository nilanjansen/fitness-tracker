import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    ui: fromUI.State;
    auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUI.uiReducer,
    auth: fromAuth.AuthReducer
};

export const getUIState = createFeatureSelector<fromUI.State>('ui');
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');


export const getIsLoading  = createSelector(getUIState, fromUI.getIsLoading);
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);



