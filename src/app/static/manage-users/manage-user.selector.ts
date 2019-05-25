import { createSelector } from '@ngrx/store';
import { UsersState } from '@app/shared/models/user.model';
import { selectManageUser } from './manage-user.state';

export const selectUserList = createSelector(
  selectManageUser,
  (state: UsersState) => state.users
)
