import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { routes } from './app.routes';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor'; // ✅ adjust path if needed

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([JwtInterceptor]) // ✅ FIXED: Register interceptor
    )
  ]
};
