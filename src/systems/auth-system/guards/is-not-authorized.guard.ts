import {CanActivateFn, Router} from '@angular/router';
import UserContext from '../../../shared/contexts/user.context';
import {inject} from '@angular/core';

export const isNotAuthorizedGuard: CanActivateFn = (route, state) => {
  const {user, getRoute} = inject(UserContext);
  const router = inject(Router);
  return !!user() ? router.createUrlTree(getRoute()) : true;
};
