import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToastService {

  constructor(public toast: ToastrService) {
  }

  success(message: any) {
    return this.toast.success(message);
  }

  warning(message: any) {
    return this.toast.warning(message);
  }

  error(message: any) {
    return this.toast.error(message);
  }
}
