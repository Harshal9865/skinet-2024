import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' }) // ✅ This is required for DI
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.accountService.currentUser$.pipe(
      take(1),
      switchMap(user => {
        if (user?.token) {
          const cloned = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user.token}`
            }
          });
          return next.handle(cloned);
        }
        return next.handle(req);
      })
    );
  }
}
