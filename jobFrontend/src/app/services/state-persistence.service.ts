import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetUser, UserState } from '../store/users.state';

@Injectable({
  providedIn: 'root'
})
export class StatePersistenceService {
  private isBrowser: boolean;

  constructor(private store: Store) {
    this.isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
    this.loadState();
  }

  private loadState() {
    if (this.isBrowser) {
      const userState = sessionStorage.getItem("userState");
      if (userState) {
        const parsedData = JSON.parse(userState);
        this.store.dispatch(new SetUser(parsedData));
      }
    }

  }

  saveState() {
    if (this.isBrowser) {
      const state = this.store.selectSnapshot(UserState.user);
      sessionStorage.setItem('userState', JSON.stringify(state));
    }
  }
}
