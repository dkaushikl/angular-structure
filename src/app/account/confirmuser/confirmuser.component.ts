import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, ToastService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Response } from '../../shared/model';


@Component({
  selector: 'app-confirmuser',
  templateUrl: './confirmuser.component.html'
})

export class ConfirmuserComponent implements OnInit {
  userId: string;
  code: string;

  constructor(private route: ActivatedRoute, private authenticationService: AuthenticationService,
    private router: Router, public toast: ToastService) {
  }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code;
    if (this.code) {
      this.authenticationService.ConfirmEmail(this.code).subscribe((data: Response) => {
        data.ResponseStatus === ApiResponseStatus.Ok ? this.toast.success(data.Message) : this.toast.error(data.Message);
        this.router.navigate(['/account/login']);
      });
    }
  }
}
