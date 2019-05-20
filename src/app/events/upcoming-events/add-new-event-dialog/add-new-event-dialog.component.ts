import { Event } from './../../../shared/models/event.model';
import { ROUTE_ANIMATIONS_ELEMENTS } from './../../../core/animations/route.animations';
import { NotificationService } from '@app/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDatepickerInputEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectionStrategy, Inject, EventEmitter } from '@angular/core';

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

type FormErrors = { [ef in EventField]: any }

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
  }
  formGroup: FormGroup;
  event: Event = new Event();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationSvc: NotificationService,
    public dialogRef: MatDialogRef<AddNewEventDialogComponent>
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formGroup = this.fb.group({
      name: [this.event.name, [Validators.required]],
      place: [this.event.place, [Validators.required]],
      date: [this.event.date, [Validators.required]],
      time: [this.event.time, [Validators.required]],
      price: [this.event.price],
      capacity: [this.event.capacity, [Validators.required]],
      amount: [this.event.amount],
      discount: [this.event.discount],
      promotionCode: [this.event.promotionCode],
      status: [this.event.status],
      description: [this.event.description]
    });
  }

  onDateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(event)
  }

}
