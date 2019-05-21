export interface IEventAdmin {
  adminId: string,
  adminEmail: string,
}

export class EventAdmin implements IEventAdmin {
  adminId = '';
  adminEmail = '';

  constructor(public data?: IEventAdmin | any) {
    this.fromJSON(data);
  }

  fromJSON(data: IEventAdmin): EventAdmin {
    if (!data) return this;
    const dataSource = this;

    this.adminId = data.adminId || dataSource.adminId || '';
    this.adminEmail = data.adminEmail || dataSource.adminEmail || '';
    return this;
  }

  toJSON(): IEventAdmin {
    return {
      adminId: this.adminId,
      adminEmail: this.adminEmail,
    }
  }
}
