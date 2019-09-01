import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.directive';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { ToastService, UserService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Response, UserSupport } from '../../shared/model';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
})

export class SupportComponent implements OnInit {
  @ViewChild(ModalDirective) public modal: ModalDirective;
  @ViewChild('replyModal') replyModal: ModalDirective;
  public supportForm: FormGroup;
  public replyForm: FormGroup;
  loading = false;
  IsOpen = false;
  replyId: number;
  supportTicket: any;
  isSupportFormSubmitted: boolean;
  isReplyFormSubmitted: boolean;
  replyLoading: boolean;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(public userService: UserService, public fb: FormBuilder,
    public toast: ToastService) {
    this.GetSupportTicket();
  }
  ngOnInit() {
    this.BindForm();
  }

  BindForm() {
    this.supportForm = this.fb.group({
      'Message': ['', Validators.required],
      'Subject': ['', Validators.required],
      'Title': ['', Validators.required],
    });
    this.replyForm = this.fb.group({
      'Message': ['', Validators.required]
    });
  }

  GetSupportTicket() {
    this.loading = true;
    this.userService.GetSupportTicket().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        if (data.Data != null) {
          this.supportTicket = data.Data;
        }
      } else {
        this.toast.error(data.Message);
      }
      this.loading = false;
    });
  }

  AddReply(obj) {
    this.replyId = obj.Id;
    this.replyModal.show();
  }

  GenerateTicket() {
    this.modal.show();
    this.IsOpen = true;
  }

  ClosePopUp() {
    this.modal.hide();
    this.IsOpen = false;
  }

  SaveSupportTicket(model: UserSupport, isValid: boolean) {
    this.isSupportFormSubmitted = true;
    if (isValid) {
      this.loading = true;
      this.userService.SaveSupportTicket(model).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.supportForm.reset();
          this.ClosePopUp();
          this.GetSupportTicket();
          this.toast.success(data.Message);
        } else {
          this.toast.error(data.Message);
        }
        this.loading = false;
        this.isSupportFormSubmitted = false;
      });
    }
  }

  CloseReplyPopUp() {
    this.replyModal.hide();
  }

  ReplyTicket(model: any, isValid: boolean) {
    this.isReplyFormSubmitted = true;
    if (isValid) {
      const obj = {
        Id: this.replyId,
        Reply: model.Message
      };
      this.replyLoading = true;
      this.userService.AddReplyTicket(obj).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.replyForm.reset();
          this.CloseReplyPopUp();
          this.GetSupportTicket();
          this.toast.success(data.Message);
        } else {
          this.toast.error(data.Message);
        }
        this.replyLoading = false;
      });
      this.isReplyFormSubmitted = false;
    }
  }
}
