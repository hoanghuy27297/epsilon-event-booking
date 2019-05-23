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
  selectUserId
} from '@app/core';
import { Store, select } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeUntil, map, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
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
  }

  ngOnInit() {
    console.log(this.data);
    this.yourEvent = new Event(this.data, this.data.id);
    if (this.data.permission) {
      this.yourEvent = new UserEvent(this.yourEvent.toJSON(), this.data.permission);
    }
    this.onCheckYourEvents();
  }

  onCheckYourEvents() {
    this.permission$ = this.db
      .doc(`users/${this.userId}/yourEvents/${this.data.id}`)
      .valueChanges()
      .pipe(takeUntil(this._unsubscribeAll), map((result: UserEvent) => {
        if (result && result.permission === 1) {
          return result.permission
        };
          return 0;
      }));
    this.status$ = this.db
      .doc(`users/${this.userId}/yourEvents/${this.data.id}`)
      .valueChanges()
      .pipe(takeUntil(this._unsubscribeAll), map((result: UserEvent) => {
        console.log(result);
        if (result) {
          return new EventStatus(result.status);
        }
        return new EventStatus(this.data.status);
      }));
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
      this.yourEvent = new UserEvent(this.yourEvent.toJSON(), updatedEvent.permission);
    }
  }

  async onSaveEvent() {
    try {
      this.yourEvent.status = EventStatusEnum.Saved;
      await this.db.doc(`users/${this.userId}/yourEvents/${this.data.id}`)
        .set(this.yourEvent.toJSON());
      this.notificationSvc.success('You have saved event successfully!');
    } catch (error) {
      console.log(error);
      this.notificationSvc.error('Saved event failed. Please try again');
    }
  }

  async onUnsaveEvent() {
    try {
      await this.db.doc(`users/${this.userId}/yourEvents/${this.data.id}`).delete();
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
