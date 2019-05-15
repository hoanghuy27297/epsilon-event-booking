export interface AuthState {
  isAuthenticated: boolean;
  userId: string;
}

export interface ILoginModel {
  email: string;
  password: string;
}

export type LoginFields =
  | 'email'
  | 'password';
