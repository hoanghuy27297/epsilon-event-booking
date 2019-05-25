import { ManageUserActions, ManageUserActionType } from './manage-user.actions';
import { UsersState } from '@app/shared/models/user.model';

export const initialState: UsersState = {
  users: [],
};

export function ManageUserReducer(
  state: UsersState = initialState,
  action: ManageUserActions
): UsersState {
  switch (action.type) {
    case ManageUserActionType.USER_LIST:
      return { ...state, users: action.payload };
  }
}
