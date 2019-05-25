import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { UsersState } from '@app/shared/models/user.model';
import { AppState } from '@app/core';
import { ManageUserReducer } from './manage-user.reducer';

export const FEATURE_EVENT = 'users';

export const selectManageUser = createFeatureSelector<State, UsersState>(FEATURE_EVENT);

export const reducers: ActionReducerMap<ManageUsersState> = {
  users: ManageUserReducer
}

export interface ManageUsersState {
  users: UsersState
}

export interface State extends AppState {
  users: ManageUsersState
}
