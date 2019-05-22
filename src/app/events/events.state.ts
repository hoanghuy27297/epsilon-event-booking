import { AppState } from './../core/core.state';
import { EventState } from './../shared/models/event.model';
import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import { eventReducer } from './events.reducer';

export const FEATURE_EVENT = 'events';

export const selectEvent = createFeatureSelector<State, EventState>(FEATURE_EVENT);

export const reducers: ActionReducerMap<EventsState> = {
  events: eventReducer
}

export interface EventsState {
  events: EventState
}

export interface State extends AppState {
  events: EventsState
}
