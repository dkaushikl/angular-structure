import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaComponent } from 'angular2-recaptcha/angular2-recaptcha';
import { environment } from '../../../environments/environment';
import { AuthenticationService, ToastService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Login, Response, VerifyTwoFactor } from '../../shared/model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  public isTwoFactor = false;
  public loginForm: FormGroup;
  public verifyOtpForm: FormGroup;
  public verifyTwoFactor: VerifyTwoFactor;
  public userId: number;
  isLoginSubmitted = false;
  public isEmailVerify = false;
  isVerifySubmitted = false;
  isLoading = false;
  public email: string;
  invalidCaptcha = false;
  captchaKey = environment.captchaKey;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  constructor(public authenticationService: AuthenticationService, public toast: ToastService,
    public router: Router) {
    this.BindForm();
  }

  BindForm() {
    this.loginForm = new FormGroup({
      'Email': new FormControl('', [Validators.required, Validators.email]),
      'Password': new FormControl('', [Validators.required])
    });
    this.verifyOtpForm = new FormGroup({
      'Code': new FormControl('', [Validators.required])
    });
  }

  Login(obj: Login, isValid: boolean) {
    this.isLoginSubmitted = true;
    if (environment.production) {
      const token = this.captcha.getResponse().toString();
      if (token === '') {
        this.invalidCaptcha = true;
        return;
      }
    }
    this.email = obj.Email;
    if (isValid) {
      this.isLoading = true;

      this.authenticationService.GetBrowserDet().subscribe((res: any) => {
        if (res != null) {
          obj.Country = res.country.name.toUpperCase();
          obj.IpAddress = res.ip;
          this.authenticationService.Login(obj).subscribe((data: any) => {
            if (data.Status === 'success') {
              if (data.msg === '2FA Verification') {
                this.isTwoFactor = true;
                this.userId = data.data;
              } else {
                this.SetLogin(data);
              }
            } else if (data.Status === 'emailpending') {
              this.isLoginSubmitted = false;
              this.isEmailVerify = true;
              this.toast.warning(data.msg);
            } else {
              this.toast.error(data.msg);
            }
            this.isLoading = false;
          });
        }
      });
    }
  }

  SetLogin(data) {
    localStorage.setItem('currentUser', JSON.stringify(data));
    this.authenticationService.CheckUserLoggedIn();
    window.location.href = '/user/market';
  }

  EmailVerify() {
    this.authenticationService.PendingEmailVerify(this.email).subscribe((data: any) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.isEmailVerify = false;
        this.toast.success(data.Message);
      } else {
        this.toast.error(data.Message);
      }
    });
  }

  VerifyOtp(obj: VerifyTwoFactor, isValid: boolean) {
    this.isVerifySubmitted = true;
    obj.UserId = this.userId;
    if (isValid) {
      this.authenticationService.VerifyTwoFactor(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          if (data.Data) {
            this.SetLogin(data.Data);
          } else {
            this.toast.warning('Invalid code');
          }
        } else {
          this.toast.error(data.Message);
        }
      });
    }
  }

  DisableTwoFactor() {
    this.router.navigate(['/account/disabletwofactor']);
  }

  GotoHome() {
    this.router.navigate(['/account/home']);
  }

  HandleCorrectCaptcha(data) {
    if (data === '') {
      this.invalidCaptcha = true;
    } else {
      this.invalidCaptcha = false;
    }
  }
}
