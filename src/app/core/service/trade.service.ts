import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { environment } from '../../../environments/environment';

@Injectable()
export class TradeService {
  private hubConnection: HubConnection;
  dailyExchangeDataStream: ReplaySubject<any> = new ReplaySubject();
  orderStream: ReplaySubject<any> = new ReplaySubject();
  tradeHistoryStream: ReplaySubject<any> = new ReplaySubject();
  chartRefreshStream: ReplaySubject<boolean> = new ReplaySubject();
  marketRefreshStream: ReplaySubject<boolean> = new ReplaySubject();

  dailyExchangeAll$() {
    return this.dailyExchangeDataStream.asObservable();
  }

  orderAll$() {
    return this.orderStream.asObservable();
  }

  tradeHistoryAll$() {
    return this.tradeHistoryStream.asObservable();
  }

  chartRefreshAll$() {
    return this.chartRefreshStream.asObservable();
  }

  marketRefreshAll$() {
    return this.marketRefreshStream.asObservable();
  }

  constructor() {
    this.init();
  }

  GetDailyExchange(pairId): void {
    this.hubConnection
      .invoke('getDailyExchange', pairId)
      .catch(err => console.error(err));
  }

  GetOrder(pairId): void {
    this.hubConnection
      .invoke('getOrder', pairId)
      .catch(err => console.error(err));
  }

  TradeHistory(pairId): void {
    this.hubConnection
      .invoke('tradeHistory', pairId)
      .catch(err => console.error(err));
  }

  ChartRefresh(): void {
    this.hubConnection.invoke('chartRefresh')
      .catch(err => console.error(err));
  }

  MarketRefresh(baseMarketId): void {
    this.hubConnection.invoke('marketRefresh', baseMarketId)
      .catch(err => console.error(err));
  }

  init() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.tradeUrl)
      .configureLogging(LogLevel.Error)
      .configureLogging(LogLevel.Warning)
      .build();

    this.hubConnection.on('getDailyExchange', data => {
      this.dailyExchangeDataStream.next(data);
    });

    this.hubConnection.on('getOrder', data => {
      this.orderStream.next(data);
    });

    this.hubConnection.on('tradeHistory', data => {
      this.tradeHistoryStream.next(data);
    });

    this.hubConnection.on('chartRefresh', data => {
      this.chartRefreshStream.next(data);
    });

    this.hubConnection.on('marketRefresh', data => {
      this.marketRefreshStream.next(data);
    });

    this.hubConnection
      .start()
      .catch(() => {
        console.log('Signalr error');
      });
  }
}
