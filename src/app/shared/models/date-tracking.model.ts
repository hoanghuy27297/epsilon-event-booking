import * as _moment from 'moment';

import { DateTime } from './datetime.model';

export interface IDateTracking {
    createdDate: Date;
    updatedDate: Date;
}

export class DateTracking extends DateTime implements IDateTracking {
    private _createdDate: Date;
    private _updatedDate: Date;

    constructor() {
        super();
        this._createdDate = this.currentDate;
        this._updatedDate = this.currentDate;
    }

    fromJSON(data: IDateTracking | any): DateTracking {
        if (!data) return this;

        this.dateObject = data.createdDate || null;
        this._createdDate = this.dateObject;

        this.dateObject = data.updatedDate || null;
        this._updatedDate = this.dateObject;
        return this;
    }

    getDateFromSeconds(seconds: any): Date {
        return _moment.unix(seconds).toDate() || null;
    }

    get dateCreatedFromNow(): string {
        return this._createdDate
            ? _moment(this._createdDate)
                .startOf('seconds')
                .fromNow()
            : '';
    }

    get dateUpdatedFromNow(): string {
        return this._updatedDate
            ? _moment(this._updatedDate)
                .startOf('seconds')
                .fromNow()
            : '';
    }

    get currentDate(): Date {
        return _moment(new Date()).toDate();
    }

    setUpdatedTime() {
        this._updatedDate = this.currentDate;
    }

    setCreatedTime() {
        this._createdDate = this.currentDate;
    }

    get createdDate(): Date | any {
        return this._createdDate || null;
    }

    get updatedDate(): Date | any {
        return this._updatedDate || this.currentDate;
    }

    toJSON(): IDateTracking {
        return {
            createdDate: this.createdDate,
            updatedDate: this.updatedDate
        };
    }
}
