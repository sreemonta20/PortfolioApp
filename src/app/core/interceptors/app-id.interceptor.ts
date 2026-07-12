// ============================================================
// src/app/core/interceptors/app-id.interceptor.ts
// Attaches X-App-Id to every PUBLIC portfolio API call.
// Admin calls are identified by the JWT bearer token instead
// (see auth.interceptor.ts) and do not need X-App-Id.
// ============================================================
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const appIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/portfolio/public/')) {
    const cloned = req.clone({
      setHeaders: { 'X-App-Id': environment.appId }
    });
    return next(cloned);
  }
  return next(req);
};
