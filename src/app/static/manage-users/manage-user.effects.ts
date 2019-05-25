import { tap } from 'rxjs/operators';
import { LocalStorageService } from '@app/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { UserList, ManageUserActionType } from './manage-user.actions';

export const MANAGE_USER_KEY = 'MANAGE_USER';

@Injectable()
export class EventEffects {
  constructor(
    private action$: Actions<Action>,
    private localStorageSvc: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  userList = this.action$.pipe(
    ofType<UserList>(ManageUserActionType.USER_LIST),
    tap(state => {
      this.localStorageSvc.setItem(MANAGE_USER_KEY, { users: state.payload })
    })
  );
}
