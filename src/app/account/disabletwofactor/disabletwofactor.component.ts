import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, ToastService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { DisableTwoFactor, Response } from '../../shared/model';


@Component({
  selector: 'app-disabletwofactor',
  templateUrl: './disabletwofactor.component.html',
})

export class DisabletwofactorComponent {
  public disableForm: FormGroup;
  public verifyForm: FormGroup;
  isdisableFormSubmitted: boolean;
  isDisable = true;
  constructor(public authenticationService: AuthenticationService, public toast: ToastService, private router: Router) {
    this.BindData();
  }

  BindData() {
    this.disableForm = new FormGroup({
      'Email': new FormControl('', [Validators.required])
    });
    this.verifyForm = new FormGroup({
      'Code': new FormControl('', [Validators.required])
    });
  }

  Disabletwofactor(obj: DisableTwoFactor, isValid: boolean) {
    this.isdisableFormSubmitted = true;
    if (isValid) {
      this.authenticationService.Disabletwofactor(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.isdisableFormSubmitted = false;
          this.isDisable = false;
          this.toast.success(data.Message);
        } else {
          this.toast.error(data.Message);
        }
      });
    }
  }

  Verifytwofactor(obj: DisableTwoFactor, isValid: boolean) {
    if (isValid) {
      this.authenticationService.VerifyDisableTwoFactor(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.toast.success(data.Message);
          this.router.navigate(['/account/login']);
        } else {
          this.toast.error(data.Message);
        }
      });
    }
  }
}
