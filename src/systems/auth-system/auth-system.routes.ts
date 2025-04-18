import {Routes} from '@angular/router';
import {isNotAuthorizedGuard} from './guards/is-not-authorized.guard';

const authRoutes : Routes = [
  {
    path: 'auth',
    loadComponent: () => import("./auth-decorator-layout.component").then(l => l.default),
    children: [
      {
        path: 'login',
        loadComponent: () => import("./pages/login-page/login-page.component")
          .then(l => l.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import("./pages/sign-up-page/sign-up-page.component")
          .then(l => l.SignUpPageComponent)
      }
    ],
    canActivate: [isNotAuthorizedGuard]
  }
]

export default authRoutes;
