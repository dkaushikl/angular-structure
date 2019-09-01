import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ToastService } from '../service/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToastService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 400:
            this.router.navigate(['/notfound']);
            break;
          case 500:
            this.router.navigate(['/error']);
            break;
          case 405:
            this.router.navigate(['/error']);
            break;
          case 408:
            this.router.navigate(['/error']);
            break;
            case 502:
            this.router.navigate(['/error']);
            break;
            case 503:
            this.router.navigate(['/error']);
            break;
            case 504:
            this.router.navigate(['/error']);
            break;
          case 429:
            this.router.navigate(['/error']);
            break;
          case 403:
            this.toast.error('You cant access this page');
            // this.router.navigate(['/error']);
            break;
        }
        return throwError(error);
      })
    );
  }
}
