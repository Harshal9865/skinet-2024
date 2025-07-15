import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

// ✅ Functional interceptor compatible with Angular zoneless + Vite
export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (user?.token) {
    console.log('✅ Attaching token from JwtInterceptor:', user.token);
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });
    return next(cloned);
  }

  console.warn('⚠️ JwtInterceptor: No token found in localStorage');
  return next(req);
};
