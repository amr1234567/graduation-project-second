import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import UserContext from '../../../shared/contexts/user.context';

export const isAuthorizedGuard: CanActivateFn = (route, state) => {
  const ctx = inject(UserContext);
  const router = inject(Router);
  const _user = ctx.user();
  return !!_user ? true : router.createUrlTree(ctx.getRoute());
};
