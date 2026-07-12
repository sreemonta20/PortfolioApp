// ============================================================
// src/app/shared/navbar/navbar.component.ts
// ============================================================
import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private router = inject(Router);

  isScrolled    = signal(false);
  menuOpen      = signal(false);
  activeRoute   = signal('');

  navLinks = [
    { path: '/profile',  label: 'Profile',  icon: 'bi-person'        },
    { path: '/projects', label: 'Projects', icon: 'bi-grid'          },
    { path: '/blog',     label: 'Blog',     icon: 'bi-journal-text'  },
    { path: '/contact',  label: 'Contact',  icon: 'bi-envelope'      },
  ];

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.activeRoute.set(e.url);
        this.menuOpen.set(false);
      });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  isActive(path: string): boolean {
    return this.activeRoute().startsWith(path);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }
}
