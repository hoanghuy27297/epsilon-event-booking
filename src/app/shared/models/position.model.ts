export class Position {
    constructor(private _code: number = 0) { }

    get code(): number {
        return this._code;
    }

    get name(): PositionNames {
        return this._code === 0 ? 'Student' : 'Staff';
    }
}

export declare type PositionNames = 'Student' | 'Staff';

export class PositionList {
    get listPosition(): Position[] {
        return [
            new Position(0),
            new Position(1),
        ];
    }
}
