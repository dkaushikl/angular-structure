import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/internal/operators/finalize';

@Injectable()
export class LoaderHttpInterceptor implements HttpInterceptor {
    constructor(private loadingIndicatorService: LoadingIndicatorService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingIndicatorService.onStarted(req);

        return next.handle(req).pipe(finalize(() => {
              this.loadingIndicatorService.onFinished(req);
          }));
    }
}

@Injectable()
export class LoadingIndicatorService {
    onLoadingChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    private requests: HttpRequest<any>[] = [];

    onStarted(req: HttpRequest<any>): void {
        this.requests.push(req);
        this.notify();
    }

    onFinished(req: HttpRequest<any>): void {
        const index = this.requests.indexOf(req);
        if (index !== -1) {
            this.requests.splice(index, 1);
        }
        this.notify();
    }

    private notify(): void {
        this.onLoadingChanged.emit(this.requests.length !== 0);
    }
}
