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
    const user = this.user$();
    if(!user)
      return ['auth','login'];
    switch (user.role){
      case "User":
        return ['main' ,'user','main'];
      case "Admin":
        return ['main', 'admin', 'dashboard','products'];
      default:
        return ['auth','login'];
    }
  }
}
