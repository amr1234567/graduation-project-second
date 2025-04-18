import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import UserContext from '../../../shared/contexts/user.context';

export const isAuthorizedGuard: CanActivateFn = (route, state) => {
  const {user, getRoute} = inject(UserContext);
  const router = inject(Router);
  return !!user() ? true : router.createUrlTree(getRoute());
};
