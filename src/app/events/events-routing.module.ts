import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { YourEventsComponent } from './your-events/your-events.component';

const routes: Routes = [
  {
    path: 'events',
    component: UpcomingEventsComponent,
    data: { title: 'epsilon.events' }
  },
  {
    path: 'your-events',
    component: YourEventsComponent,
    data: { title: 'epsilon.yourEvents' }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
