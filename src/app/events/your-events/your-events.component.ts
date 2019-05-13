import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'epsilon-your-events',
  templateUrl: './your-events.component.html',
  styleUrls: ['./your-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YourEventsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
