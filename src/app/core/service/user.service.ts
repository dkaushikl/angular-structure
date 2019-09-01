import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChangePassword, TwoFactor } from '../../shared/model';
import { HttpService } from './http.service';

@Injectable()
export class UserService {
  constructor(private http: HttpClient, public httpService: HttpService) { }

  SaveUserProfile(obj: any) {
    return this.http.put(`${environment.apiUrl}User`, obj, this.httpService.GetOnlyAuth());
  }

  GetUserDetails() {
    return this.http.get(`${environment.apiUrl}/User/GetUser`, this.httpService.GetAuthHttpCommon());
  }

  ChangePassword(obj: ChangePassword) {
    return this.http.post(`${environment.apiUrl}/User/ChangePassword`, obj, this.httpService.GetAuthHttpCommon());
  }

  CheckTwoFactor() {
    return this.http.get(`${environment.apiUrl}/User/CheckTwoFactor`, this.httpService.GetAuthHttpCommon());
  }

  EnableTwoFactor(obj: TwoFactor) {
    return this.http.post(`${environment.apiUrl}/User/EnableTwoFactor`, JSON.stringify(obj), this.httpService.GetAuthHttpCommon());
  }

  DisableTwoFactor(obj: TwoFactor) {
    return this.http.post(`${environment.apiUrl}/User/DisableTwoFactor`, obj, this.httpService.GetAuthHttpCommon());
  }

  SaveSupportTicket(obj) {
    return this.http.post(`${environment.apiUrl}/Support/SaveSupportTicket`, obj, this.httpService.GetAuthHttpCommon());
  }

  AddReplyTicket(obj) {
    return this.http.post(`${environment.apiUrl}/Support/UpdateSupportTicket`, obj, this.httpService.GetAuthHttpCommon());
  }

  GetSupportTicket() {
    return this.http.get(`${environment.apiUrl}/User/GetSupportTicket`, this.httpService.GetAuthHttpCommon());
  }

  GetAllCountry() {
    return this.http.get(`${environment.apiUrl}/Country/GetAllCountries`, this.httpService.GetAuthHttpCommon());
  }

  GetOpenOrderList() {
    return this.http.get(`${environment.apiUrl}/User/GetOpenOrderList`, this.httpService.GetAuthHttpCommon());
  }

  GetUserBalance() {
    return this.http.get(`${environment.apiUrl}/User/GetUserBalance`, this.httpService.GetAuthHttpCommon());
  }

  GetWalletDetail(currencyId: any) {
    return this.http.get(`${environment.apiUrl}/Withdraw/GetWalletDetail/${currencyId}`, this.httpService.GetAuthHttpCommon());
  }

  GetDepositAddress(currencyId: any) {
    return this.http.get(`${environment.apiUrl}/Deposit/GenerateDepositAddress?currencyId=${currencyId}`,
      this.httpService.GetAuthHttpCommon());
  }

  PostWithdraw(obj: any) {
    return this.http.post(`${environment.apiUrl}/Withdraw`, obj, this.httpService.GetAuthHttpCommon());
  }

  GetUserDepositeWithdraw() {
    return this.http.get(`${environment.apiUrl}/User/GetUserDepositeWithdraw`, this.httpService.GetAuthHttpCommon());
  }
}
