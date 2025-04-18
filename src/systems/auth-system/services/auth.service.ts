import { Injectable } from '@angular/core';
import {SharedService} from '../../../shared/services/shared.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends SharedService{

  constructor() {
    super(AuthApiRoutes.BaseRoute);
  }

  public login(email: string, password: string): Observable<boolean> {
    ///Todo: logic to login
    return of(true);
  }


  register(name: string, email: string, password: string) {
    ///Todo: Login to register
    return of(true);
  }
}

class AuthApiRoutes {
  static readonly BaseRoute: string = "";
}
