import { EventStatusEnum } from './status.model';
import { IEvent, Event } from './event.model';

export interface IUserEvent extends IEvent {
  permission: number,
}

export class UserEvent extends Event implements IUserEvent {
  private _permission = 0;
  event: IEvent = new Event();

  constructor(public data?: IEvent | any, private __permission?: number) {
    super(data);
    this.permission = __permission;
    this.fromJSON(data);
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

    super.fromJSON(data, data.id);
    this.permission = this.permission || dataSource.permission || 0;

    return this;
  }

  toJSON(): IUserEvent {
    return {
      permission: this.permission,
      ...super.toJSON(),
    }
  }
}
