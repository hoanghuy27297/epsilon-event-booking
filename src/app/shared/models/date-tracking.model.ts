import * as _moment from 'moment';

import { DateTime } from './datetime.model';

export interface IDateTracking {
    createdDate?: Date | DateTime;
    updatedDate?: Date | DateTime;
}

export class DateTracking implements IDateTracking {
    private _createdDate: DateTime = new DateTime(new Date());
    private _updatedDate: DateTime = new DateTime(new Date());

    constructor(data: IDateTracking | any = null) {
        this.fromJSON(data);
    }

    fromJSON(data: IDateTracking | any): DateTracking {
        if (!data) return this;
        this.__createdDate = data.createdDate || new Date();
        this.__updatedDate = data.updatedDate || new Date();

        return this;
    }

    get createdDate(): Date | any {
        return this._createdDate.date;
    }

    get updatedDate(): Date | any {
        return this._updatedDate.date;
    }

    set __createdDate(date: Date | any) {
        this._createdDate = new DateTime(date);
    }

    set __updatedDate(date: Date | any) {
        this._updatedDate = new DateTime(date);
    }

    get dateCreatedFromNow(): string {
        return this.createdDate
            ? _moment(this.createdDate)
                .startOf('seconds')
                .fromNow()
            : '';
    }

    get dateUpdatedFromNow(): string {
        return this.updatedDate
            ? _moment(this.updatedDate)
                .startOf('seconds')
                .fromNow()
            : '';
    }

    get dateCreatedFormated(): string {
        return this._createdDate.getDateWithFormat();
    }

    get dateUpdatedFormated(): string {
        return this._updatedDate.getDateWithFormat();
    }

    toJSON(): IDateTracking {
        return {
            createdDate: this.createdDate,
            updatedDate: this.updatedDate
        };
    }
}
