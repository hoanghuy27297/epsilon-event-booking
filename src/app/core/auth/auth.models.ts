export interface AuthState {
  isAuthenticated: boolean;
}

export interface ILoginModel {
  email: string;
  password: string;
}

export type LoginFields =
  | 'email'
  | 'password';