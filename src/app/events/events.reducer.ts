import { EventActions, EventActionType } from './events.actions';
import { EventState } from './../shared/models/event.model';

export const initialState: EventState = {
  events: [],
  yourEvents: []
};

export function eventReducer(
  state: EventState = initialState,
  action: EventActions
): EventState {
  switch (action.type) {
    case EventActionType.EVENT_LIST:
      return { ...state, events: action.payload };
    case EventActionType.YOUR_EVENT_LIST:
      return { ...state, yourEvents: action.payload };
  }
}
