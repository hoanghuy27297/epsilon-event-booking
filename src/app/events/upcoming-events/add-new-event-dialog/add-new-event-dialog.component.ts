import { UserRules } from './../../../shared/validators/validators';
import { DateTime } from './../../../shared/models/datetime.model';
import { Utility } from './../../../shared/helpers/utilities';
import { AngularFirestore } from '@angular/fire/firestore';
import { Event } from './../../../shared/models/event.model';
import { ROUTE_ANIMATIONS_ELEMENTS } from './../../../core/animations/route.animations';
import { NotificationService } from '@app/core';
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

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<AddNewEventDialogComponent>
  ) {}

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
    this.createNewEvent(this.event);
  }

  createNewEvent(data: Event): Promise<void | Event> {
    if (data) {
      return this.db
        .collection('events')
        .add(data.toJSON())
        .then(result => {
          console.log(result);
          this.dialogRef.close();
        })
        .catch(error => console.log(error));
    }
  }
}
