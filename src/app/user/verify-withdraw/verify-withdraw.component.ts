import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/service/authentication.service';
import { Response } from '../../shared/model/Response';
import { ToastrService } from 'ngx-toastr';
import { ApiResponseStatus } from '../../shared/common/';


@Component({
  selector: 'app-verify-withdraw',
  templateUrl: './verify-withdraw.component.html',
})
export class VerifyWithdrawComponent implements OnInit {
  isLoading = false;
  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService,
      private router: Router, public toast: ToastrService) { }

  ngOnInit() {
    const id = this.route.snapshot.queryParams.id;
    this.isLoading = true;
    this.authenticationService.VerifyWithdraw(id).subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.toast.success(data.Message);
        this.router.navigate(['user/home']);
      } else {
        this.toast.error(data.Message);
      }
      this.isLoading = false;
    });
  }
}
