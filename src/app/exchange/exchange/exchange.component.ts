import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { AuthenticationService, ExchangeService, ToastService, TradeService } from '../../core/service';
import { ApiResponseStatus, Common } from '../../shared/common';
import { Validator } from '../../shared/common/common.validator';
import { DailyExchange, Exchange, ExchangeModal, Response } from '../../shared/model';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
})
export class ExchangeComponent implements OnInit, OnChanges {
  @ViewChild(ModalDirective) public modal: ModalDirective;
  isOpen = false;
  dBtnTrade = false;
  buysellmsg = '';
  exchange = new ExchangeModal();
  dailyExchange = new DailyExchange();
  buyForm: FormGroup;
  sellForm: FormGroup;
  isLogin: boolean;
  userId: string;
  isBuyLoading = false;
  pairName: string;
  isSellSubmitted = false;
  isBuySubmitted = false;
  walletBalance: string;
  isDailyExchangeLoader = false;
  @Input() baseCurrency: string;
  @Input() mainCurrency: string;
  @Input() pairId: string;
  @Input() orderType: number;
  @Input() price: number;
  @Input() amount: number;
  @Input() total: number;
  @Input() buyModel: any;
  @Input() sellModel: any;

  constructor(
    public authenticationService: AuthenticationService,
    public exchangeService: ExchangeService,
    public fb: FormBuilder,
    public toast: ToastService,
    private router: Router,
    public tradeService: TradeService,
    public common: Common
  ) {
    this.authenticationService.isLoginChanged.subscribe((isLogin: any) => {
      setTimeout(() => this.isLogin = isLogin, 0);
    });
  }

  ngOnInit() {
    this.BindData();
    this.authenticationService.CheckUserLoggedIn();
    this.GetDailyExchangeObservable();
  }
  isTradeBlocked(mainCurr: string) {
    this.exchangeService.IsTradeBlocked(mainCurr).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.dBtnTrade = data.Data;
      }
    });
  }
  GetDailyExchangeObservable() {
    this.tradeService.dailyExchangeAll$().subscribe((data: any) => {
      if (data.length > 0) {
        this.dailyExchange = new DailyExchange();
        this.dailyExchange = data[0];
      } else {
        this.dailyExchange = new DailyExchange();
      }
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
      this.exchange.BaseCurrency =
        change.baseCurrency !== undefined
          ? change.baseCurrency.currentValue
          : this.baseCurrency;
      this.exchange.MainCurrency =
        change.mainCurrency !== undefined
          ? change.mainCurrency.currentValue
          : this.mainCurrency;
      this.pairName = `${this.mainCurrency}/${this.baseCurrency}`;
      this.GetExchange(change);
      this.GetDailyExchange();
    } else {
      this.ChangeUpdateModel(change);
    }
    this.isTradeBlocked(this.exchange.MainCurrency);
  }

  ChangeUpdateModel(change: any) {
    if (
      change.price !== undefined ||
      change.amount !== undefined ||
      change.total !== undefined
    ) {
      if (this.price != null && this.price !== undefined) {
        if (
          change.price === undefined ||
          (this.price !== change.price.previousValue && this.orderType === 1)
        ) {
          this.ResetForm();
          // this.exchange.BuyPrice = this.common.toFixedCustom(this.price, 8);
          this.exchange.SellPrice = this.common.toFixedCustom(this.price, 8);
          this.exchange.SellAmount = this.common.toFixedCustom(this.amount, 8);
          this.exchange.SellTotal = parseFloat(this.total.toString()).toFixed(
            8
          );
        }

        if (
          change.price === undefined ||
          (this.price !== change.price.previousValue && this.orderType === 2)
        ) {
          this.ResetForm();
          this.exchange.BuyPrice = this.common.toFixedCustom(this.price, 8);
          // this.exchange.SellPrice = this.common.toFixedCustom(this.price, 8);
          this.exchange.BuyAmount = this.common.toFixedCustom(this.amount, 8);
          this.exchange.BuyTotalFees = parseFloat(
            this.total.toString()
          ).toFixed(8);
        }
      }
    }

    if (change.sellModel !== undefined) {
      if (this.sellModel != null) {
        this.exchange.BuyPrice = this.common.toFixedCustom(this.sellModel.Price, 8);
      }
    }

    if (change.buyModel !== undefined) {
      if (this.buyModel != null) {
        this.exchange.SellPrice = this.common.toFixedCustom(this.buyModel.Price, 8);
      }
    }
  }

  GetDailyExchange() {
    this.isDailyExchangeLoader = true;
    this.exchangeService
      .GetDailyExchange(this.pairName)
      .subscribe((data: any) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          if (data.Data.length > 0) {
            this.dailyExchange = data.Data[0];
          } else {
            this.dailyExchange = new DailyExchange();
          }
        }
        this.isDailyExchangeLoader = false;
      });
  }

  GetExchange(change): void {
    this.isBuyLoading = true;
    this.ResetForm();
    const obj = {
      BaseCurrency: this.baseCurrency,
      MainCurrency: this.mainCurrency
    };
    this.isBuyLoading = true;
    this.exchangeService.GetWalletBalance(obj).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.BindExchange(data);
        if (change != null) {
          this.ChangeUpdateModel(change);
        }
      }
      this.isBuyLoading = false;
    });
  }

  BindExchange(data: any) {
    this.exchange.BaseValue = data.Data.BaseCurrencyValue;
    this.exchange.MainValue = data.Data.MainCurrencyValue;
    this.exchange.BuyFees = data.Data.TradeFees;
    this.exchange.SellFees = data.Data.TradeFees;
    this.exchange.BuyMinimum = data.Data.MinTrade;
    this.exchange.SellMinimum = data.Data.MinTrade;
    this.buyForm.patchValue({ Range: this.exchange.BaseValue });
    this.sellForm.patchValue({ Range: this.exchange.MainValue });
    this.buyForm.patchValue({ Minimum: data.Data.MinTrade });
    this.sellForm.patchValue({ Minimum: data.Data.MinTrade });
  }

  ResetForm() {
    this.exchange.BuyPrice = null;
    this.exchange.BuyAmount = null;
    this.exchange.BuyTotalFees = null;
    this.exchange.BuyTotal = null;

    this.exchange.SellPrice = null;
    this.exchange.SellAmount = null;
    this.exchange.SellTotalFees = null;
    this.exchange.SellTotal = null;

    this.isBuySubmitted = false;
    this.isSellSubmitted = false;
  }

  BindData() {
    this.buyForm = new FormGroup({
      Amount: new FormControl('', [Validators.required]),
      Minimum: new FormControl(''),
      Price: new FormControl('', [Validators.required]),
      Range: new FormControl(''),
      Total: new FormControl('', [
        Validator.RangeValidation,
        Validator.MinimumValidation
      ]),
    });
    this.sellForm = new FormGroup({
      Amount: new FormControl('', [Validators.required]),
      Minimum: new FormControl(''),
      Price: new FormControl('', [Validators.required]),
      Range: new FormControl(''),
      Total: new FormControl('', [
        Validator.RangeValidation,
        Validator.MinimumValidation
      ]),
    });
  }

  SetBuytotal(event) {
    if (event === 'amount' || event === 'price') {
      if (
        this.common.IsNumeric(this.exchange.BuyAmount) &&
        this.common.IsNumeric(this.exchange.BuyPrice)
      ) {
        this.exchange.BuyTotalFees = (
          this.exchange.BuyAmount * this.exchange.BuyPrice
        ).toFixed(8);
        this.exchange.BuyTotal = parseFloat(
          this.exchange.BuyTotalFees +
          parseFloat(this.exchange.BuyTotalFees) *
          (parseFloat(this.exchange.BuyFees) / 100)
        ).toFixed(8);
      } else {
        this.exchange.BuyTotal = '';
        this.exchange.BuyTotalFees = '';
      }
    } else if (event === 'total') {
      if (
        this.common.IsNumeric(this.exchange.BuyTotalFees) &&
        this.common.IsNumeric(this.exchange.BuyPrice)
      ) {
        this.exchange.BuyAmount = parseFloat(
          (
            parseFloat(this.exchange.BuyTotalFees) / this.exchange.BuyPrice
          ).toFixed(8)
        );
        this.exchange.BuyTotal = parseFloat(
          this.exchange.BuyTotalFees +
          parseFloat(this.exchange.BuyTotalFees) *
          (parseFloat(this.exchange.BuyFees) / 100)
        ).toFixed(8);
      } else {
        this.exchange.BuyAmount = null;
      }
    }
  }

  Buy(model: Exchange, isValid: boolean) {
    this.isBuySubmitted = true;
    model.FromCoin = this.exchange.MainCurrency;
    model.ToCoin = this.exchange.BaseCurrency;
    if (isValid) {
      this.isBuyLoading = true;
      const obj = {
        Amount: model.Amount,
        FromCoin: this.exchange.BaseCurrency,
        PairId: this.pairId,
        Price: model.Price,
        ToCoin: this.exchange.MainCurrency,
      };

      this.exchangeService.BuyTrade(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.isBuySubmitted = false;
          this.ResetForm();
          this.GetExchange(null);
          this.buysellmsg = data.Data;
          this.RefreshMarket(this.pairId);
          this.ShowPopUp();
          this.isBuyLoading = false;
        } else {
          this.buysellmsg = data.Data;
          this.isBuyLoading = false;
        }
      });
    }
  }
  SetSelltotal(event) {
    if (event.toUpperCase() === 'AMOUNT' || event.toUpperCase() === 'PRICE') {
      if (
        this.common.IsNumeric(this.exchange.SellPrice) &&
        this.common.IsNumeric(this.exchange.SellAmount)
      ) {
        this.exchange.SellTotal = (
          this.exchange.SellAmount * this.exchange.SellPrice
        ).toFixed(8);
      } else {
        this.exchange.SellTotal = null;
      }
    }
    if (event.toUpperCase() === 'TOTAL') {
      if (
        this.common.IsNumeric(this.exchange.SellTotal) &&
        this.common.IsNumeric(this.exchange.SellPrice)
      ) {
        this.exchange.SellAmount = parseFloat(
          (
            parseFloat(this.exchange.SellTotal) / this.exchange.SellPrice
          ).toFixed(8)
        );
      } else {
        this.exchange.SellAmount = null;
      }
    }
  }

  Sell(model: Exchange, isValid: boolean) {
    this.isSellSubmitted = true;
    if (isValid) {
      this.isBuyLoading = true;
      const obj = {
        Amount: model.Amount,
        FromCoin: this.exchange.MainCurrency,
        PairId: this.pairId,
        Price: model.Price,
        ToCoin: this.exchange.BaseCurrency,
      };
      this.exchangeService.SellTrade(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.isSellSubmitted = false;
          this.ResetForm();
          this.GetExchange(null);
          this.isBuyLoading = false;
          this.buysellmsg = data.Data;
          this.RefreshMarket(this.pairId);
          this.ShowPopUp();
        } else {
          this.isBuyLoading = false;
          this.toast.error(data.Message);
        }
      });
    }
  }

  RefreshMarket(pairId) {
    const baseMarketId = localStorage.getItem('BaseMarketId');
    this.tradeService.MarketRefresh(baseMarketId);
    this.tradeService.ChartRefresh();
    this.tradeService.GetDailyExchange(pairId);
    this.tradeService.GetOrder(pairId);
    this.tradeService.TradeHistory(pairId);
  }

  ClosePopUp() {
    this.modal.hide();
    this.isOpen = false;
  }

  ShowPopUp() {
    this.modal.show();
    this.isOpen = true;
  }

  GoToUrl(route) {
    this.router.navigate(['/' + route + '']);
  }

  BuyBaseValueClick() {
    if (this.common.IsNumeric(this.exchange.BaseValue) && this.common.IsNumeric(this.exchange.BuyPrice)) {
      this.exchange.BuyTotalFees = this.exchange.BaseValue.toString();
      this.exchange.BuyAmount = Number(Number(this.exchange.BuyTotalFees) / this.exchange.BuyPrice);
    }
  }

  SellBaseValueClick() {
    if (this.common.IsNumeric(this.exchange.MainValue)) {
      this.exchange.SellAmount = this.exchange.MainValue;
      this.exchange.SellTotal = (this.exchange.SellPrice * this.exchange.SellAmount).toFixed(8);
    }
  }
}
