// ============================================================
// src/app/app.component.ts
// ============================================================
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar />
    <main class="main-content" [class.admin-page]="isAdminPage()">
      <router-outlet />
    </main>
    <app-footer *ngIf="!isAdminPage()" />
  `,
  styles: [`
    .main-content { position: relative; z-index: 1; min-height: 100vh; }
  `]
})
export class AppComponent {
  private router = inject(Router);
  isAdminPage = signal(false);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAdminPage.set(e.url.startsWith('/admin'));
      });
  }
}
