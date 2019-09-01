import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Exchange } from '../../shared/model/exchange';
import { HttpService } from './http.service';

@Injectable()
export class ExchangeService {
  constructor(private http: HttpClient, public httpService: HttpService) { }

  GetOrder(currency: string) {
    return this.http.get(`${environment.apiUrl}Exchange/GetOrder?currency=${currency}`, this.httpService.GetHttpCommon());
  }

  GetDailyExchange(currency: string) {
    return this.http.get(`${environment.apiUrl}Exchange/GetDailyExchange?currency=${currency}`, this.httpService.GetHttpCommon());
  }

  GetBuyOrder() {
    return this.http.get(`${environment.apiUrl}Exchange/GetBuyOrder`, this.httpService.GetAuthHttpCommon());
  }

  GetSellOrder() {
    return this.http.get(`${environment.apiUrl}Exchange/GetSellOrder`, this.httpService.GetAuthHttpCommon());
  }

  BuyTrade(model: Exchange) {
    console.log(model);
    return this.http.post(`${environment.apiUrl}Exchange/BuyTrade`, model, this.httpService.GetAuthHttpCommon());
  }

  OrderStopLimit(model: any) {
    return this.http.post(`${environment.apiUrl}Exchange/OrderStopLimit`, model, this.httpService.GetAuthHttpCommon());
  }

  SellTrade(model: Exchange) {
    return this.http.post(`${environment.apiUrl}Exchange/SellTrade`, model, this.httpService.GetAuthHttpCommon());
  }

  GetExchange() {
    return this.http.post(`${environment.apiUrl}Exchange/GetExchange`, this.httpService.GetAuthHttpCommon());
  }

  GetUserTrade(id: number) {
    return this.http.get(`${environment.apiUrl}Exchange/GetUserTrade?id=${id}`, this.httpService.GetHttpCommon());
  }

  GetWalletBalance(obj: any) {
    return this.http.post(`${environment.apiUrl}Exchange/GetWalletBalance`, obj, this.httpService.GetAuthHttpCommon());
  }

  GetMarketList(id: number) {
    return this.http.get(`${environment.apiUrl}Market/GetMarketData/${id}`);
  }

  IsTradeBlocked(currency: string) {
    return this.http.get(`${environment.apiUrl}Exchange/IsTradeBlocked/` + currency, this.httpService.GetAuthHttpCommon());
  }

  GetRecentlyData(id: number) {
    return this.http.get(`${environment.apiUrl}Market/GetRecentlyData/${id}`);
  }

  GetBaseCurrency() {
    return this.http.get(`${environment.apiUrl}Currency/GetBaseCurrency`);
  }

  GetVolume() {
    return this.http.get(`${environment.apiUrl}Exchange/GetCurrencyVolume`);
  }

  BindCurrencyList() {
    return this.http.get(`${environment.apiUrl}User/BindCurrencyList`, this.httpService.GetAuthHttpCommon());
  }

  CancelOrder(id: number) {
    return this.http.get(`${environment.apiUrl}Exchange/CancelOrder/${id}`, this.httpService.GetAuthHttpCommon());
  }

  GetUserTradeAnalyze(obj: any) {
    return this.http.post(`${environment.apiUrl}User/GetUserTradeAnalyze`, obj, this.httpService.GetAuthHttpCommon());
  }
}
