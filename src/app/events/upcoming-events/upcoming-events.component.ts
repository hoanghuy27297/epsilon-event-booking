import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { IEvent, Event } from './../../shared/models/event.model';
import { upcomingEventData } from './upcoming-events.data';

@Component({
  selector: 'epsilon-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingEventsComponent implements OnInit {
  dataSource: MatTableDataSource<Event> = new MatTableDataSource(upcomingEventData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['name', 'place', 'time', 'amount', 'price', 'status']

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
