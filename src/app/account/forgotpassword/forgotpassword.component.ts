import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, ToastService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { ForgotPassword, Response } from '../../shared/model';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
})
export class ForgotpasswordComponent {
  public forgotPasswordForm: FormGroup;
  isForgetPasswordSubmitted = false;
  isLoading = false;
  constructor(public authenticationService: AuthenticationService, public toast: ToastService) {
    this.BindForm();
  }

  BindForm() {
    this.forgotPasswordForm = new FormGroup({
      'Email': new FormControl('', [Validators.required])
    });
  }

  ForgotPwd(obj: ForgotPassword, isValid: boolean) {
    this.isForgetPasswordSubmitted = true;
    if (isValid) {
      this.isLoading = true;
      this.authenticationService.Forgot(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.toast.success(data.Message);
          this.isForgetPasswordSubmitted = false;
          this.forgotPasswordForm.reset();
        } else {
          this.toast.error(data.Message);
        }
        this.isLoading = false;
      });
    }
  }
}
