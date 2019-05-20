export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
  user: any;
}

export interface ILoginModel {
  email: string;
  password: string;
}

export type LoginFields =
  | 'email'
  | 'password';
