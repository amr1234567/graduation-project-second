import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import UserContext from '../../../shared/contexts/user.context';

export const isUserGuard: CanActivateFn = (route, state) => {
  const {user} = inject(UserContext);
  const router = inject(Router);
  return !!user() && user()?.role.toLowerCase() === 'user' ? true : router.createUrlTree(['auth','login']);
};
