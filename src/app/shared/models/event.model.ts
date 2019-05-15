import { IDateTracking } from './date-tracking.model';
import { EventStatusEnum, EventStatus, EventStatusTypes } from './status.model';

export interface IEvent {
  id?: string,
  name: string,
  place: string,
  date: string,
  time: string,
  price: number,
  capacity: number,
  amount: number,
  discount: number,
  promotionCode: Array<string>,
  status: number
}

export class Event implements IEvent {
  name = '';
  place = '';
  date = '';
  time = '';
  price = 0;
  capacity = 0;
  amount = 0;
  discount = 0;
  promotionCode = [];

  private _status: EventStatus = new EventStatus();

  constructor(data?: IEvent | any) {
    this.fromJSON(data);
  }

  fromJSON(data: IEvent | any): Event {
    if (!data) return this;

    this.name = data.name || '';
    this.place = data.place || '';
    this.date = data.date || '';
    this.time = data.time || '';
    this.price = data.price || 0;
    this.capacity = data.capacity || 0;
    this.amount = data.amount || 0;
    this.discount = data.discount || 0;
    this.promotionCode = data.promotionCode || [];
    this._status = new EventStatus(data.status) || new EventStatus();

    return this;
  }

  get status(): EventStatusEnum {
    return this._status ? this._status.code : EventStatusEnum.Available;
  }

  get statusName(): EventStatusTypes {
      return this._status ? this._status.name : 'Available';
  }

  get statusClassName(): string {
      return this._status.statusClassName;
  }

  toJSON(): IEvent {
    return {
      name: this.name,
      place: this.place,
      date: this.date,
      time: this.time,
      price: this.price,
      capacity: this.capacity,
      amount: this.amount,
      discount: this.discount,
      promotionCode: this.promotionCode,
      status: this.status
    }
  }
}
