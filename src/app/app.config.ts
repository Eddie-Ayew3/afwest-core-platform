import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideTolleConfig } from '@tolle_/tolle-ui';
import { routes } from './app.routes';
import { provideRouter, withRouterConfig } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideTolleConfig({
      primaryColor: '#f14444ff', // Indigo
      radius: '0.5rem',
      darkByDefault: false
    })
  ]
};