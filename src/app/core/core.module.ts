import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards';
import { ErrorInterceptor, LoaderHttpInterceptor, LoadingIndicatorService } from './interceptor';
import { AuthenticationService, ExchangeService, HttpService, ToastService, TradeService, UserService } from './service';


const service = [HttpService, AuthenticationService, ExchangeService, TradeService, UserService, ToastService];

@NgModule({
  imports: [CommonModule, HttpClientModule],
  exports: [],
  declarations: [],
  providers: [
    AuthGuard,
    ...service,
    LoadingIndicatorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useFactory: httpFactory,
      multi: true,
      deps: [LoadingIndicatorService]
    }
  ]
})

export class CoreModule { }

export function httpFactory(LoaderService) {
  return new LoaderHttpInterceptor(LoaderService);
}
