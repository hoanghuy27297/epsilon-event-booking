import { EventActions, EventActionType } from './events.actions';
import { EventState } from './../shared/models/event.model';

export const initialState: EventState = {
  events: []
};

export function eventReducer(
  state: EventState = initialState,
  action: EventActions
): EventState {
  switch (action.type) {
    case EventActionType.CREATE_EVENT:
      return { ...state, events: action.payload };
  }
}
