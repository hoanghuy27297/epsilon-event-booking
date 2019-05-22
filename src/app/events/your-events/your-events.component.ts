import { UserEvent } from './../../shared/models/user-event.model';
import { EventStatusEnum } from './../../shared/models/status.model';
import { User } from './../../shared/models/user.model';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy } from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS, AppState, selectUser, selectUserId } from '@app/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, takeUntil } from 'rxjs/operators';
import { DateTime } from '@app/shared/models/datetime.model';
import { YourEventList } from '../events.actions';
import { SelectedEventDialogComponent } from '../selected-event-dialog/selected-event-dialog.component';
import { selectYourEventList } from '../events.selector';

@Component({
  selector: 'epsilon-your-events',
  templateUrl: './your-events.component.html',
  styleUrls: ['./your-events.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YourEventsComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  dataSource: MatTableDataSource<UserEvent> = new MatTableDataSource();
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
    this.eventList$ = this.store.pipe(select(selectYourEventList));
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
      if (result && result.events && result.events.yourEvents) {
        this.dataSource = new MatTableDataSource(result.events.yourEvents);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  async getAllEvent() {
    await this.db
      .collection(`users/${this.userId}/yourEvents`)
      .valueChanges()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        let events: UserEvent[] = [];
        data.forEach((result: UserEvent) => {
          const event = new UserEvent(result, result.permission);
          const eventId = event.toJSON().id;

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
          if (isTimeAvailable < 0 && event.status !== EventStatusEnum.Past) {
            event.status = EventStatusEnum.Past;

            // Update list past status for list of events
            this.db
              .doc(`users/${this.userId}/yourEvents/${eventId}`)
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
        this.store.dispatch(new YourEventList(events));
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onSelectEvent(data: UserEvent) {
    this.dialog.open(SelectedEventDialogComponent, {
      width: '65%',
      data: data.toJSON()
    })
  }
}
