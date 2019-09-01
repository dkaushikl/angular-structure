import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { AuthenticationService, ToastService, UserService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Response } from '../../shared/model';

@Component({
  selector: 'app-balance-history',
  templateUrl: './balance-history.component.html',
})

export class BalanceHistoryComponent {
  dataDepositList: any;
  dataWithdrawList: any;
  public config: PerfectScrollbarConfigInterface = {};
  loading = false;
  constructor(private userService: UserService, private toast: ToastService,
    public authenticationService: AuthenticationService) {
    this.GetUserDepositeWithdraw();
    this.authenticationService.CheckUserLoggedIn();
  }

  GetUserDepositeWithdraw() {
    this.loading = true;
    this.userService.GetUserDepositeWithdraw().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        if (data.Data != null) {
          this.dataDepositList = data.Data.Table;
          this.dataWithdrawList = data.Data.Table1;
        }
      } else {
        this.toast.error(data.Message);
      }
      this.loading = false;
    });
  }

}
