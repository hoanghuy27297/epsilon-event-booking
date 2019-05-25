export class Role {
    constructor(private _code: number = 0) { }

    get code(): number {
        return this._code;
    }

    get name(): RoleNames {
        return this._code === 0 ? 'User' : 'Admin';
    }
}

export declare type RoleNames = 'User' | 'Admin';

export class RoleList {
    get listRole(): Role[] {
        return [
            new Role(0),
            new Role(1),
        ];
    }
}
