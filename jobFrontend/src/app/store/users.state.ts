// src/app/store/user.state.ts

import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

// Define the User model
export interface User {
  id: string;
  name: string;
  email: string;
  phone: BigInteger;
  role: string,
  isAuthenticated: boolean;
}

// Initial user state
export class UserStateModel {
  user: User | null = null;
}

// Define actions
export class SetUser {
  static readonly type = '[User] Set';
  constructor(public user: User) {}
}

export class Logout {
  static readonly type = '[User] Logout';
}

// User State
@Injectable()
@State<UserStateModel>({
  name: 'user',
  defaults: {
    user: null,
  },
})
export class UserState {

  // Selector to access user data from the store
  @Selector()
  static user(state: UserStateModel): User | null {
    return state.user;
  }

  @Selector()
  static isAuthenticated(state: UserStateModel): boolean {
    return state.user !== null && state.user.isAuthenticated;
  }

  // Action to set user
  @Action(SetUser)
  setUser(ctx: StateContext<UserStateModel>, action: SetUser) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      user: action.user,
    });
  }

  // Action to logout user
  @Action(Logout)
  logout(ctx: StateContext<UserStateModel>) {
    ctx.setState({
      user: null,
    });
  }
}
