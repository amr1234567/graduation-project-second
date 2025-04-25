import {inject, Injectable} from '@angular/core';
import {SharedService} from '../../../shared/services/shared.service';
import {map, Observable, of, tap} from 'rxjs';
import UserContext from '../../../shared/contexts/user.context';
import {UserRoleType} from '../../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends SharedService{
  private _userCtx = inject(UserContext);
  constructor() {
    super(AuthApiRoutes.BaseRoute);
  }

  public login(email: string, password: string) {
    ///Todo: logic to login
    return this.sendPostRequest<LoginResponse>(AuthApiRoutes.LoginRoute,
      {emailOrUserName: email, password: password},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(tap((res) => {
      if(res){
        this._userCtx.changeUserDetails({
          email: res.email,
          role: res.role,
          token: res.token,
          userId: res.appUserId
        })
      }
      return res;
    }))
  }


  register(model: RegisterRequest) {
    ///Todo: Login to register
    return this.sendPostRequest<LoginResponse>(AuthApiRoutes.RegisterRoute, {
      email: model.email,
      userName: model.name,
      password: model.password,
      confirmPassword: model.confirmPassword
    },{
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(map((res) => {
      if(res){
        this._userCtx.changeUserDetails({
          email: res.email,
          role: res.role,
          token: res.token,
          userId: res.appUserId
        })
      }
      return res;
    }))
  }
}

class AuthApiRoutes {
  // static readonly BaseRoute: string = "https://localhost:7151/api/Account";
  static readonly BaseRoute: string = "http://ecommercetest2.runasp.net/api/Account";
  static readonly LoginRoute: string = "/Login";
  static readonly RegisterRoute: string = "/Register";
}

export type LoginResponse = {
  displayName: string;
  email: string;
  token: string;
  appUserId: string;
  role: UserRoleType
}

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}
