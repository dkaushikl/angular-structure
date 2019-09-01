import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService, UserService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Response, TwoFactor } from '../../shared/model';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
})

export class TwoFactorComponent {

  twoFactorQrCode: string;
  manualId: string;
  isTwoFactorVerification: boolean;
  isDisable: boolean;
  isActiveTwoFactorSubmitted = false;
  isDeactiveTwoFactorSubmitted = false;
  isActiveLoading = false;
  isDeactiveLoading = false;
  public activeForm: FormGroup;
  public disableForm: FormGroup;

  constructor(public toast: ToastService, public userService: UserService) {
    this.CheckTwoFactor();
    this.BindForm();
  }

  BindForm() {
    this.disableForm = new FormGroup({
      'Password': new FormControl('', [Validators.required]),
      'Pin': new FormControl('', [Validators.required]),
    });
    this.activeForm = new FormGroup({
      'Password': new FormControl('', [Validators.required]),
      'Pin': new FormControl('', [Validators.required]),
    });
  }

  CheckTwoFactor() {
    this.userService.CheckTwoFactor().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.isTwoFactorVerification = data.Data.IsTwoFactorVerification;
        this.isDisable = true;
        this.twoFactorQrCode = data.Data.qrCode;
        this.manualId = data.Data.manualId;
      } else {
        this.toast.error(data.Message);
      }
    });
  }

  EnableTwoFactor(obj: TwoFactor, valid: boolean) {
    this.isActiveTwoFactorSubmitted = true;
    if (valid) {
      this.isActiveLoading = true;
      this.userService.EnableTwoFactor(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          if (data.Data) {
            this.isActiveTwoFactorSubmitted = false;
            this.CheckTwoFactor();
            this.activeForm.reset();
            this.toast.success(data.Message);
          }
        } else {
          this.toast.error(data.Message);
        }
        this.isActiveLoading = false;
      });
    }
  }

  DisableTwoFactor(obj: TwoFactor, valid: boolean) {
    this.isDeactiveTwoFactorSubmitted = true;
    if (valid) {
      this.userService.DisableTwoFactor(obj).subscribe((data: Response) => {
        this.isDeactiveLoading = true;
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.isDeactiveTwoFactorSubmitted = false;
          this.CheckTwoFactor();
          this.disableForm.reset();
          this.toast.success(data.Message);
        } else {
          this.toast.error(data.Message);
        }
        this.isDeactiveLoading = false;
      });
    }
  }
}
