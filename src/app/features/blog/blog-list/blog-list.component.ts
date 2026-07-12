// ============================================================
// src/app/features/blog/blog-list/blog-list.component.ts
// ============================================================
import {
  Component, OnInit, inject, signal, computed, DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import {
  BlogTopic, BlogPostSummary, PagedResult
} from '../../../core/models/portfolio.models';

// ── STATIC DEMO DATA ─────────────────────────────────────────
const DEMO_TOPICS: BlogTopic[] = [
  { id:'t1', portfolioId:'', name:'.NET & C#',     slug:'dotnet-csharp',  iconClass:'bi-braces',    colorHex:'#00d4aa', sortOrder:1, isActive:true, postCount:4, createdAt:new Date() },
  { id:'t2', portfolioId:'', name:'Angular',        slug:'angular',        iconClass:'bi-layers',    colorHex:'#f5a623', sortOrder:2, isActive:true, postCount:3, createdAt:new Date() },
  { id:'t3', portfolioId:'', name:'Azure & Cloud',  slug:'azure-cloud',    iconClass:'bi-cloud',     colorHex:'#64c8ff', sortOrder:3, isActive:true, postCount:2, createdAt:new Date() },
  { id:'t4', portfolioId:'', name:'Architecture',   slug:'architecture',   iconClass:'bi-diagram-3', colorHex:'#b464ff', sortOrder:4, isActive:true, postCount:2, createdAt:new Date() },
  { id:'t5', portfolioId:'', name:'AI & GenAI',     slug:'ai-genai',       iconClass:'bi-cpu',       colorHex:'#00e870', sortOrder:5, isActive:true, postCount:1, createdAt:new Date() },
];

const DEMO_POSTS: BlogPostSummary[] = [
  { id:'p1', title:'Building a Robust API Gateway with Ocelot in .NET 8', slug:'ocelot-api-gateway-dotnet-8', excerpt:'Learn how to configure Ocelot as an API gateway for microservices, including rate limiting, auth middleware, and load balancing used in real enterprise systems.', thumbUrl:null, readTimeMin:8, publishedAt:new Date('2026-03-10'), topicId:'t1', topicName:'.NET & C#', topicSlug:'dotnet-csharp', topicColorHex:'#00d4aa', likeCount:42, dislikeCount:2, commentCount:8 },
  { id:'p2', title:'Angular 17 Signals: Replacing RxJS in Component State Management', slug:'angular-signals-vs-rxjs', excerpt:'A practical guide to Angular Signals — when to use them vs RxJS observables, performance implications, and migration patterns for large-scale Angular apps.', thumbUrl:null, readTimeMin:6, publishedAt:new Date('2026-02-28'), topicId:'t2', topicName:'Angular', topicSlug:'angular', topicColorHex:'#f5a623', likeCount:35, dislikeCount:1, commentCount:12 },
  { id:'p3', title:'Azure App Service vs Container Apps: A Real-World Decision Guide', slug:'azure-app-service-vs-container-apps', excerpt:'Breaking down the trade-offs between Azure App Service and Container Apps for hosting .NET APIs — cost, scaling, DevOps pipelines, and when each makes sense.', thumbUrl:null, readTimeMin:10, publishedAt:new Date('2026-02-15'), topicId:'t3', topicName:'Azure & Cloud', topicSlug:'azure-cloud', topicColorHex:'#64c8ff', likeCount:28, dislikeCount:3, commentCount:5 },
  { id:'p4', title:'SOLID Principles in .NET: From Theory to Production Code', slug:'solid-principles-dotnet-production', excerpt:'A practical walkthrough of all five SOLID principles with real-world .NET examples, refactoring before/after, and how they improve testability in large codebases.', thumbUrl:null, readTimeMin:12, publishedAt:new Date('2026-01-30'), topicId:'t4', topicName:'Architecture', topicSlug:'architecture', topicColorHex:'#b464ff', likeCount:61, dislikeCount:0, commentCount:19 },
  { id:'p5', title:'Practical Prompt Engineering for Developers: Lessons from Google\'s Course', slug:'practical-prompt-engineering-developers', excerpt:'Key takeaways from Google Prompting Essentials — techniques for code review, documentation generation, and accelerating everyday dev workflows with AI.', thumbUrl:null, readTimeMin:7, publishedAt:new Date('2026-01-12'), topicId:'t5', topicName:'AI & GenAI', topicSlug:'ai-genai', topicColorHex:'#00e870', likeCount:47, dislikeCount:1, commentCount:14 },
  { id:'p6', title:'Implementing UAE Pass SSO in .NET: A Step-by-Step Integration Guide', slug:'uae-pass-sso-dotnet-integration', excerpt:'A complete walkthrough of integrating UAE Pass (OIDC-based national identity) into a .NET Core Web API — token validation, user mapping, and IDAM edge cases in production.', thumbUrl:null, readTimeMin:9, publishedAt:new Date('2025-12-22'), topicId:'t1', topicName:'.NET & C#', topicSlug:'dotnet-csharp', topicColorHex:'#00d4aa', likeCount:53, dislikeCount:2, commentCount:22 },
];

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  private api     = inject(PortfolioApiService);
  private destroy = inject(DestroyRef);

  topics      = signal<BlogTopic[]>(DEMO_TOPICS);
  allPosts    = signal<BlogPostSummary[]>(DEMO_POSTS);
  activeTopic = signal<string | undefined>(undefined);
  searchQuery = signal('');
  loading     = signal(false);
  page        = signal(1);
  totalPages  = signal(1);

  private search$ = new Subject<string>();

  filteredPosts = computed(() => {
    let posts = this.allPosts();
    const topic = this.activeTopic();
    const q     = this.searchQuery().toLowerCase().trim();
    if (topic) posts = posts.filter(p => p.topicSlug === topic);
    if (q)     posts = posts.filter(p =>
      p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    );
    return posts;
  });

  popularPosts = computed(() =>
    [...this.allPosts()].sort((a,b) => b.likeCount - a.likeCount).slice(0,3)
  );

  likedPosts = signal<Set<string>>(new Set());

  ngOnInit() {
    this.loadFromApi();
    this.search$.pipe(
      debounceTime(300), distinctUntilChanged(),
      takeUntilDestroyed(this.destroy)
    ).subscribe(q => this.searchQuery.set(q));
  }

  loadFromApi() {
    this.api.getBlogTopics().pipe(takeUntilDestroyed(this.destroy))
      .subscribe(t => { if (t.length) this.topics.set(t); });
    this.api.getBlogPosts().pipe(takeUntilDestroyed(this.destroy))
      .subscribe(r => { if (r.items.length) this.allPosts.set(r.items); });
  }

  filterByTopic(slug?: string) {
    this.activeTopic.set(slug);
  }

  onSearch(value: string) {
    this.search$.next(value);
  }

  toggleLike(post: BlogPostSummary) {
    const liked = new Set(this.likedPosts());
    if (liked.has(post.id)) {
      liked.delete(post.id);
      this.allPosts.update(posts => posts.map(p => p.id === post.id ? { ...p, likeCount: p.likeCount - 1 } : p));
    } else {
      liked.add(post.id);
      this.allPosts.update(posts => posts.map(p => p.id === post.id ? { ...p, likeCount: p.likeCount + 1 } : p));
      this.api.addReaction(post.id, 'like').subscribe();
    }
    this.likedPosts.set(liked);
  }

  isLiked(postId: string): boolean { return this.likedPosts().has(postId); }

  getTopicPostCount(slug: string): number {
    return this.allPosts().filter(p => p.topicSlug === slug).length;
  }

  trackByPost(_: number, p: BlogPostSummary) { return p.id; }
  trackByTopic(_: number, t: BlogTopic) { return t.id; }
}
