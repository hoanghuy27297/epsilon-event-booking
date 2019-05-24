import { EventStatusEnum } from './status.model';
import { IEvent, Event } from './event.model';

export interface IUserEvent extends IEvent {
  permission: number,
  tickets: number,
}

export class UserEvent extends Event implements IUserEvent {
  private _permission = 0;
  private _tickets = 0;
  event: IEvent = new Event();

  constructor(public data?: IEvent | any, private __permission?: number, private numberOfTickets?: number) {
    super(data);
    this.permission = __permission;
    this.tickets = numberOfTickets;
    this.fromJSON(data);
  }

  get permission(): number {
    return this._permission;
  }

  set permission(permission: number) {
    this._permission = permission;
  }

  get tickets(): number {
    return Number(this._tickets);
  }

  set tickets(value: number) {
    this._tickets = value;
  }

  fromJSON(data: IEvent): UserEvent {
    if (!data) return this;
    const dataSource = this;

    super.fromJSON(data, data.id);
    this.permission = this.permission || dataSource.permission || 0;
    this.tickets = this.tickets || dataSource.tickets || 0;

    return this;
  }

  toJSON(): IUserEvent {
    return {
      permission: this.permission,
      tickets: this.tickets,
      ...super.toJSON(),
    }
  }
}
