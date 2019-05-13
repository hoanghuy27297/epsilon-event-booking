import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'epsilon-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingEventsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
