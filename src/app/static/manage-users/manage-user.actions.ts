import { Action } from '@ngrx/store';
import { User, IUser } from '@app/shared/models/user.model';

export enum ManageUserActionType {
  USER_LIST = '[Events] User List',
}

export class UserList implements Action {
  readonly type = ManageUserActionType.USER_LIST;
  constructor(public payload: IUser[]) {}
}

export type ManageUserActions = UserList;
