import { Component, Input, OnChanges } from '@angular/core';
import { ExchangeService, TradeService } from '../../core/service';
import { Response } from '../../shared/model';
import { ApiResponseStatus } from '../../shared/common';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})

export class OrdersComponent implements OnChanges {
  buyData = [];
  sellData = [];
  totalBuy: string;
  totalSell: string;
  buyCount = 0;
  loading = false;
  config: PerfectScrollbarConfigInterface = {};

  @Input() baseCurrency: string;
  @Input() mainCurrency: string;
  @Input() pairId: string;

  constructor(
    public exchangeService: ExchangeService,
    public tradeService: TradeService
  ) {
    this.GetOrderObservable();
  }

  GetOrder(): void {
    this.loading = true;
    const pair = `${this.mainCurrency}/${this.baseCurrency}`;
    this.exchangeService.GetOrder(pair).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.buyData = data.Data.buyList;
        this.sellData = data.Data.sellList;
        this.totalBuy = parseFloat(data.Data.buyTotal).toFixed(8);
        this.totalSell = parseFloat(data.Data.sellTotal).toFixed(8);
        this.loading = false;
      }
    });
  }

  GetOrderObservable() {
    this.tradeService.orderAll$().subscribe((data: any) => {
      this.buyData = data.buyList;
      this.sellData = data.sellList;
      this.totalBuy = parseFloat(data.buyTotal).toFixed(8);
      this.totalSell = parseFloat(data.sellTotal).toFixed(8);
    });
  }

  ngOnChanges(change: any) {
    this.pairId =
      change.pairId !== undefined ? change.pairId.currentValue : this.pairId;
    this.baseCurrency =
      change.baseCurrency !== undefined
        ? change.baseCurrency.currentValue
        : this.baseCurrency;
    this.mainCurrency =
      change.mainCurrency !== undefined
        ? change.mainCurrency.currentValue
        : this.mainCurrency;
    this.GetOrder();
  }
}
