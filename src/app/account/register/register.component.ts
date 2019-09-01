import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaComponent } from 'angular2-recaptcha/angular2-recaptcha';
import { environment } from '../../../environments/environment';
import { AuthenticationService, ToastService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Validator } from '../../shared/common/common.validator';
import { Register, Response } from '../../shared/model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})

export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  isregisterSubmitted = false;
  isTermsConditionChecked = false;
  isLoading = false;
  invalidCaptcha = false;
  captchaKey = environment.captchaKey;

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  constructor(public fb: FormBuilder, public authenticationService: AuthenticationService,
    public toast: ToastService, public router: Router) {
    this.BindForm();
  }

  ngOnInit() {
  }

  BindForm() {
    this.registerForm = this.fb.group({
      'ConfirmPassword': new FormControl('', [Validators.required, Validator.checkPassword]),
      'Email': new FormControl('', [Validators.required]),
      'Password': new FormControl('', [Validators.required, Validators.minLength(8), Validator.strong]),
      'TermsCondition': new FormControl('', []),
    });
  }

  TermsConditionChecked(evt) {
    this.isTermsConditionChecked = evt.target.checked;
  }

  Register(model: Register, isValid: boolean) {
    this.isregisterSubmitted = true;
    const token = this.captcha.getResponse().toString();
    if (token === '') {
      this.invalidCaptcha = true;
      return;
    }
    if (isValid && this.isTermsConditionChecked) {
      this.isLoading = true;
      this.authenticationService.Register(model).subscribe((data: Response) => {
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

  HandleCorrectCaptcha(data) {
    if (data === '') {
      this.invalidCaptcha = true;
    } else {
      this.invalidCaptcha = false;
    }
  }
}
