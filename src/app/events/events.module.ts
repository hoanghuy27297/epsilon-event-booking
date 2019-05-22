import { EffectsModule } from '@ngrx/effects';
import { FEATURE_EVENT, reducers } from './events.state';
import { EventsRoutingModule } from './events-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { YourEventsComponent } from './your-events/your-events.component';
import { SharedModule } from '@app/shared';
import { AddNewEventDialogComponent } from './upcoming-events/add-new-event-dialog/add-new-event-dialog.component';
import { StoreModule } from '@ngrx/store';
import { SelectedEventDialogComponent } from './selected-event-dialog/selected-event-dialog.component';
import { EventEffects } from './events.effects';
import { SelectedEventEditFormComponent } from './selected-event-dialog/selected-event-edit-form/selected-event-edit-form.component';

@NgModule({
  declarations: [UpcomingEventsComponent, YourEventsComponent, AddNewEventDialogComponent, SelectedEventDialogComponent, SelectedEventEditFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    StoreModule.forFeature(FEATURE_EVENT, reducers),
    EffectsModule.forFeature([EventEffects])
  ],
  entryComponents: [
    AddNewEventDialogComponent,
    SelectedEventDialogComponent
  ],
})
export class EventsModule { }
