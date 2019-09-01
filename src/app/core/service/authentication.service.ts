import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DisableTwoFactor, ForgotPassword, Login, Register, ResetPassword, VerifyTwoFactor } from '../../shared/model/authentication';
import { HttpService } from './http.service';


@Injectable()
export class AuthenticationService {
  isUserNameChanged: EventEmitter<string> = new EventEmitter<string>();
  isLoginChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, public httpService: HttpService) { }

  Register(obj: Register) {
    return this.http.post(`${environment.apiUrl}/User`, obj);
  }

  GetBrowserDet() {
    return this.http.get('https://geoip.nekudo.com/api');
  }

  Login(obj: Login) {
    return this.http.post(`${environment.apiUrl}/token`,
      `username=${obj.Email}&password=${obj.Password}&type=user&country=${obj.Country}&ipadd=${obj.IpAddress}`,
      this.httpService.GetHttpCommon());
  }

  Forgot(obj: ForgotPassword) {
    return this.http.post(`${environment.apiUrl}/User/ForgotPassword/${obj.Email}`, this.httpService.GetAuthHttpCommon());
  }

  ConfirmEmail(code: string) {
    return this.http.get(`${environment.apiUrl}/User/ConfirmUser?code=${code}`, this.httpService.GetAuthHttpCommon());
  }

  Reset(obj: ResetPassword) {
    return this.http.post(`${environment.apiUrl}/User/ResetPassword`, JSON.stringify(obj), this.httpService.GetAuthHttpCommon());
  }

  Disabletwofactor(obj: DisableTwoFactor) {
    return this.http.get(`${environment.apiUrl}/User/DisableTwoFactor?email=${obj.Email}`, this.httpService.GetAuthHttpCommon());
  }

  VerifyDisableTwoFactor(obj: DisableTwoFactor) {
    return this.http.post(`${environment.apiUrl}/User/VerifyDisableTwoFactor?code=${obj.Code}`, this.httpService.GetAuthHttpCommon());
  }

  VerifyWithdraw(id: any) {
    const isadmin = false;
    return this.http.get(`${environment.apiUrl}/Withdraw/VerifyWithdraw/${id}/${isadmin}`, this.httpService.GetAuthHttpCommon());
  }

  VerifyTwoFactor(obj: VerifyTwoFactor) {
    return this.http.post(`${environment.apiUrl}/User/VerifyTwoFactor`, JSON.stringify(obj), this.httpService.GetAuthHttpCommon());
  }

  PendingEmailVerify(email: string) {
    return this.http.get(`${environment.apiUrl}/User/EmailVerifyByUser/${email}`, this.httpService.GetAuthHttpCommon());
  }

  CheckUserBlock() {
    return this.http.get(`${environment.apiUrl}/User/CheckUserBlock`, this.httpService.GetAuthHttpCommon());
  }

  CheckUserLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const setDate: any = new Date(Date.parse(currentUser.SetDate));
      const currentDate: any = new Date();
      const hourdiff: number = currentDate - setDate;
      const hours = Math.floor(hourdiff / 3600 / 1000);

      if (hours >= 2) {
        this.isUserNameChanged.emit('');
        this.isLoginChanged.emit(false);
        localStorage.removeItem('currentUser');
        window.location.href = '/user/home';
        return false;
      }

      const name = `${currentUser.Firstname}${currentUser.Lastname}` === '' ? currentUser.Email :
        `${currentUser.Firstname} ${currentUser.Lastname}`;
      this.isUserNameChanged.emit(name);
      this.isLoginChanged.emit(true);
      return true;
    }
    this.isUserNameChanged.emit('');
    this.isLoginChanged.emit(false);
    return false;
  }

  GetUserName(): string {
    if (localStorage.getItem('currentUser')) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return currentUser.Firstname === null || currentUser.Lastname === null
        ? currentUser.Email : `${currentUser.Firstname} ${currentUser.Lastname}`;
    }
    return '';
  }

  TempLogin(id: number) {
    return this.http.get(`${environment.apiUrl}/User/UserLoginByAdmin?id=${id}`);
  }

  Logout() {
    localStorage.removeItem('currentUser');
    this.CheckUserLoggedIn();
  }
}
