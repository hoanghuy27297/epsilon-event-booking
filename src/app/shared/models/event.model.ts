import { IDateTracking, DateTracking } from './date-tracking.model';
import { EventStatusEnum, EventStatus, EventStatusTypes } from './status.model';

export interface IEvent extends IDateTracking {
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
  status: number,
  description: string,
}

export class Event extends DateTracking implements IEvent {
  name = '';
  place = '';
  date = '';
  time = '';
  price = 0;
  capacity = 0;
  amount = 0;
  discount = 0;
  promotionCode = [];
  description = '';

  private _status: EventStatus = new EventStatus();

  constructor(data?: IEvent | any) {
    super();
    this.fromJSON(data);
  }

  fromJSON(data: IEvent | any): Event {
    if (!data) return this;
    const dataSource = this;

    super.fromJSON(data);
    this.name = data.name || dataSource.name || '';
    this.place = data.place || dataSource.place || '';
    this.date = data.date || dataSource.date || '';
    this.time = data.time || dataSource.time || '';
    this.price = data.price || dataSource.price || 0;
    this.capacity = data.capacity || dataSource.capacity || 0;
    this.amount = data.amount || dataSource.amount || 0;
    this.discount = data.discount || dataSource.discount || 0;
    this.promotionCode = data.promotionCode || dataSource.promotionCode || [];
    this._status = new EventStatus(data.status) || new EventStatus();
    this.description = data.description || dataSource.description || '';

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
      status: this.status,
      description: this.description,
      ...super.toJSON()
    }
  }
}
