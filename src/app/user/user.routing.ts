import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards';
import { BalanceHistoryComponent } from './balance-history/balance-history.component';
import { HomeComponent } from './home/home.component';
import { MarketdataComponent } from './marketdata/marketdata.component';
import { OpenOrderComponent } from './open-order/open-order.component';
import { SupportComponent } from './support/support.component';
import { TradeHistoryComponent } from './trade-history/trade-history.component';
import { UserBalanceComponent } from './user-balance/user-balance.component';
import { VerifyWithdrawComponent } from './verify-withdraw/verify-withdraw.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'user', canActivate: [AuthGuard] },
      { path: 'market', component: MarketdataComponent, canActivate: [AuthGuard] },
      { path: 'support', component: SupportComponent, canActivate: [AuthGuard] },
      { path: 'openorder', component: OpenOrderComponent, canActivate: [AuthGuard] },
      { path: 'balance', component: UserBalanceComponent, canActivate: [AuthGuard] },
      { path: 'balancehistory', component: BalanceHistoryComponent, canActivate: [AuthGuard] },
      { path: 'tradehistory', component: TradeHistoryComponent, canActivate: [AuthGuard] },
      { path: 'verifywithdraw', component: VerifyWithdrawComponent, canActivate: [AuthGuard] },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class UserRoutingModule { }

