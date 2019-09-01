import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import Swal from 'sweetalert2';
import { ExchangeService, ToastService, UserService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Response } from '../../shared/model';

@Component({
  selector: 'app-open-order',
  templateUrl: './open-order.component.html',
})

export class OpenOrderComponent {
  openOrderlist: any;
  public config: PerfectScrollbarConfigInterface = {};
  loading = false;
  constructor(private userService: UserService, private toast: ToastService,
    private exchangeService: ExchangeService) {
    this.GetOpenOrders();
   }

  GetOpenOrders() {
    this.loading = true;
    this.userService.GetOpenOrderList().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        if (data.Data != null) {
          this.openOrderlist = data.Data;
        }
      } else {
        this.toast.error(data.Message);
      }
      this.loading = false;
    });
  }

  CancelOrder(row) {
    Swal({
      cancelButtonText: 'No, keep it',
      confirmButtonText: 'Yes, cancel it!',
      showCancelButton: true,
      text: 'You will not be able to recover this data!',
      title: 'Are you sure?',
      type: 'warning',
    }).then(result => {
      if (result.value) {
        this.exchangeService.CancelOrder(row.Id).subscribe((data: Response) => {
          if (data.Message === 'Trade canceled successfully.') {
            this.GetOpenOrders();
            this.toast.success(data.Message);
          } else {
            this.toast.error(data.Message);
          }
        });
      } else {
        this.toast.success('Your data is safe :)');
      }
    });
  }
}
