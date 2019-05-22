import { tap } from 'rxjs/operators';
import { LocalStorageService } from '@app/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { EventList, EventActionType, YourEventList } from './events.actions';

export const EVENT_KEY = 'EVENT';

@Injectable()
export class EventEffects {
  constructor(
    private action$: Actions<Action>,
    private localStorageSvc: LocalStorageService
  ) {}

  @Effect({ dispatch: false })
  eventList = this.action$.pipe(
    ofType<EventList>(EventActionType.EVENT_LIST),
    tap(state => {
      this.localStorageSvc.setItem(EVENT_KEY, { events: state.payload })
    })
  );
  yourEventList = this.action$.pipe(
    ofType<YourEventList>(EventActionType.EVENT_LIST),
    tap(state => {
      this.localStorageSvc.setItem(EVENT_KEY, { yourEvents: state.payload })
    })
  );
}
