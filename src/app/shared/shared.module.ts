import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda/module/module';
import { ReCaptchaModule } from 'angular2-recaptcha/angular2-recaptcha';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker/bs-datepicker.module';
import { ModalModule } from 'ngx-bootstrap/modal/modal.module';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar/dist/ngx-perfect-scrollbar';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ToastrModule } from 'ngx-toastr';
import { Common } from './common';
import { EightDigitDirective, NumberOnlyDirective } from './directive';
import { DateFormatPipe, DynamicDigitPipe, FilterArrayPipe, SplitString, TradeDatePipe, ZeroFilterPipe } from './pipes';
import './common/array-extensions';
import './common/date-extensions';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

const pipes = [DateFormatPipe, DynamicDigitPipe, TradeDatePipe, FilterArrayPipe, SplitString, ZeroFilterPipe];

const directives = [EightDigitDirective, NumberOnlyDirective];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd party
    LaddaModule.forRoot({ style: 'zoom-in' }),
    PerfectScrollbarModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgxQRCodeModule,
    ReCaptchaModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
  ],
  declarations: [...pipes, ...directives],
  exports: [
    ...pipes,
    ...directives,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    ModalModule,
    BsDatepickerModule,
    NgxQRCodeModule,
    PerfectScrollbarModule,
    ReCaptchaModule,
    ToastrModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }, Common]
})

export class SharedModule { }
