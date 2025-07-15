import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const JwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (user?.token) {
    const trimmedToken = user.token.trim();  // ✅ Trim whitespace/newlines
    console.log('✅ Attaching token from JwtInterceptor:', trimmedToken);
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${trimmedToken}`
      }
    });
    return next(cloned);
  }

  console.warn('⚠️ JwtInterceptor: No token found in localStorage');
  return next(req);
};
