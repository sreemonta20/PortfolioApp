// ============================================================
// src/app/admin/blog-manager/post-list/post-list.component.ts
// ============================================================
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { BlogPostSummary } from '../../../core/models/portfolio.models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  private admin = inject(AdminApiService);
  appId  = environment.appId;
  posts  = signal<BlogPostSummary[]>([]);
  loading= signal(true);
  filter = signal<'all'|'published'|'draft'>('all');

  publishedCount = computed(() => this.posts().filter(p => !!p.publishedAt).length);
  draftCount     = computed(() => this.posts().filter(p => !p.publishedAt).length);

  filteredPosts = computed(() => {
    const f = this.filter();
    if (f === 'published') return this.posts().filter(p => !!p.publishedAt);
    if (f === 'draft')     return this.posts().filter(p => !p.publishedAt);
    return this.posts();
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.admin.getBlogPosts(this.appId).subscribe({
      next: r => { this.posts.set(r.items); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  publish(id: string) {
    this.admin.publishPost(id).subscribe(() => this.load());
  }

  delete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    this.admin.deletePost(id).subscribe(() => this.load());
  }

  trackByPost(_: number, p: BlogPostSummary) { return p.id; }
}
