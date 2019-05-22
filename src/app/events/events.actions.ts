import { Event } from './../shared/models/event.model';
import { Action } from '@ngrx/store';

export enum EventActionType {
  CREATE_EVENT = '[Events] Create Event',
}

export class EventList implements Action {
  readonly type = EventActionType.CREATE_EVENT;
  constructor(public payload: Event[]) {}
}

export type EventActions = EventList;
