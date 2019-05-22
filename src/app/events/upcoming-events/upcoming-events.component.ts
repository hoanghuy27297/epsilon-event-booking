import { AngularFirestore } from '@angular/fire/firestore';
import * as _moment from 'moment';
import { AddNewEventDialogComponent } from './add-new-event-dialog/add-new-event-dialog.component';
import { map, takeUntil } from 'rxjs/operators';
import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core/animations/route.animations';
import { AppState, selectUser, selectUserId } from '@app/core';
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
import { selectEventList } from '../events.selector';
import { EventList } from '../events.actions';
import { EventStatusEnum } from '@app/shared/models/status.model';
import { UserEvent } from '@app/shared/models/user-event.model';
import { SelectedEventDialogComponent } from '../selected-event-dialog/selected-event-dialog.component';

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
  eventList$: Observable<any>;
  userId = '';

  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private db: AngularFirestore
  ) {
    this.eventList$ = this.store.pipe(select(selectEventList));
  }

  ngOnInit() {
    this.user$ = this.store.pipe(
      select(selectUser),
      map(user => user)
    );
    this.store
      .pipe(select(selectUserId))
      .subscribe(state => this.userId = state);

    this.getAllEvent();

    this.eventList$.pipe(takeUntil(this._unsubscribeAll)).subscribe(result => {
      if (result && result.events) {
        this.dataSource = new MatTableDataSource(result.events);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async getAllEvent() {
    await this.db
      .collection('events')
      .snapshotChanges()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        let events: Event[] = [];
        data.forEach(result => {
          const eventId = result.payload.doc.id;
          const eventData = result.payload.doc.data();
          const event = new Event(eventData, eventId);

          // Update status of events
          // level of status checking
          // |-Past
          // |--Booked
          // |---Full
          // |----Saved
          // |-----Available
          const isTimeAvailable = new DateTime().compareWithCurrent(
            event.date,
            event.time
          );
          const isFull = event.capacity - event.amount; // check number of joinalble people left

          // check upcoming event or past event
          if (isTimeAvailable <= 0 && event.status !== EventStatusEnum.Past) {
            event.status = EventStatusEnum.Past;

            // Update list past status for list of events
            this.db
              .doc(`events/${eventId}`)
              .set(event.toJSON(), { merge: true });

          } else if (
            // Check full status of event
            isFull === 0 &&
            event.status !== EventStatusEnum.Full &&
            event.status !== EventStatusEnum.Past &&
            event.status !== EventStatusEnum.Booked
          ) {
            event.status = EventStatusEnum.Full;
          }

          events = [event, ...events];
        });
        this.store.dispatch(new EventList(events));
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

  onSelectEvent(data: Event) {
    this.dialog.open(SelectedEventDialogComponent, {
      width: '65%',
      data
    })
  }
}
