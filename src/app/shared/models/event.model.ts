import { UserEvent } from '@app/shared/models/user-event.model';
import { IEventAdmin, EventAdmin } from './event-admin.model';
import { IDateTracking, DateTracking } from './date-tracking.model';
import { EventStatusEnum, EventStatus, EventStatusTypes } from './status.model';
import { DateTime } from './datetime.model';

export interface EventState {
  events: Event[],
  yourEvents: UserEvent[],
}

export interface IEvent extends IDateTracking {
  id?: string,
  name: string,
  place: string,
  date: string,
  time: string,
  eventTime: Date | DateTime,
  price: number,
  capacity: number,
  amount: number,
  discount: number,
  promotionCode: string,
  status: number,
  description: string,
  admins: Array<Object>,
}

export class Event extends DateTracking implements IEvent {
  id = '';
  name = '';
  place = '';
  time = '';
  price = 0;
  capacity = 0;
  discount = 0;
  promotionCode = '';
  description = '';

  private _amount = 0;
  private _date = '';
  private _eventTime: DateTime = new DateTime(new Date());
  private _admins = [];
  private _status: EventStatus = new EventStatus();

  constructor(data?: IEvent | any, id?: string) {
    super();
    this.fromJSON(data, id);
  }

  getRawValue(data: IEvent | any): Event {
    const dataSource = this;

    this.name = data.name || dataSource.name || '';
    this.place = data.place || dataSource.place || '';
    this.date = data.date || dataSource.date || '';
    this.time = data.time || dataSource.time || '';
    this.eventTime = data.eventTime || dataSource.eventTime || new DateTime(new Date());
    this.price = data.price || dataSource.price || 0;
    this.capacity = data.capacity || dataSource.capacity || 0;
    this.amount = data.amount || dataSource.amount || 0;
    this.discount = data.discount || dataSource.discount || 0;
    this.promotionCode = data.promotionCode || dataSource.promotionCode || '';
    this._status = new EventStatus(data.status) || new EventStatus();
    this.description = data.description || '';
    this.admins = data.admins || dataSource.admins || [];

    return this;
  }

  fromJSON(data: IEvent | any, id?: string): Event {
    if (!data) return this;
    const dataSource = this;

    super.fromJSON(data);
    this.id = id || dataSource.id || '';
    this.name = data.name || dataSource.name || '';
    this.place = data.place || dataSource.place || '';
    this.date = data.date || dataSource.date || '';
    this.time = data.time || dataSource.time || '';
    this.eventTime = data.eventTime || dataSource.eventTime || new DateTime(new Date());
    this.price = data.price || dataSource.price || 0;
    this.capacity = data.capacity || dataSource.capacity || 0;
    this.amount = data.amount || dataSource.amount || 0;
    this.discount = data.discount || dataSource.discount || 0;
    this.promotionCode = data.promotionCode || dataSource.promotionCode || '';
    this._status = new EventStatus(data.status) || new EventStatus();
    this.description = data.description || '';
    this.admins = data.admins || dataSource.admins || [];

    return this;
  }

  get status(): EventStatusEnum {
    return this._status ? this._status.code : EventStatusEnum.Available;
  }

  set status(status: EventStatusEnum) {
    this._status = new EventStatus(status);
  }

  get statusName(): EventStatusTypes {
      return this._status ? this._status.name : 'Available';
  }

  get statusClassName(): string {
      return this._status.statusClassName;
  }

  get eventTime(): DateTime {
    return this._eventTime;
  }

  set eventTime(eventTime: DateTime) {
    this._eventTime = eventTime;
  }

  get admins(): Array<Object> {
    return this._admins;
  }

  set admins(admins: Array<Object>) {
    this._admins = admins;
  }

  get date(): string {
    return this._date;
  }

  set date(date: string) {
    this._date = date;
  }

  get amount(): number {
    return this._amount;
  }

  set amount(value: number) {
    this._amount = value;
  }

  toJSON(): IEvent {
    return {
      id: this.id,
      name: this.name,
      place: this.place,
      date: this.date,
      time: this.time,
      eventTime: this.eventTime,
      price: Number(this.price),
      capacity: Number(this.capacity),
      amount: Number(this.amount),
      discount: Number(this.discount),
      promotionCode: this.promotionCode,
      status: this.status,
      description: this.description,
      admins: this.admins,
      ...super.toJSON()
    }
  }
}
