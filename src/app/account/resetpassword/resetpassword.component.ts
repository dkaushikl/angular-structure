import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, ToastService } from '../../core/service';
import { ApiResponseStatus, Validator } from '../../shared/common';
import { ResetPassword, Response } from '../../shared/model';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
})

export class ResetpasswordComponent {
  public resetPasswordForm: FormGroup;
  isResetPasswordSubmitted = false;
  isLoading = false;
  constructor(private route: ActivatedRoute, private router: Router,
    public authenticationService: AuthenticationService, public toast: ToastService) {
    this.BindForm();
  }

  BindForm() {
    this.resetPasswordForm = new FormGroup({
      'ConfirmPassword': new FormControl('', [Validators.required, Validator.checkPassword]),
      'Email': new FormControl('', [Validators.required]),
      'Password': new FormControl('', [Validators.required, Validators.minLength(8), Validator.strong]),
    });
  }

  ResetPwd(obj: ResetPassword, isValid: boolean) {
    obj.Code = this.route.snapshot.queryParams.Confirmationcode;
    this.isResetPasswordSubmitted = true;
    if (isValid) {
      this.isLoading = true;
      this.authenticationService.Reset(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.toast.success(data.Message);
          this.router.navigate(['/account/login']);
        } else {
          this.toast.error(data.Message);
        }
        this.isLoading = false;
      });
    }
  }
}
