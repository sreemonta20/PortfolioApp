// ============================================================
// src/app/core/interceptors/auth.interceptor.ts
// Attaches the JWT bearer token to ADMIN API calls only.
// Public-facing portfolio/blog endpoints never see a token.
// ============================================================
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  if (token && req.url.includes('/api/portfolio/admin/')) {
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(req);
};
