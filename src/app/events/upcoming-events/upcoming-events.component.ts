import { AddNewEventDialogComponent } from './add-new-event-dialog/add-new-event-dialog.component';
import { map } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { AppState, selectUser } from '@app/core';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';

import { IEvent, Event } from './../../shared/models/event.model';
import { upcomingEventData } from './upcoming-events.data';
import { Observable } from 'rxjs';
import { User } from '@app/shared/models/user.model';

@Component({
  selector: 'epsilon-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingEventsComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  dataSource: MatTableDataSource<Event> = new MatTableDataSource(upcomingEventData);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['name', 'place', 'time', 'amount', 'price', 'status']
  user$: Observable<User>;

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.user$ = this.store.pipe(select(selectUser), map(user => user));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onOpenAddNewEventDialog(): void {
    this.dialog.open(AddNewEventDialogComponent, {
      width: '65%'
    });
  }

}
