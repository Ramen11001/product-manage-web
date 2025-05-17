import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

/**
 * Global application configuration.
 * Defines providers for routing and HTTP client services.
 *
 * @constant
 * @type {ApplicationConfig}
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Global application configuration.
     * Defines providers for routing and HTTP client services.
     *
     * @constant
     * @type {ApplicationConfig}
     */
    provideRouter(routes),
    /**
     * Global application configuration.
     * Defines providers for routing and HTTP client services.
     *
     * @constant
     * @type {ApplicationConfig}
     */
    provideHttpClient(),
  ],
};
