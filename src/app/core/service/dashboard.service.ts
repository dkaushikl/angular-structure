import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient, public httpService: HttpService) {}

  GetAdvertise() {
    return this.http.get(`${environment.apiUrl}/Advertise`);
  }

  GetApi() {
    return this.http.get(`${environment.apiUrl}/Utility/GetApiData`);
  }

  GetSliderList() {
    return this.http.get(`${environment.apiUrl}/Utility/GetSliderList`);
  }

  GetNewsList() {
    return this.http.get(`${environment.apiUrl}/News/GetNewsList`, this.httpService.GetHttpCommon());
  }

  GetStaticData(id) {
    return this.http.get(`${environment.apiUrl}/Utility/GetStaticData/${id}`, this.httpService.GetHttpCommon());
  }
}
