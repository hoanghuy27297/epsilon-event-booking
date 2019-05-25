export class Role {
    constructor(private _code: number = 0) { }

    get code(): number {
        return this._code;
    }

    get name(): RoleNames {
        return this._code === 0 ? 'User' : this._code === 1 ? 'Admin' : 'Super Admin';
    }
}

export declare type RoleNames = 'User' | 'Admin' | 'Super Admin';

export class RoleList {
    get listRole(): Role[] {
        return [
            new Role(0),
            new Role(1),
            new Role(2),
        ];
    }
}
