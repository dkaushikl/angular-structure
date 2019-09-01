import { Component, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { ExchangeService } from '../../core/service/exchange.service';
import { ApiResponseStatus } from '../../shared/common';
import { Response, TradeHistorySearch } from '../../shared/model';
declare var $: any;

@Component({
  selector: 'app-trade-history',
  templateUrl: './trade-history.component.html',
})
export class TradeHistoryComponent implements OnInit {
  ope = true;
  mainCurrencyList: any;
  baseCurrencyList: any;
  tradeHisList: any;
  avgBuyPrice: number;
  avgSellPrice: number;
  totalBuyPrice: number;
  totalSellPrice: number;
  loading = false;
  hiddenSummaryDiv = true;
  config: PerfectScrollbarConfigInterface = {};
  tradeHistorySearch: TradeHistorySearch;

  constructor(private exchangeService: ExchangeService) {
    this.tradeHistorySearch = new TradeHistorySearch();
  }

  ngOnInit() {
    this.BindCurrencyList();
    this.tradeHistorySearch.BuySellType = 0;
    this.tradeHistorySearch.MainCurrency = 0;
    this.tradeHistorySearch.BaseCurrency = 0;
    this.hiddenSummaryDiv = true;
    this.FnAnalyzeUserTradeHistory(null);
    const scroll = $('.cr__inner_content').innerHeight() - 192;
    $('.trade__table_scroll').height(scroll);
  }

  onFilterChanged(evt) {
    this.hiddenSummaryDiv = true;
    if (this.ope === true) {
      this.ope = false;
    }
  }
  FnReset() {
    this.tradeHistorySearch = new TradeHistorySearch();
    this.tradeHistorySearch.BuySellType = 0;
    this.tradeHistorySearch.MainCurrency = 0;
    this.tradeHistorySearch.BaseCurrency = 0;
    this.FnAnalyzeUserTradeHistory(null);
    this.hiddenSummaryDiv = true;
  }
  BindCurrencyList() {
    this.exchangeService.BindCurrencyList().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.mainCurrencyList = data.Data.filter(function (el) {
          return el.Type === 'MAIN';
        });
        this.baseCurrencyList = data.Data.filter(function (el) {
          return el.Type === 'BASE';
        });
      }
    });
  }
  FnAnalyzeUserTradeHistory(event) {
    if (event != null) {
      this.hiddenSummaryDiv = event.target.id === 'BTNANALYZE' ? false : true;
    }
    this.loading = true;
    const jsonObj = {
      BaseCurrency: this.tradeHistorySearch.BaseCurrency,
      MainCurrency: this.tradeHistorySearch.MainCurrency
    };
    this.exchangeService.GetUserTradeAnalyze(jsonObj)
      .subscribe((data: any) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.tradeHisList = data.Data.Table;
          const tradeSummary = data.Data.Table1;
          this.avgBuyPrice = tradeSummary[0].AvgPrice;
          this.totalBuyPrice = tradeSummary[0].Total;
          this.avgSellPrice = tradeSummary[1].AvgPrice;
          this.totalSellPrice = tradeSummary[1].Total;
        }
        this.loading = false;
      });
  }

}
