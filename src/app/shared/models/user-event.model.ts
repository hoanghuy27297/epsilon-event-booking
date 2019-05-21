import { IEvent, Event } from './event.model';

export interface IUserEvent extends IEvent {
  eventId: string,
  permission: number,
}

export class UserEvent extends Event implements IUserEvent {
  private _eventId = '';
  private _permission = 0;
  event: IEvent = new Event();

  constructor(public data?: IEvent | any) {
    super(data);
    this.fromJSON(data);
  }

  get eventId(): string {
    return this._eventId;
  }

  set eventId(eventId: string) {
    this._eventId = eventId;
  }

  get permission(): number {
    return this._permission;
  }

  set permission(permission: number) {
    this._permission = permission;
  }

  fromJSON(data: IEvent): UserEvent {
    if (!data) return this;
    const dataSource = this;

    super.fromJSON(data);
    this.eventId = this.eventId || dataSource.eventId || '';
    this.permission = this.permission || dataSource.permission || 0;

    return this;
  }

  toJSON(): IUserEvent {
    return {
      eventId: this.eventId,
      permission: this.permission,
      ...super.toJSON(),
    }
  }
}
