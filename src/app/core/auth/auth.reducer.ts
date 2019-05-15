import { AuthState } from './auth.models';
import { AuthActions, AuthActionTypes } from './auth.actions';

export const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
};

export function authReducer(
  state: AuthState = initialState,
  action: AuthActions
): AuthState {
  switch (action.type) {
    case AuthActionTypes.LOGIN:
      return { ...state, isAuthenticated: true, userId: action.payload };

    case AuthActionTypes.LOGOUT:
      return { ...state, isAuthenticated: false, userId: '' };

    default:
      return state;
  }
}
