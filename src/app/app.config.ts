import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideTolleConfig } from '@tolle_/tolle-ui';
import { routes } from './app.routes';
import { provideRouter, withRouterConfig } from '@angular/router';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([])),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' })),
    provideTolleConfig({
      primaryColor: '#8b5cf6', // Indigo
      radius: '0.5rem',
      darkByDefault: false
    })
  ]
};