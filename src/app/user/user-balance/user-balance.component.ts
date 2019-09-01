import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { ToastService, UserService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Response } from '../../shared/model';

@Component({
  selector: 'app-user-balance',
  templateUrl: './user-balance.component.html',
})

export class UserBalanceComponent implements OnInit {
  userWalletBalances = [];
  isUserWalletBlock = true;
  loading = false;
  filterZero = false;
  filterText = '';
  amount: '';
  address: '';
  elementType: 'url';
  value = '';
  public config: PerfectScrollbarConfigInterface = {};
  public withdrawForm: FormGroup;
  arrCurr = [];
  depositStatus = false;
  withdrawStatus = false;
  fees: '';
  limit: '';
  available: '';
  coin: String = '';
  currencyId: 0;
  selectedDeposit = 0;
  selectedWithdraw = 0;
  tabActive: string;
  isLoading = false;
  isTwoFactorVerification = false;
  TwoFactCode = '';

  constructor(private userService: UserService, public toast: ToastService, public fb: FormBuilder) {  }

  ngOnInit() {
    this.tabActive = 'Overview';
    this.GetUserBalance();
    this.bindData();
    this.CheckTwoFactor();
  }

  ApplyCss(evt) {
    this.tabActive = evt.target.id;
  }

  bindData() {
    this.withdrawForm = this.fb.group({
      'Address': new FormControl('', [Validators.required]),
      'Amount': new FormControl('', [Validators.required]),
      'TwoFactCode': new FormControl('', []),
    });
  }

  CheckTwoFactor() {
    this.userService.CheckTwoFactor().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.isTwoFactorVerification = data.Data.IsTwoFactorVerification;
      } else {
        this.toast.error(data.Message);
      }
    });
  }

  GetUserBalance() {
    this.loading = true;
    this.userService.GetUserBalance().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.userWalletBalances = data.Data.dataList;
        this.isUserWalletBlock = data.Data.IsUserWalletBlock;
      } else {
        this.toast.error(data.Message);
      }
      this.loading = false;
    });
  }

  enableDeposit(event) {
    this.loading = true;
    this.coin = event != null ? event.target[event.target.selectedIndex].text : this.coin;
    this.currencyId = event != null ? event.target.value : this.selectedDeposit;

    this.userService.GetDepositAddress(this.currencyId).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.value = data.Data;
      } else {
        this.toast.error(data.Message);
      }
      this.loading = false;
    });
  }

  enableWithdraw(event) {
    this.loading = true;
    this.coin = event != null ? event.target[event.target.selectedIndex].text : this.coin;
    this.currencyId = event != null ? event.target.value : this.selectedWithdraw;

    this.userService.GetWalletDetail(this.currencyId).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.fees = data.Data.WithdrawFee;
        this.available = data.Data.WalletAmount;
        this.limit = data.Data.MaxWithdrawLimit;
      } else {
        this.toast.error(data.Message);
      }
      this.loading = false;
    });
  }

  postWithdraw(isValid) {
    this.isLoading = true;
    if (isValid) {
      const obj = {
        Address: this.address,
        CurrencyId: this.currencyId,
        Fee: this.fees,
        WithdrawAmount: parseFloat(this.amount),
        TwoFactCode: this.TwoFactCode
      };
      this.userService.PostWithdraw(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.toast.success(data.Message);
            this.selectedDeposit = 0;
            this.selectedWithdraw = 0;
          this.withdrawForm.reset();
        } else {
          this.toast.error(data.Message);
        }
        this.isLoading = false;
      });
    }
  }

  btnDeposit(event) {
    this.coin = event.Coin;
    this.selectedDeposit = event.CurrencyId;
    this.tabActive = 'Deposit';
    this.enableDeposit(null);
  }

  btnWithdraw(event) {
    this.coin = event.Coin;
    this.tabActive = 'Withdraw';
    this.selectedWithdraw = event.CurrencyId;
    this.enableWithdraw(null);
  }
}
