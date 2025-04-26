import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import UserContext from '../../../shared/contexts/user.context';

const isAdminGuard: CanActivateFn = (route, state) =>{
  const _ctx = inject(UserContext);
  const user = _ctx.user();
  const router = inject(Router);
  return !!user && user?.role.toLowerCase() === 'admin' ? true : router.createUrlTree(['auth','login']);
}

export default isAdminGuard;
