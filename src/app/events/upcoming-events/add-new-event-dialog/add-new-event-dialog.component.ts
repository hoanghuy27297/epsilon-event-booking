import { UserRules } from './../../../shared/validators/validators';
import { DateTime } from './../../../shared/models/datetime.model';
import { Utility } from './../../../shared/helpers/utilities';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from './../../../shared/models/event.model';
import { ROUTE_ANIMATIONS_ELEMENTS } from './../../../core/animations/route.animations';
import {
  NotificationService,
  AppState,
  selectUserId,
  selectUser
} from '@app/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDatepickerInputEvent
} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  EventEmitter
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { User } from '@app/shared/models/user.model';
import { UserEvent } from '@app/shared/models/user-event.model';

type EventField =
  | 'name'
  | 'place'
  | 'date'
  | 'time'
  | 'price'
  | 'capacity'
  | 'amount'
  | 'discount'
  | 'promotionCode'
  | 'status';

type AdminField = 'email';

type FormErrors = { [ef in EventField]: any };
type AdminFormErrors = { [af in AdminField]: any };

const ADMIN_PERMISSION = 1;
const USER_PERMISSION = 0;

@Component({
  selector: 'epsilon-add-new-event-dialog',
  templateUrl: './add-new-event-dialog.component.html',
  styleUrls: ['./add-new-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewEventDialogComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  formErrors: FormErrors = {
    name: '',
    place: '',
    date: '',
    time: '',
    price: '',
    capacity: '',
    amount: '',
    discount: '',
    promotionCode: '',
    status: ''
  };
  adminFormErrors: AdminFormErrors = {
    email: ''
  };
  formGroup: FormGroup;
  adminFormGroup: FormGroup;
  event: Event = new Event();
  dateTime: DateTime = new DateTime(new Date());
  userId: string;
  user: User = new User();
  isAddingAdmin = false;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<AddNewEventDialogComponent>,
    private store: Store<AppState>
  ) {
    this.store
      .pipe(select(selectUserId))
      .subscribe(state => (this.userId = state));

    // get user
    this.db
      .doc(`users/${this.userId}`)
      .valueChanges()
      .subscribe(result => {
        this.user = new User(result, this.userId);
      });
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.fb.group({
      name: [this.event.name, [Validators.required]],
      place: [this.event.place, [Validators.required]],
      date: [this.event.eventTime.currentDate, [Validators.required]],
      time: [
        this.event.eventTime.getDateWithFormat('HH:mm'),
        [Validators.required, Validators.pattern(UserRules.eventTime)]
      ],
      eventTime: [this.event.eventTime],
      price: [this.event.price, [Validators.pattern(UserRules.numberOnly)]],
      capacity: [
        this.event.capacity,
        [Validators.required, Validators.pattern(UserRules.numberOnly)]
      ],
      amount: [this.event.amount],
      discount: [
        this.event.discount,
        [Validators.pattern(UserRules.numberOnly)]
      ],
      promotionCode: [this.event.promotionCode],
      status: [this.event.status],
      description: [this.event.description]
    });

    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe(values => {
      Utility.onValueChanged(this.formGroup, this.formErrors);
    });
  }

  adminBuildForm() {
    this.adminFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.adminFormGroup.valueChanges
      .pipe(debounceTime(500))
      .subscribe(values => {
        Utility.onValueChanged(this.adminFormGroup, this.adminFormErrors);
      });
  }

  onAddMoreAdmins() {
    this.adminBuildForm();
    this.isAddingAdmin = true;
  }

  onDateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateTime = new DateTime(event.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddEvent() {
    // config event time
    const time = this.formGroup.get('time').value;
    const date = this.dateTime.getDateWithFormat();
    this.event = this.event.getRawValue(this.formGroup.getRawValue());
    this.event.eventTime = this.dateTime.combineDateWithFormat(date, time);
    this.event.date = date;

    // config admins for event

    this.createNewEvent(this.event);
  }

  async createNewEvent(data: Event): Promise<void | Event> {
    if (data) {
      try {
        const result = await this.db.collection('events').add(data.toJSON());
        if (result.id) {
          this.dialogRef.close();
          this.notificationSvc.success(
            'You have added a new event successfully!'
          );

          const time = new DateTime().getDateWithFormat('HH:mm DD/MM/YYYY');
          const newHistoryAction = `You have created ${
            data.name
          } event at ${time}`;
          const updatedHistory = [newHistoryAction, ...this.user.history];
          this.user.history = updatedHistory;

          //  update user
          this.db
            .doc(`users/${this.userId}`)
            .set(this.user.toJSON(), { merge: true });

          // create event object with eventId and admin permission of this user to event
          this.event = new Event(data, result.id);
          const userEvent = new UserEvent(this.event.toJSON());
          // this.user.events = userEvent;
          // this.user.events.permission = ADMIN_PERMISSION;
          userEvent.permission = ADMIN_PERMISSION;

          // add to the yourEvents collections in the admin document field a new event
          this.db
            .doc(`users/${this.userId}/yourEvents/${result.id}`)
            .set(userEvent.toJSON());

          this.db.doc(`events/${result.id}`).set(this.event.toJSON());
        }
      } catch (error) {
        return console.log(error);
      }
    }
  }
}
