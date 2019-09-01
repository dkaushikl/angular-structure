export class ExchangeModal {
  public BuyMinimum: number;
  public SellMinimum: number;
  public BuyFees: string;
  public SellFees: string;
  public BaseValue: number;
  public MainValue: number;
  public BuyTotalFees: string;
  public BuyTotal: string;
  public BuyPrice: number;
  public BuyAmount: number;
  public BaseCurrency: string;
  public MainCurrency: string;
  public SellTotalFees: string;
  public SellTotal: string;
  public SellPrice: number;
  public SellAmount: number;
}

export class StopLimitModel {
  public pairId: number;
  public BaseCurrency: string;
  public MainCurrency: string;
  public BuyStop: number ;
  public BuyLimit: number;
  public BuyAmount: number;
  public BuyTotal: number;

  public SellStop: number ;
  public SellLimit: number;
  public SellAmount: number;
  public SellTotal: number;

  public OrderType: number;
  public BaseValue: number;
  public MainValue: number;
}

export class Exchange {
  public FromCoin: string;
  public ToCoin: string;
  public Price: string;
  public Amount: string;
}

export class DailyExchange {
  LastPrice: string;
  TodayOpen: number;
  Volume: number;
  DailyChange: number;
  Highest24Hours: number;
  Lowest24Hours: number;
}

export class ExchangePriceModel {
  RowNum: number;
  Price: number;
  Amount: number;
  Total: number;
  GrandTotal: number;
}
