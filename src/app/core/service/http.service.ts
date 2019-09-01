import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {
  GetAuthHttpCommon() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.AccessToken;
    return { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token).set('Content-Type', 'application/json') };
  }

  GetOnlyAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.AccessToken;
    return { headers: new HttpHeaders().set('Authorization', 'Bearer ' + token) };
  }

  GetJsonHttpCommon() {
    return { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  }

  GetHttpCommon() {
    return { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded') };
  }
}
