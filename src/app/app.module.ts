import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { CoreModule } from './core';
import { SharedModule } from './shared';
import { UiModule } from './ui';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular
    BrowserAnimationsModule,
    BrowserModule,

    // Core & Shared
    CoreModule,
    SharedModule,

    // Feature
    UiModule,

    // app
    AppRoutingModule,

    // Service Worker
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
