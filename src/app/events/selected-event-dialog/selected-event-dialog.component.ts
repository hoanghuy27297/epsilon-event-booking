import { User } from './../../shared/models/user.model';
import { DateTime } from './../../shared/models/datetime.model';
import { Event } from './../../shared/models/event.model';
import { UserEvent } from './../../shared/models/user-event.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  NotificationService,
  AppState,
  ROUTE_ANIMATIONS_ELEMENTS,
  selectUserId,
  selectUser
} from '@app/core';
import { Store, select } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subject, Observable, of } from 'rxjs';
import { EventStatus, EventStatusEnum } from '@app/shared/models/status.model';

@Component({
  selector: 'epsilon-selected-event-dialog',
  templateUrl: './selected-event-dialog.component.html',
  styleUrls: ['./selected-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedEventDialogComponent implements OnInit, OnDestroy {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  userId = '';
  private _unsubscribeAll: Subject<any> = new Subject();
  permission$: Observable<number>;
  status$: Observable<any>;
  yourEvent: any;
  isEditing = false;
  isBooking = false;
  booked$: Observable<any>;
  user: User = new User();
  role$: Observable<number>;
  isAdmin$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<SelectedEventDialogComponent>,
    private store: Store<AppState>
  ) {
    this.store
      .pipe(select(selectUserId))
      .subscribe(state => (this.userId = state));

    this.store.pipe(select(selectUser)).subscribe(state => {
      this.user = state;
      if (state !== 1) {
        this.isAdmin$ = of(true);
      }
    });

  }

  ngOnInit() {
    console.log(this.data);
    this.yourEvent = new Event(this.data, this.data.id);
    if (this.data.permission) {
      this.yourEvent = new UserEvent(
        this.yourEvent.toJSON(),
        this.data.permission
      );
    }
    this.onCheckYourEvents();
  }

  onCheckYourEvents() {
    // check admin permission to edit event
    this.permission$ = this.db
      .doc(`users/${this.userId}/yourEvents/${this.data.id}`)
      .valueChanges()
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((result: UserEvent) => {
          if (result && result.permission === 1) {
            return result.permission;
          }
          return 0;
        })
      );

    // check saved and booked status for normal user
    this.status$ = this.db
      .doc(`users/${this.userId}/yourEvents/${this.data.id}`)
      .valueChanges()
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((result: UserEvent) => {
          if (result) {
            if (result.status === EventStatusEnum.Booked) {
              this.booked$ = of(EventStatusEnum.Booked);
            }
            return new EventStatus(result.status);
          }
          return new EventStatus(this.data.status);
        })
      );

    // get user
    this.db
      .doc(`users/${this.userId}`)
      .valueChanges()
      .subscribe((result: User) => {
        this.user = new User(result, this.userId);
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDeleteEventFinished(close: boolean) {
    if (close) this.dialogRef.close();
  }

  onBookEvent() {
    this.isBooking = true;
  }

  onCancelBooking(cancelBooking: boolean) {
    if (cancelBooking) this.isBooking = false;
  }

  onEditEvent() {
    this.isEditing = true;
  }

  onCancelEditEvent(cancelUpdate: boolean) {
    if (cancelUpdate) this.isEditing = false;
  }

  onFinishEditEvent(updatedEvent: any) {
    this.yourEvent = new Event(updatedEvent, updatedEvent.id);
    if (updatedEvent.permission) {
      this.yourEvent = new UserEvent(
        this.yourEvent.toJSON(),
        updatedEvent.permission
      );
    }
  }

  onFinishBookingEvent(bookedEvent: any) {
    this.yourEvent = new Event(bookedEvent, bookedEvent.id);
    if (bookedEvent.permission) {
      this.yourEvent = new UserEvent(
        this.yourEvent.toJSON(),
        bookedEvent.permission
      );
    }
  }

  onCancelReservation() {
    let numberOfTickets = 0;
    this.yourEvent = new Event(this.yourEvent, this.yourEvent.id);
    this.db
      .doc(`users/${this.userId}/yourEvents/${this.yourEvent.id}`)
      .valueChanges()
      .subscribe((result: UserEvent) => {
        if (result && result.id) {
          // reduce the amount of the this.yourEvent in Events collection
          numberOfTickets = result.tickets;
          this.yourEvent.amount = this.yourEvent.amount - numberOfTickets;
          const isFull = this.yourEvent.capacity - this.yourEvent.amount;

          const isTimeAvailable = new DateTime().compareWithCurrent(
            this.yourEvent.date,
            this.yourEvent.time
          );

          // check upcoming event or past event
          if (
            isTimeAvailable < 0 &&
            this.yourEvent.status !== EventStatusEnum.Past
          ) {
            this.yourEvent.status = EventStatusEnum.Past;
          } else if (isFull > 0) {
            this.yourEvent.status = EventStatusEnum.Available;
          }

          // Update the event in Events collections
          this.db
            .doc(`events/${this.yourEvent.id}`)
            .set(this.yourEvent.toJSON(), { merge: true });

          // delete record in yourEvent collection of the user
          this.db
            .doc(`users/${this.userId}/yourEvents/${this.yourEvent.id}`)
            .delete();

          this.booked$ = of(null);
          this.notificationSvc.success(
            'You have canceled the booking successfully!'
          );
        }
      });

    const time = new DateTime().getDateWithFormat('HH:mm DD/MM/YYYY');
    const newHistoryAction = `You have canceled ${
      this.yourEvent.name
    } event booking at ${time}`;
    const updatedHistory = [newHistoryAction, ...this.user.history];
    this.user.history = updatedHistory;

    //  update user
    this.db
      .doc(`users/${this.userId}`)
      .set(this.user.toJSON(), { merge: true });
  }

  async onSaveEvent() {
    try {
      this.yourEvent.status = EventStatusEnum.Saved;

      const time = new DateTime().getDateWithFormat('HH:mm DD/MM/YYYY');
      const newHistoryAction = `You have saved ${
        this.yourEvent.name
      } event at ${time}`;
      const updatedHistory = [newHistoryAction, ...this.user.history];
      this.user.history = updatedHistory;

      //  update user
      this.db
        .doc(`users/${this.userId}`)
        .set(this.user.toJSON(), { merge: true });

      await this.db
        .doc(`users/${this.userId}/yourEvents/${this.data.id}`)
        .set(this.yourEvent.toJSON());
      this.notificationSvc.success('You have saved event successfully!');
    } catch (error) {
      console.log(error);
      this.notificationSvc.error('Saved event failed. Please try again');
    }
  }

  async onUnsaveEvent() {
    try {
      const time = new DateTime().getDateWithFormat('HH:mm DD/MM/YYYY');
      const newHistoryAction = `You have unsaved ${
        this.yourEvent.name
      } event at ${time}`;
      const updatedHistory = [newHistoryAction, ...this.user.history];
      this.user.history = updatedHistory;

      //  update user
      this.db
        .doc(`users/${this.userId}`)
        .set(this.user.toJSON(), { merge: true });

      await this.db
        .doc(`users/${this.userId}/yourEvents/${this.data.id}`)
        .delete();
      this.notificationSvc.success('You have unsaved event successfully!');
    } catch (error) {
      this.notificationSvc.error('Unsaved event failed. Please try again');
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
