import { IEvent } from './event.model';
import { UserEvent, IUserEvent } from './user-event.model';
import { IDateTracking, DateTracking } from './date-tracking.model';

export interface IUser extends IDateTracking {
  id?: string,
  email: string,
  firstName: string,
  lastName: string,
  userId: number,
  gender: number,
  position: number,
  role: number,
  events: IUserEvent
}

export class User extends DateTracking implements IUser {
  email = '';
  firstName = '';
  lastName = '';
  userId = null;
  gender = 0;
  position = 0;
  role = 0;
  private _events = new UserEvent();

  constructor(data?: IUser | any, private _id: string = null) {
    super();
    this.fromJSON(data);
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get events(): UserEvent {
    return this._events;
  }

  set events(events: UserEvent) {
    this._events = new UserEvent(events);
  }

  fromRawValue(data: any): User {
    const dataSource = this;
    this.email = data.email || dataSource.email || '';
    this.firstName = data.firstName || dataSource.firstName || '';
    this.lastName = data.lastName || dataSource.lastName || '';
    this.userId = data.userId || dataSource.userId || null;
    this.gender = data.gender || dataSource.gender || 0;
    this.position = data.position || dataSource.position || 0;
    this.role = data.role || dataSource.role || 0;

    return this;
  }

  fromJSON(data: IUser): User {
    if (!data) return this;
    const dataSource = this;

    super.fromJSON(data);
    this.email = data.email || dataSource.email || '';
    this.firstName = data.firstName || dataSource.firstName || '';
    this.lastName = data.lastName || dataSource.lastName || '';
    this.userId = data.userId || dataSource.userId || null;
    this.gender = data.gender || dataSource.gender || 0;
    this.position = data.position || dataSource.position || 0;
    this.role = data.role || dataSource.role || 0;

    return this;
  }

  toJSON(): IUser {
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      userId: this.userId,
      gender: this.gender,
      position: this.position,
      role: this.role,
      events: this.events.toJSON(),
      ...super.toJSON()
    }
  }
}
