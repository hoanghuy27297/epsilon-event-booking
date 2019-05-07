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
}

export class User extends DateTracking implements IUser {
  email = '';
  firstName = '';
  lastName = '';
  userId = 0;
  gender = 0;
  position = 0;
  role = 0;

  constructor(private _id: string = null) {
    super();
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

  toJSON(): IUser {
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      userId: this.userId,
      gender: this.gender,
      position: this.position,
      role: this.role,
      ...super.toJSON()
    }
  }
}