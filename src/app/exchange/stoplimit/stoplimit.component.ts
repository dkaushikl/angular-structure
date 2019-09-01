import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, ExchangeService, ToastService } from '../../core/service';
import { Common } from '../../shared/common';
import { ApiResponseStatus } from '../../shared/common';
import { Response, StopLimitModel } from '../../shared/model';

@Component({
  selector: 'app-stoplimit',
  templateUrl: './stoplimit.component.html',
})

export class StoplimitComponent implements OnInit, OnChanges {
  @Input() baseCurrency: string;
  @Input() mainCurrency: string;
  @Input() pairId: string;
  @Input() dBtnTrade: boolean;
  isLogin: boolean;
  buyForm: FormGroup;
  sellForm: FormGroup;
  isBuySubmitted = false;
  isSellSubmitted = false;
  isBuyLoading = false;
  isSellLoading = false;
  stopLimitObj = new StopLimitModel();
  public baseValue: number;

  constructor(
    public authenticationService: AuthenticationService,
    public exchangeService: ExchangeService,
    public fb: FormBuilder,
    public toast: ToastService,
    public common: Common,
    public router: Router
  ) {
    this.authenticationService.isLoginChanged.subscribe((isLogin: any) => {
      setTimeout(() => this.isLogin = isLogin, 0);
    });
  }

  ngOnChanges(change: any) {
    if (change.pairId !== undefined) {
      this.pairId =
        change.pairId !== undefined
          ? change.pairId.currentValue
          : this.pairId;
    }
    if (
      change.baseCurrency !== undefined ||
      change.mainCurrency !== undefined
    ) {
      this.stopLimitObj.BaseCurrency =
        change.baseCurrency !== undefined
          ? change.baseCurrency.currentValue
          : this.baseCurrency;
      this.stopLimitObj.MainCurrency =
        change.mainCurrency !== undefined
          ? change.mainCurrency.currentValue
          : this.mainCurrency;
      this.GetExchange(change);
    }
  }


  ngOnInit() {
    this.authenticationService.CheckUserLoggedIn();
    this.BindData();
  }

  GetExchange(change): void {
    this.isBuyLoading = true;
    this.ResetForm();
    const obj = {
      BaseCurrency: this.baseCurrency,
      MainCurrency: this.mainCurrency
    };
    this.exchangeService.GetWalletBalance(obj).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.BindExchange(data);
      }
      this.isBuyLoading = false;
    });
  }

  BindExchange(data: any) {
    this.stopLimitObj.BaseValue = data.Data.BaseCurrencyValue;
    this.stopLimitObj.MainValue = data.Data.MainCurrencyValue;
  }
  BindData() {
    this.buyForm = new FormGroup({
      BuyAmount: new FormControl('', [Validators.required]),
      BuyLimit: new FormControl('', [Validators.required]),
      BuyStop: new FormControl('', [Validators.required]),
      BuyTotal: new FormControl(''),
    });
    this.sellForm = new FormGroup({
      SellAmount: new FormControl('', [Validators.required]),
      SellLimit: new FormControl('', [Validators.required]),
      SellStop: new FormControl('', [Validators.required]),
      SellTotal: new FormControl(''),
    });
  }
  ResetForm() {
    this.stopLimitObj.BuyLimit = null;
    this.stopLimitObj.BuyStop = null;
    this.stopLimitObj.BuyAmount = null;
    this.stopLimitObj.BuyTotal = null;
    this.stopLimitObj.SellLimit = null;
    this.stopLimitObj.SellStop = null;
    this.stopLimitObj.SellAmount = null;
    this.stopLimitObj.SellTotal = null;
    this.isBuySubmitted = false;
    this.isSellSubmitted = false;
  }

  SetBuytotal(event) {
    if (event === 'amount' || event === 'limit') {
      if (
        this.common.IsNumeric(this.stopLimitObj.BuyAmount) &&
        this.common.IsNumeric(this.stopLimitObj.BuyLimit)
      ) {
        this.stopLimitObj.BuyTotal = parseFloat((this.stopLimitObj.BuyAmount * this.stopLimitObj.BuyLimit).toFixed(8));
      } else {
        this.stopLimitObj.BuyTotal = 0;
      }
    } else if (event === 'total') {
      if (this.common.IsNumeric(this.stopLimitObj.BuyTotal) &&
        this.common.IsNumeric(this.stopLimitObj.BuyLimit)) {
        this.stopLimitObj.BuyAmount = parseFloat((this.stopLimitObj.BuyTotal / this.stopLimitObj.BuyLimit).toFixed(8));
      } else {
        this.stopLimitObj.BuyAmount = 0;
      }
    }
  }

  SetSelltotal(event) {
    if (event === 'amount' || event === 'limit') {
      if (
        this.common.IsNumeric(this.stopLimitObj.SellAmount) &&
        this.common.IsNumeric(this.stopLimitObj.SellLimit)
      ) {
        this.stopLimitObj.SellTotal = parseFloat((this.stopLimitObj.SellAmount * this.stopLimitObj.SellLimit).toFixed(8));
      } else {
        this.stopLimitObj.SellTotal = 0;
      }
    } else if (event === 'total') {
      if (this.common.IsNumeric(this.stopLimitObj.SellTotal) &&
        this.common.IsNumeric(this.stopLimitObj.SellLimit)) {
        this.stopLimitObj.SellAmount = parseFloat((this.stopLimitObj.SellTotal / this.stopLimitObj.SellLimit).toFixed(8));
      } else {
        this.stopLimitObj.SellAmount = 0;
      }
    }
  }

  Buy(model: any, isValid: boolean) {
    this.isBuySubmitted = true;
    if (isValid) {
      this.isBuyLoading = true;
      const obj = {
        Amount: model.BuyAmount,
        BaseCurrency: this.stopLimitObj.BaseCurrency,
        Limit: model.BuyLimit,
        MainCurrency: this.stopLimitObj.MainCurrency,
        OrderType: 1,
        PairId: this.pairId,
        Stop: model.BuyStop,
      };
      this.exchangeService.OrderStopLimit(obj).subscribe((data: Response) => {
        console.log(data);
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.isBuySubmitted = false;
          this.ResetForm();
          this.GetExchange(null);
          this.toast.success(data.Message);
        } else {
          this.toast.error(data.Message);
        }
        this.isBuyLoading = false;
      });
    }
  }

  Sell(model: any, isValid: boolean) {
    this.isSellSubmitted = true;
    if (isValid) {
      this.isSellLoading = true;
      const obj = {
        Amount: model.SellAmount,
        BaseCurrency: this.stopLimitObj.BaseCurrency,
        Limit: model.SellLimit,
        MainCurrency: this.stopLimitObj.MainCurrency,
        OrderType: 2,
        PairId: this.pairId,
        Stop: model.SellStop,
      };
      this.exchangeService.OrderStopLimit(obj).subscribe((data: Response) => {
        console.log(data);
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.isSellSubmitted = false;
          this.ResetForm();
          this.GetExchange(null);
          this.toast.success(data.Message);
        } else {
          this.isSellLoading = false;
          this.toast.error(data.Message);
        }
        this.isSellLoading = false;
      });
    }
  }

  GoToUrl(route) {
    this.router.navigate(['/' + route + '']);
  }
}
