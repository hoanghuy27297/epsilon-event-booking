import { EventsRoutingModule } from './events-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { YourEventsComponent } from './your-events/your-events.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [UpcomingEventsComponent, YourEventsComponent],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
  ]
})
export class EventsModule { }
