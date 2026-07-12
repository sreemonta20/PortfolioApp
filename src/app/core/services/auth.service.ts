// ============================================================
// src/app/core/services/auth.service.ts
// Handles admin login only. The public site never touches this.
// ============================================================
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  username: string;
  roles: string[];
  token: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  currentUser = signal<AuthUser | null>(this.loadFromStorage());

  private loadFromStorage(): AuthUser | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem('portfolio_admin_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(credentials: { username: string; password: string }): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${environment.apiUrl}/api/auth/login`, credentials)
      .pipe(tap(user => this.setUser(user)));
  }

  setUser(user: AuthUser): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('portfolio_admin_user', JSON.stringify(user));
    }
    this.currentUser.set(user);
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('portfolio_admin_user');
    }
    this.currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return new Date(user.expiresAt).getTime() > Date.now();
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.roles.includes(role) ?? false;
  }

  getToken(): string | null {
    return this.isLoggedIn() ? this.currentUser()!.token : null;
  }
}
