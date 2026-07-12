// ============================================================
// src/app/admin/layout/admin-layout.component.ts
// ============================================================
import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  private auth   = inject(AuthService);
  private router = inject(Router);

  sidebarOpen  = signal(true);
  activeRoute  = signal('');
  appId        = environment.appId;

  navGroups = [
    {
      title: 'Overview',
      links: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
      ]
    },
    {
      title: 'CV Management',
      links: [
        { path: '/admin/cv',       label: 'CV & Profile',   icon: 'bi-person-lines-fill' },
        { path: '/admin/projects', label: 'Projects',        icon: 'bi-grid-fill' },
      ]
    },
    {
      title: 'Blog Management',
      links: [
        { path: '/admin/blog/topics',   label: 'Topics',           icon: 'bi-tags-fill' },
        { path: '/admin/blog/posts',    label: 'Posts',            icon: 'bi-file-earmark-text-fill' },
        { path: '/admin/blog/comments', label: 'Comments',         icon: 'bi-chat-dots-fill' },
      ]
    },
    {
      title: 'Account',
      links: [
        { path: '/profile', label: 'View Portfolio', icon: 'bi-box-arrow-up-right', external: false },
      ]
    }
  ];

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.activeRoute.set(e.url));

    // Auto-collapse on mobile
    if (window.innerWidth < 992) this.sidebarOpen.set(false);
  }

  @HostListener('window:resize')
  onResize() {
    this.sidebarOpen.set(window.innerWidth >= 992);
  }

  isActive(path: string): boolean {
    return this.activeRoute().startsWith(path);
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }

  logout() {
    this.auth.logout();
  }

  get username(): string {
    return this.auth.currentUser()?.username ?? 'Admin';
  }
}
