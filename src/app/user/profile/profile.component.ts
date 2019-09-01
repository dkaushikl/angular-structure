import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastService, UserService } from '../../core/service';
import { ApiResponseStatus } from '../../shared/common';
import { Common } from '../../shared/common/common.utility';
import { Response, User } from '../../shared/model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileAvt: ElementRef;
  @Output() avtarEvent = new EventEmitter<string>();
  isLoading = false;
  isPhotoUploaded = true;
  userModel: User;
  public userProfileForm: FormGroup;
  public options: any;
  public isProfileSubmitted = false;
  public avtarSrc = '/assets/images/ic_svg/user.svg';
  constructor(public userService: UserService, public toast: ToastService, public common: Common,
  ) {
    this.GetUserDetails();
    this.GetCountry();
    this.BindForm();
  }

  ngOnInit() {
    this.userModel = new User();
  }

  BindForm() {
    this.userProfileForm = new FormGroup({
      'Address': new FormControl('', [Validators.required]),
      'City': new FormControl('', [Validators.required]),
      'CountryId': new FormControl('', [Validators.required]),
      'FirstName': new FormControl('', [Validators.required]),
      'LastName': new FormControl('', [Validators.required]),
      'Photo': new FormControl('', [Validators.required]),
    });
  }

  GetUserDetails() {
    this.userService.GetUserDetails().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.userModel = data.Data;
        if (this.userModel.Photo != null && this.userModel.Photo !== '') {
          this.avtarSrc = environment.apiUrl.replace('/api/', '') + '/Content/ProfilePhoto/' + this.userModel.Photo;
        }
        this.userProfileForm.controls.Photo.setValue(this.avtarSrc);
        this.avtarEvent.emit(this.avtarSrc);
      } else {
        this.toast.error(data.Message);
      }
    });
  }
  @HostListener('onFileChange')
  onFileChange(event) {
    this.avtarSrc = '';
    this.isPhotoUploaded = false;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avtarSrc = e.target.result;
        this.avtarEvent.emit(this.avtarSrc);
      };
      reader.readAsDataURL(event.target.files[0]);
      this.userProfileForm.controls.Photo.setValue(event.target.files[0] ? event.target.files[0].name : '');
    }
  }
  SaveUserProfile(model: User, form, valid: boolean) {
    this.isProfileSubmitted = true;
    if (valid) {
      this.isLoading = true;
      const inputEl: HTMLInputElement = this.fileAvt.nativeElement;
      const fileCount: number = inputEl.files.length;
      const formData = new FormData();
      if (fileCount > 0) {
        formData.append('ProfileImage', inputEl.files.item(0));
      }
      formData.append('FirstName', model.FirstName);
      formData.append('LastName', model.LastName);
      formData.append('CountryId', model.CountryId.toString());
      formData.append('Address', model.Address);
      formData.append('City', model.City);

      this.userService.SaveUserProfile(formData).subscribe((data: Response) => {
        if (data.ResponseStatus === ApiResponseStatus.Ok) {
          this.toast.success(data.Message);
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          currentUser.Firstname = model.FirstName;
          currentUser.Lastname = model.LastName;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          this.avtarSrc = environment.apiUrl.replace('/api/', '') + '/Content/ProfilePhoto/' + data.Data.Photo;
          this.avtarEvent.emit(this.avtarSrc);
          window.location.reload();
        } else {
          this.toast.error(data.Message);
        }
        this.isLoading = false;
      });
    }
  }

  GetCountry() {
    return this.userService.GetAllCountry().subscribe((data: Response) => {
      if (data.ResponseStatus === ApiResponseStatus.Ok) {
        this.options = new Array(data.Data.length + 1);
        this.options[0] = { id: '', text: '--Select Country--' };
        for (let i = 1; i <= data.Data.length; i++) {
          this.options[i] = {
            id: data.Data[i - 1].CountryId,
            text: data.Data[i - 1].CountryName,
          };
        }
      }
    });
  }
  OnSelect(event) {
    this.userModel.CountryId = event;
  }
}
