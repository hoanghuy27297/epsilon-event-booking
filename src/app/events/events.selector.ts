import { EventState } from './../shared/models/event.model';
import { createSelector } from '@ngrx/store';
import { selectEvent } from './events.state';

export const selectEventList = createSelector(
  selectEvent,
  (state: EventState) => state.events
)

export const selectYourEventList = createSelector(
  selectEvent,
  (state: EventState) => state
)
