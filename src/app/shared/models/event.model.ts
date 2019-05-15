import { IDateTracking } from './date-tracking.model';

export interface IEvent {
  id?: string,
  name: string,
  place: string,
  date: string,
  time: string,
  price: number,
  capacity: number,
  amount: number,
  discount: number,
  promotionCode: Array<string>,
  status: number
}
