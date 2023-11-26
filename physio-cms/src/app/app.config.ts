import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { ClientService } from "./services/client/client.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    ClientService],
};
