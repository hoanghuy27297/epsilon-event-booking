import { UserRules } from '@app/shared/validators/validators';
import { Event } from './../../../shared/models/event.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotificationService, AppState, selectUserId } from '@app/core';
import { Store, select } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';
import { Utility } from '@app/shared/helpers/utilities';
import { Observable } from 'rxjs';
import { EventStatusEnum } from '@app/shared/models/status.model';
import { UserEvent } from '@app/shared/models/user-event.model';

type CardField = 'cardName' | 'cardNumber' | 'expire' | 'ccv';

type FormErrors = { [cf in CardField]: any };

const ADMIN_PERMISSION = 1;
const USER_PERMISSION = 0;

@Component({
  selector: 'epsilon-selected-event-booking-form',
  templateUrl: './selected-event-booking-form.component.html',
  styleUrls: ['./selected-event-booking-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedEventBookingFormComponent implements OnInit {
  formGroup: FormGroup;
  event: Event = new Event();
  formErrors: FormErrors = {
    cardName: '',
    cardNumber: '',
    expire: '',
    ccv: ''
  };
  userId: string;
  private _total = 0;

  @Input()
  data: any = {};
  @Output()
  cancelBooking: EventEmitter<boolean> = new EventEmitter();
  @Output()
  bookingData: EventEmitter<any> = new EventEmitter();
  numberOfTickets = 1;

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private notificationSvc: NotificationService,
    private store: Store<AppState>
  ) {
    this.store
      .pipe(select(selectUserId))
      .subscribe(state => (this.userId = state));
  }

  ngOnInit() {
    console.log(this.data);
    this.event = new Event(this.data, this.data.id);
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.fb.group({
      cardName: ['', [Validators.required]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(UserRules.cardNumber)]
      ],
      expire: ['', [Validators.required, Validators.pattern(UserRules.expire)]],
      ccv: [
        null,
        [
          Validators.required,
          Validators.pattern(UserRules.numberOnly),
          Validators.maxLength(UserRules.ccvMaxLength)
        ]
      ]
    });

    this.formGroup.valueChanges.pipe(debounceTime(500)).subscribe(values => {
      Utility.onValueChanged(this.formGroup, this.formErrors);
    });
  }

  get total(): number {
    return this.numberOfTickets * this.event.price;
  }

  onCancelBooking() {
    this.cancelBooking.emit(true);
  }

  async onCheckout() {
    this.event.amount = this.event.amount + this.numberOfTickets;
    const numberOfTicketsLeft = this.event.capacity - this.event.amount;
    if (numberOfTicketsLeft <= 0) {
      this.event.status = EventStatusEnum.Full;
    }

    this.notificationSvc.success('You have made a booking successfully');

    this.db
      .doc(`events/${this.event.id}`)
      .set(this.event.toJSON(), { merge: true });

    await this.onSaveToYourEvents();
  }

  onSaveToYourEvents() {
    this.event.status = EventStatusEnum.Booked;

    // create new records of the booking in yourEvent collection of user
    const yourEvent = new UserEvent(this.event.toJSON(), USER_PERMISSION, this.numberOfTickets);

    console.log(this.event.toJSON())
    if (this.data.permission) {
      console.log('YOUR EVENT');
      this.bookingData.emit(yourEvent.toJSON());
    } else {
      this.bookingData.emit(this.event.toJSON());
    }
    this.cancelBooking.emit(true);

    this.db
      .doc(`users/${this.userId}/yourEvents/${this.event.id}`)
      .set(yourEvent.toJSON());
  }
}
