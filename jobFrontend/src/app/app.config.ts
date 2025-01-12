import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { NgxsModule, provideStore } from '@ngxs/store';
import { UserState } from './store/users.state';
import { PaymentState } from './store/payment.state';
import { ReceiptState } from './store/receipt.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(
      [UserState, PaymentState, ReceiptState],
      withNgxsFormPlugin()
    )
  ]
};
