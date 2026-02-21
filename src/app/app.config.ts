import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTolleConfig } from '@tolle_/tolle-ui';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideTolleConfig({
      primaryColor: '#551a65',
      radius: '0.75rem',
      darkByDefault: false,
    }),
  ]
};
