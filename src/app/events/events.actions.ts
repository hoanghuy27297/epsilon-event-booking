import { Event } from './../shared/models/event.model';
import { Action } from '@ngrx/store';
import { UserEvent } from '@app/shared/models/user-event.model';

export enum EventActionType {
  EVENT_LIST = '[Events] Event List',
  YOUR_EVENT_LIST = '[Events] Your Event List'
}

export class EventList implements Action {
  readonly type = EventActionType.EVENT_LIST;
  constructor(public payload: Event[]) {}
}

export class YourEventList implements Action {
  readonly type = EventActionType.YOUR_EVENT_LIST;
  constructor(public payload: UserEvent[]) {}
}

export type EventActions = EventList | YourEventList;
