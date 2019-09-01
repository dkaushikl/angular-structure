import { NgModule } from '@angular/core';
import { ExchangeModule } from '../exchange';
import { SharedModule } from '../shared';
import { UiModule } from '../ui';
import { BalanceHistoryComponent } from './balance-history/balance-history.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { HomeComponent } from './home/home.component';
import { MarketdataComponent } from './marketdata/marketdata.component';
import { OpenOrderComponent } from './open-order/open-order.component';
import { ProfileComponent } from './profile/profile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SupportComponent } from './support/support.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { UserBalanceComponent } from './user-balance/user-balance.component';
import { UserRoutingModule } from './user.routing';
import { VerifyWithdrawComponent } from './verify-withdraw/verify-withdraw.component';

const component = [HomeComponent, SidebarComponent, ChangepasswordComponent,
  ProfileComponent, TwoFactorComponent,  SupportComponent, OpenOrderComponent,
  BalanceHistoryComponent, TradeHistoryComponent, MarketdataComponent, UserBalanceComponent, VerifyWithdrawComponent];

@NgModule({
  exports: [],
  declarations: [...component],
  imports: [SharedModule, UiModule, ExchangeModule, UserRoutingModule],
})

export class UserModule { }
