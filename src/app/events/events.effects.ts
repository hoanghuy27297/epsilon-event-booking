import { tap } from 'rxjs/operators';
import { LocalStorageService } from '@app/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { EventList, EventActionType } from './events.actions';

export const EVENT_KEY = 'EVENT';

@Injectable()
export class EventEffects {
  constructor(
    private action$: Actions<Action>,
    private localStorageSvc: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  create = this.action$.pipe(
    ofType<EventList>(EventActionType.CREATE_EVENT),
    tap(state => {
      console.log(state);
    })
  );
}
