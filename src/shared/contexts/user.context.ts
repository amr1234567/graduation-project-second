import {Injectable, signal} from '@angular/core';
import UserModel from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export default class UserContext {
  private user$ = signal<UserModel | null>(null);

  public user = this.user$.asReadonly();

  public changeUserDetails(user: UserModel | null): void {
    this.user$.set(user);
  }


  public getRoute(){
    const user = this.user$();
    if(!user)
      return ['auth','login'];
    switch (user.role){
      case "User":
        return ['user','main'];
      case "Admin":
        return ['admin','main'];
      default:
        return ['auth','login'];
    }
  }

}
