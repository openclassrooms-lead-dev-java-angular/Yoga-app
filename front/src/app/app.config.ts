import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { JwtInterceptor } from "@core/interceptors/jwt.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([JwtInterceptor]),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]

};
