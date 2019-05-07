
export interface IRegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
  gender: number;
  position: number;
  password: string;
  confirmPassword: string;
}

export type RegisterFields =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'userId'
  | 'gender'
  | 'position'
  | 'password'
  | 'confirmPassword';