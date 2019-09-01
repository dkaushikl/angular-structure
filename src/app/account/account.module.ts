import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { UiModule } from '../ui';
import { AccountRoutingModule } from './account.routing';
import { ConfirmuserComponent } from './confirmuser/confirmuser.component';
import { DisabletwofactorComponent } from './disabletwofactor/disabletwofactor.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { TemploginComponent } from './templogin/templogin.component';

const component = [LoginComponent, RegisterComponent, ConfirmuserComponent,
  ForgotpasswordComponent, ResetpasswordComponent, TemploginComponent, DisabletwofactorComponent];

@NgModule({
  imports: [SharedModule, UiModule, AccountRoutingModule],
  declarations: [...component],
})

export class AccountModule { }
