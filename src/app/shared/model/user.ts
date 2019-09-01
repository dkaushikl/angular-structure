export class User {
  public UserId: number;
  public FirstName: string;
  public Username: string;
  public LastName: string;
  public Email: string;
  public CountryId: number;
  public Address: string;
  public State: string;
  public City: string;
  public Photo: string;
}

export class UserSupport {
  public SupportId: number;
  public UserId: number;
  public Subject: string;
  public Title: string;
  public Message: string;
  public Status: number;
  public Reply: string;
  public OnDate: Date;
}

export class TradeHistorySearch {
  public FromDate: Date | string;
  public ToDate: Date | string;
  public BuySellType: number;
  public MainCurrency: number;
  public BaseCurrency: number;
}

export class TwoFactor {
  public Password: string;
  public Pin: string;
}
