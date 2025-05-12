import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding, withRouterConfig} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { stripFormDataContentTypeInterceptor, tokenInterceptor } from '../systems/auth-system/services/token-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({paramsInheritanceStrategy: "always"})),
    provideHttpClient(withInterceptors([tokenInterceptor, stripFormDataContentTypeInterceptor]))
  ]
};
