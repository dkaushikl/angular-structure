import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, ExchangeService, ToastService, TradeService } from '../../core/service';
import { ApiResponseStatus, Common } from '../../shared/common';
import { Response } from '../../shared/model';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  public baseCurrencyData = [];
  public pair: string;
  public baseCurrency: string;
  public mainCurrency: string;
  public pairId: number;
  public orderType: number;
  public price: number;
  public amount: number;
  public total: number;
  // public currencyName: string;
  public buyModel: any;
  public sellModel: any;
  public fullName: string;
  public email: string;
  public avtarImg: string;
  loading: boolean;
  selectedItem: string;
  dataList: any;
  selectedRow: any;
  route: string;
  clsSection = '';
  selectMarket = [];
  headerMarket = [];
  result: any;
  constructor(private url: LocationStrategy, public authenticationService: AuthenticationService, public exchangeService: ExchangeService,
    public toast: ToastService, public router: Router, public common: Common, public tradeService: TradeService) {
    this.MarketObservable();
    this.router.events.subscribe((path: any) => {
      this.route = path.url;
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event != null && (event.url != null || event.url !== undefined) && event.url.split('/').length >= 2 && event.url.split('/')[2]) {
        const data = event.url.split('/')[2];
        if (data === 'market') {
          this.clsSection = 'cr__dashboard';
        } else {
          this.clsSection = 'cr__inner_content';
        }
      }
    });

    const currentUrl = this.url.path().substring(1);
    if (currentUrl.includes('market')) {
      this.clsSection = 'cr__dashboard';
    } else {
      this.clsSection = 'cr__inner_content';
    }
    this.GetBaseCurrency();
    if (localStorage.getItem('MarketList') && localStorage.getItem('BaseMarketId')) {
      if (localStorage.getItem('selectedMarket')) {
        this.result = JSON.parse(localStorage.getItem('selectedMarket'));
        this.selectMarket.push(this.result);
      } else {
        const marketList = JSON.parse(localStorage.getItem('MarketList'));
        this.dataList = marketList;
        this.headerMarket = this.dataList;
        this.result = this.dataList.first();
      }
      this.selectedItem = localStorage.getItem('BaseMarketId');
      const baseName = this.result.Name.split('/');
      this.baseCurrency = baseName[1];
      this.mainCurrency = baseName[0];
      this.pairId = this.result.Id;
      this.selectedRow = this.result.Name;
    } else {
      this.baseCurrency = 'BTC';
      this.pairId = 17;
      this.selectedItem = '1';
    }
    this.GetMarketList(this.selectedItem);

    $('.cr__market_menu').click(function () {
      $('.cr__market').toggleClass('show');
    });
    $('.cr__close_market').click(function () {
      $('.cr__market').removeClass('show');
    });
    $('.cr__user_menu').click(function () {
      $('.cr__user').toggleClass('show in');
    });
    $('.cr__close_user').click(function () {
      $('.cr__user').removeClass('show');
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fullName = currentUser.Firstname + ' ' + currentUser.Lastname;
    this.email = currentUser.email;
  }

  GetBaseCurrency() {
    this.exchangeService.GetBaseCurrency().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.baseCurrencyData = data.Data;
      }
    });
  }

  GetMarketList(paramValue) {
    this.loading = true;
    this.selectedItem = paramValue;
    localStorage.setItem('BaseMarketId', this.selectedItem);
    this.exchangeService.GetMarketList(paramValue).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.loading = false;
        this.dataList = data.Data;
        if (this.result !== undefined) {
          this.headerMarket = this.dataList.filter(x => x.Id !== this.result.Id);
        } else {
          this.headerMarket = this.dataList;
        }
        localStorage.setItem('MarketList', JSON.stringify(this.dataList));
      }
    });
  }

  MarketObservable() {
    this.tradeService.marketRefreshAll$().subscribe((data: any) => {
      this.dataList = data;
      this.headerMarket = this.dataList.filter(x => x.Id !== this.result.Id);
      localStorage.setItem('MarketList', JSON.stringify(this.dataList));
    });
  }

  GetRowDetail(item) {
    this.selectedRow = item.Name;
    this.pairId = item.Id;
    const data = item.Name.split('/');
    this.baseCurrency = data[1];
    this.mainCurrency = data[0];
    localStorage.setItem('selectedMarket', JSON.stringify(item));
    localStorage.setItem('MarketList', JSON.stringify(this.dataList));
  }

  receiveAvtar($event) {
    this.avtarImg = $event;
  }

  createArray(item) {
    if (this.selectMarket.length >= 4) {
      const rarr = this.selectMarket.shift();
      this.selectMarket = this.selectMarket.filter(x => x.Id !== rarr.Id);
      this.headerMarket.push(rarr);
    }
    this.selectMarket = this.selectMarket.filter(x => x.Id !== item.Id); // for default market select then remove
    this.selectMarket.push(item);
    this.headerMarket = this.headerMarket.filter(x => x.Id !== item.Id);
    this.GetRowDetail(item);
  }

  removeByKey(item) {
    this.headerMarket.push(item);
    this.selectMarket = this.selectMarket.filter(x => x.Id !== item.Id);
  }

  Logout() {
    this.authenticationService.Logout();
    this.router.navigate(['/account/login']);
  }
}

