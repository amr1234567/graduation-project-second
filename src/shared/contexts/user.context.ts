import {Injectable, signal} from '@angular/core';
import UserModel from '../models/user.model';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export default class UserContext {
  private user$ = signal<UserModel | null>(null);
  private _userKey = "E-Commerce_User";

  public get user() {
    return this.user$.asReadonly();
  }

  public changeUserDetails(user: UserModel | null): void {
    this.user$.set(user);
    this.localStorageServices.saveObject(this._userKey, user);
  }

  constructor(private localStorageServices: LocalStorageService) {
    const user = localStorageServices.getObject<UserModel>(this._userKey);
    if (user) {
      this.user$.set(user);
    }
  }


  public getRoute(){
    const role = this.user()?.role.toLowerCase();
    switch (role) {
      case 'user':
        return ['main','user','main'];
      case 'admin':
        return ['main','admin','dashboard','products'];
      default:
        // maybe redirect to a “not authorized” page instead of login,
        // or clear the stored user and send to login
        return ['auth','login'];
    }
  }
}
