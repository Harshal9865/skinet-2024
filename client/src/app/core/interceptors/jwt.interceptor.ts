import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

@Injectable({ providedIn: 'root' }) // ✅ ensures DI registration
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this.accountService.currentUserValue;
    const token = user?.token;

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': req.headers.get('Content-Type') || 'application/json' // fallback
        }
      });

      console.log('✅ JWT Interceptor attached token:', token); // ✅ debug
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
