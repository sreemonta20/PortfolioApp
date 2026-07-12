// ============================================================
// src/app/core/services/portfolio-api.service.ts
// PUBLIC, unauthenticated endpoints (no JWT) - consumed by the
// public-facing site. X-App-Id is attached by app-id.interceptor.
// ============================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CVProfile, BlogTopic, BlogPostSummary, BlogPostDetail,
  PagedResult, Project, AddCommentRequest, STATIC_CV
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/portfolio/public`;

  getCv(): Observable<CVProfile> {
    return this.http.get<CVProfile>(`${this.base}/cv`).pipe(
      catchError(() => of(STATIC_CV as CVProfile))
    );
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects`).pipe(
      catchError(() => of([]))
    );
  }

  getBlogTopics(): Observable<BlogTopic[]> {
    return this.http.get<BlogTopic[]>(`${this.base}/blog/topics`).pipe(
      catchError(() => of([]))
    );
  }

  getBlogPosts(topic?: string, page = 1, size = 9): Observable<PagedResult<BlogPostSummary>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (topic) params = params.set('topic', topic);
    return this.http.get<PagedResult<BlogPostSummary>>(`${this.base}/blog/posts`, { params }).pipe(
      catchError(() => of({ items: [], totalCount: 0, page: 1, pageSize: size, totalPages: 0 }))
    );
  }

  getBlogPost(slug: string): Observable<BlogPostDetail | null> {
    return this.http.get<BlogPostDetail>(`${this.base}/blog/posts/${slug}`).pipe(
      catchError(() => of(null))
    );
  }

  addReaction(postId: string, emojiLabel: string): Observable<any> {
    return this.http.post<any>(`${this.base}/blog/posts/${postId}/react`, { emojiLabel });
  }

  addComment(postId: string, payload: AddCommentRequest): Observable<any> {
    return this.http.post<any>(`${this.base}/blog/posts/${postId}/comments`, payload);
  }
}
