import { AngularFirestore } from '@angular/fire/firestore';
import * as _moment from 'moment';
import { AddNewEventDialogComponent } from './add-new-event-dialog/add-new-event-dialog.component';
import { map, takeUntil } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { AppState, selectUser } from '@app/core';
import { Store, select } from '@ngrx/store';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild
} from '@angular/core';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from '@angular/material';

import { IEvent, Event } from './../../shared/models/event.model';
import { upcomingEventData } from './upcoming-events.data';
import { Observable, Subject } from 'rxjs';
import { User } from '@app/shared/models/user.model';
import { DateTime } from '@app/shared/models/datetime.model';

@Component({
  selector: 'epsilon-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingEventsComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  dataSource: MatTableDataSource<Event> = new MatTableDataSource();
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns: string[] = [
    'name',
    'place',
    'time',
    'amount',
    'price',
    'status'
  ];
  user$: Observable<User>;

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.user$ = this.store.pipe(
      select(selectUser),
      map(user => user)
    );
    this.getAllEvent();
  }

  async getAllEvent() {
    await this.db
      .collection('events')
      .snapshotChanges()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        let events: Event[] = [];
        data.forEach(result => {
          console.log(result.payload.doc.data());
          events = [new Event(result.payload.doc.data()), ...events];
          console.log(events);
        })
        console.log(events);
        console.log(upcomingEventData);
        this.dataSource = new MatTableDataSource(events);
        console.log(this.dataSource);
      });
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

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
