import { FEATURE_EVENT, reducers } from './events.state';
import { EventsRoutingModule } from './events-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { YourEventsComponent } from './your-events/your-events.component';
import { SharedModule } from '@app/shared';
import { AddNewEventDialogComponent } from './upcoming-events/add-new-event-dialog/add-new-event-dialog.component';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [UpcomingEventsComponent, YourEventsComponent, AddNewEventDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    StoreModule.forFeature(FEATURE_EVENT, reducers)
  ],
  entryComponents: [
    AddNewEventDialogComponent
  ],
})
export class EventsModule { }
