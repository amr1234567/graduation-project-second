import {CanActivateFn, Router} from '@angular/router';
import UserContext from '../../../shared/contexts/user.context';
import {inject} from '@angular/core';

export const isNotAuthorizedGuard: CanActivateFn = (route, state) => {
  const ctx = inject(UserContext);
  const router = inject(Router);
  const _user = ctx.user();
  return !!_user ? router.createUrlTree(ctx.getRoute()) : true;
};
