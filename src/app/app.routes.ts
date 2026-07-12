// ============================================================
// src/app/app.routes.ts
// ============================================================
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    title: 'Profile - Sreemonta Bhowmik'
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
    title: 'Projects - Sreemonta Bhowmik'
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list/blog-list.component').then(m => m.BlogListComponent),
    title: 'Blog - Sreemonta Bhowmik'
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog/blog-post/blog-post.component').then(m => m.BlogPostComponent),
    title: 'Article - Sreemonta Bhowmik'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact - Sreemonta Bhowmik'
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/admin-login.component').then(m => m.AdminLoginComponent),
    title: 'Admin Login'
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'cv', loadComponent: () => import('./admin/cv-manager/cv-manager.component').then(m => m.CvManagerComponent) },
      { path: 'projects', loadComponent: () => import('./admin/project-manager/project-manager.component').then(m => m.ProjectManagerComponent) },
      { path: 'blog/topics', loadComponent: () => import('./admin/blog-manager/topic-manager/topic-manager.component').then(m => m.TopicManagerComponent) },
      { path: 'blog/posts', loadComponent: () => import('./admin/blog-manager/post-list/post-list.component').then(m => m.PostListComponent) },
      { path: 'blog/posts/new', loadComponent: () => import('./admin/blog-manager/post-editor/post-editor.component').then(m => m.PostEditorComponent) },
      { path: 'blog/posts/edit/:id', loadComponent: () => import('./admin/blog-manager/post-editor/post-editor.component').then(m => m.PostEditorComponent) },
      { path: 'blog/comments', loadComponent: () => import('./admin/blog-manager/comment-moderator/comment-moderator.component').then(m => m.CommentModeratorComponent) }
    ]
  },
  { path: '**', redirectTo: 'profile' }
];
