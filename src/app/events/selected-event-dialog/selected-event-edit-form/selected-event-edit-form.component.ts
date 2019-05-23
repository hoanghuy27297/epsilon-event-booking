import { EventStatusEnum } from '@app/shared/models/status.model';
import { User } from './../../../shared/models/user.model';
import { DateTime } from '@app/shared/models/datetime.model';
import { Event } from './../../../shared/models/event.model';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService,
  AppState,
  selectUserId,
  selectUser
} from '@app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store, select } from '@ngrx/store';
import { UserRules } from '@app/shared/validators/validators';
import { debounceTime } from 'rxjs/operators';
import { Utility } from '@app/shared/helpers/utilities';
import { MatDatepickerInputEvent } from '@angular/material';
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
  selector: 'epsilon-selected-event-edit-form',
  templateUrl: './selected-event-edit-form.component.html',
  styleUrls: ['./selected-event-edit-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedEventEditFormComponent implements OnInit {
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
  yourEvent: UserEvent = new UserEvent();
  dateTime: DateTime = new DateTime(new Date());
  userId: string;
  user: User = new User();
  isAddingAdmin = false;
  date: Date = new Date();
  onDeleting = false;

  @Input()
  data: any = {};
  @Output()
  cancelUpdate: EventEmitter<boolean> = new EventEmitter();
  @Output()
  updatedEvent: EventEmitter<any> = new EventEmitter();
  @Output()
  onCloseDialog: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private notificationSvc: NotificationService,
    private store: Store<AppState>
  ) {
    this.store
      .pipe(select(selectUserId))
      .subscribe(state => (this.userId = state));
    this.store
      .pipe(select(selectUser))
      .subscribe(state => (this.user = new User(state)));
  }

  ngOnInit() {
    this.event = new Event(this.data, this.data.id);
    this.date = new DateTime().stringToDate(this.event.date);
    if (this.data.permission) {
      this.yourEvent = new UserEvent(this.data, this.data.permission);
    }
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.fb.group({
      name: [this.event.name, [Validators.required]],
      place: [this.event.place, [Validators.required]],
      date: [this.date, [Validators.required]],
      time: [
        this.event.time,
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

  onUpdateEvent() {
    // config event time
    const time = this.formGroup.get('time').value;
    const date = this.dateTime.getDateWithFormat();
    this.event = this.event.getRawValue(this.formGroup.getRawValue());
    this.event.eventTime = this.dateTime.combineDateWithFormat(date, time);
    this.event.date = date;

    // config event status
    const isTimeAvailable = new DateTime().compareWithCurrent(
      this.event.date,
      this.event.time
    );
    const isFull = this.event.capacity - this.event.amount; // check number of joinalble people left
    if (isTimeAvailable <= 0) {
      this.event.status = EventStatusEnum.Past;
    } else if (isFull === 0) {
      this.event.status = EventStatusEnum.Full;
    } else {
      this.event.status = EventStatusEnum.Available;
    }

    this.yourEvent = new UserEvent(
      this.event,
      this.data.permission || ADMIN_PERMISSION
    );

    if (this.data.permission) {
      this.updatedEvent.emit(this.yourEvent);
    } else {
      this.updatedEvent.emit(this.event);
    }

    this.updatingEvent(this.event);
    this.updatingYourEvent(this.yourEvent);
    this.cancelUpdate.emit(true);
    this.notificationSvc.success('You have updated event successfully!');
  }

  updatingEvent(event: Event) {
    this.db.doc(`events/${event.id}`).set(event.toJSON(), { merge: true });
  }

  updatingYourEvent(yourEvent: UserEvent) {
    this.db
      .doc(`users/${this.userId}/yourEvents/${yourEvent.id}`)
      .set(yourEvent.toJSON(), { merge: true });
  }

  onDeleteClick() {
    this.onDeleting = !this.onDeleting;
  }

  onDeleteEvent() {
    // delete the event in events collection
    this.db.doc(`events/${this.event.id}`).delete();

    // find all users
    this.db
      .collection('users')
      .snapshotChanges()
      .subscribe(users => {
        users.forEach(user => {
          const userId = user.payload.doc.id;
          // find all yourEvents in each users
          this.db
            .collection(`users/${userId}/yourEvents`)
            .snapshotChanges()
            .subscribe(events => {
              // if user has yourEvents collection
              if (events.length > 0) {
                // compare current event's id to all events in yourEvents collection of user
                const eventId = events.filter(
                  event => event.payload.doc.id === this.event.id
                );
                // if user has the current event
                if (eventId.length > 0) {
                  // delete the current event in yourEvent collection of that user
                  this.db
                    .doc(`users/${userId}/yourEvents/${this.event.id}`)
                    .delete();
                }
              }
            });
        });
      });

    this.notificationSvc.success(
      `You have deleted event ${this.event.name} successfully!`
    );
    this.onCloseDialog.emit(true);
  }

  onCancelUpdate() {
    this.cancelUpdate.emit(true);
  }
}
