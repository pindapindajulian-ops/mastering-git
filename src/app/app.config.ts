import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter } from '@angular/router';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';

import { provideStore } from '@ngrx/store';

import { provideStoreDevtools } from '@ngrx/store-devtools';

import { employeeReducer } from './store/employee/employee.reducer';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideClientHydration(withEventReplay()),

    provideHttpClient(),

    provideStore({
      employees: employeeReducer
    }),

    provideStoreDevtools({
      maxAge: 25
    })

  ]

};
