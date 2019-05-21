import { UserRules } from './../../../shared/validators/validators';
import { DateTime } from './../../../shared/models/datetime.model';
import { Utility } from './../../../shared/helpers/utilities';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from './../../../shared/models/event.model';
import { ROUTE_ANIMATIONS_ELEMENTS } from './../../../core/animations/route.animations';
import { NotificationService, AppState, selectUserId, selectUser } from '@app/core';
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

type FormErrors = { [ef in EventField]: any };

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
  formGroup: FormGroup;
  event: Event = new Event();
  dateTime: DateTime = new DateTime(new Date());
  userId: string;
  user: User = new User();

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
      .subscribe(state => this.userId = state);
    this.store
      .pipe(select(selectUser))
      .subscribe(state => this.user = new User(state));
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

  onDateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateTime = new DateTime(event.value);
  }

  onAddEvent() {
    const time = this.formGroup.get('time').value;
    const date = this.dateTime.getDateWithFormat();
    this.event = this.event.getRawValue(this.formGroup.getRawValue());
    this.event.eventTime = this.dateTime.combineDateWithFormat(date, time);
    this.event.date = date;
    this.createNewEvent(this.event);
  }

  async createNewEvent(data: Event): Promise<void | Event> {
    if (data) {
      try {
        const result = await this.db
          .collection('events')
          .add(data.toJSON());
        if (result.id) {
          this.dialogRef.close();
          this.notificationSvc.success('You have added a new event successfully!');

          // create event object with eventId and admin permission of this user to event
          const userEvent = new UserEvent(data.toJSON());
          this.user.events = userEvent;
          this.user.events.eventId = result.id;
          this.user.events.permission = ADMIN_PERMISSION;

          // add to the yourEvents collections in the admin document field a new event
          await this.db
            .doc(`users/${this.userId}/yourEvents/${result.id}`)
            .set(this.user.events.toJSON());

        }
      }
      catch (error) {
        return console.log(error);
      }
    }
  }
}
