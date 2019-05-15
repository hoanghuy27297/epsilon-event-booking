export declare type EventStatusTypes =
  | 'Available'
  | 'Full'
  | 'Past'
  | 'Booked'
  | 'Saved';

export enum EventStatusEnum {
  Available,
  Full,
  Past,
  Booked,
  Saved
}

export class EventStatus {
  constructor(private _code: EventStatusEnum = EventStatusEnum.Available) {}

  get code(): EventStatusEnum {
    return this._code;
  }

  get name(): EventStatusTypes {
    return this.code === EventStatusEnum.Available
      ? 'Available'
      : this.code === EventStatusEnum.Full
      ? 'Full'
      : this.code === EventStatusEnum.Past
      ? 'Past'
      : this.code === EventStatusEnum.Booked
      ? 'Booked'
      : 'Saved';
  }

  get statusClassName(): string {
    return this.code === EventStatusEnum.Available
      ? 'available'
      : this.code === EventStatusEnum.Full
      ? 'full'
      : this.code === EventStatusEnum.Past
      ? 'past'
      : this.code === EventStatusEnum.Booked
      ? 'booked'
      : 'saved';
  }

}
