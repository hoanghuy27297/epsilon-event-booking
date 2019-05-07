export class Gender {
    constructor(private _code: number = 0) { }

    get code(): number {
        return this._code;
    }

    get name(): GenderNames {
        return this._code === 0 ? 'Male' : this._code === 1 ? 'Female' : 'Others';
    }
}

export declare type GenderNames = 'Male' | 'Female' | 'Others';

export class GenderList {
    get listGender(): Gender[] {
        return [
            new Gender(0),
            new Gender(1),
            new Gender(2),
        ];
    }
}
