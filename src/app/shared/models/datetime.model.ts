import * as _moment from 'moment';
import { isNumber } from 'util';

export class SystemConstants {
  public static RETRY_TIMES = 3;
  public static DATE_FORMATED = 'DD/MM/YYYY';
  public static DEFAULT_LANGUAGE = 'en-US';
}

export class DateTime {
  private _date: Date;

  constructor(date: Date = _moment().toDate()) {
    this.setDate(date);
  }

  get currentDateTime(): Date {
    return _moment(new Date()).toDate();
  }

  get dateToString(): string {
    return _moment(this._date).toString();
  }

  get currentDate(): Date {
    return _moment(new Date()).toDate();
  }

  stringToDate(date: string): Date {
    return _moment(date, 'DD/MM/YYYY').toDate();
  }

  addDays(dateNumber: number = 1): Date {
    return _moment(this.currentDate)
      .add(dateNumber, 'days')
      .toDate();
  }

  addHours(hours: number = 1): Date {
    return _moment(this.currentDate)
      .add(hours, 'hours')
      .toDate();
  }

  private setDate(date: Date | DateTime | any) {
    if (date && date instanceof Date) {
      this._date = date;
    } else if (date && date instanceof _moment) {
      this._date = _moment(date).toDate();
    } else if (date && date.seconds) {
      this._date = _moment.unix(date.seconds).toDate();
    } else if (date && !isNaN(date)) {
      this._date = _moment.unix(date).toDate();
    } else if (date && date instanceof DateTime) {
      this._date = date.date;
    } else {
      this._date = _moment(date).toDate();
    }
    // const diff = Math.abs(_moment(this._dob).diff(this.parent.dob));
    // console.log(_moment.unix(diff).toDate());
  }

  isAfter(date: any, compareTo: any): boolean {
    return _moment(date).isAfter(compareTo);
  }

  get date(): Date {
    return this._date;
  }

  get dateMoment(): _moment.Moment {
    console.log(this.date);
    return _moment(this.date);
  }

  getDateWithFormat(format = SystemConstants.DATE_FORMATED): string {
    return _moment(this._date).format(format);
  }

  combineDateWithFormat(date: string, time: string): any {
    return _moment(`${time} ${date}`, 'HH:mm DD/MM/YYYY').toDate().toString();
  }

  compareWithCurrent(date: string, time: string): any {
    return _moment(`${time} ${date}`, 'HH:mm DD/MM/YYYY').diff(new Date(), 'minutes');
  }

  get age(): number {
    const ageNumber: number =
      _moment(new Date()).year() - this.date.getFullYear();
    return ageNumber <= 0 ? 1 : ageNumber;
  }

  get ageInYears(): string {
    return this.age === 1 ? `${this.age} Yr` : `${this.age} Yrs`;
  }

  set dateObject(date: Date | any) {
    if (date && date instanceof Date) {
        this._date = date;
    } else if (date && date instanceof _moment) {
        this._date = _moment(date).toDate();
    } else if (date && date.seconds) {
        this._date = _moment.unix(date.seconds).toDate();
    } else if (date && isNumber(date)) {
        this._date = _moment.unix(date).toDate();
    } else {
        this._date = new Date(date);
    }
    // const diff = Math.abs(_moment(this._dob).diff(this.parent.dob));
    // console.log(_moment.unix(diff).toDate());
  }
}
