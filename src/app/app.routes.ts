import { Routes } from '@angular/router';
import authRoutes from '../systems/auth-system/auth-system.routes';
import userRoutes from '../systems/user-system/user-system.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  ...authRoutes,
  ...userRoutes,
  {
    path: "**",
    redirectTo: '/auth/login',
  }
];
