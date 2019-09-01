import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService, UserService } from '../../core/service';
import { ApiResponseStatus, Validator } from '../../shared/common';
import { ChangePassword, Response } from '../../shared/model';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
})
export class ChangepasswordComponent {
  public ChangePasswordForm: FormGroup;
  IsChangePasswordSubmitted = false;
  isLoading = false;

  constructor(public fb: FormBuilder, public userService: UserService, public toast: ToastService) {
    this.BindForm();
  }

  BindForm() {
    this.ChangePasswordForm = this.fb.group({
      'ConfirmPassword': new FormControl('', [Validators.required, Validator.MatchPassword]),
      'NewPassword': new FormControl('', [Validators.required, Validators.minLength(8), Validator.strong]),
      'OldPassword': new FormControl('', [Validators.required]),
    });
  }

  ChangePassword(obj: ChangePassword, isValid: boolean) {
    this.IsChangePasswordSubmitted = true;
    if (isValid) {
      this.isLoading = true;
      this.userService.ChangePassword(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.ChangePasswordForm.reset();
          this.IsChangePasswordSubmitted = false;
          this.toast.success(data.Message);
        } else {
          this.toast.error(data.Message);
        }
        this.isLoading = false;
      });
    }
  }

}
