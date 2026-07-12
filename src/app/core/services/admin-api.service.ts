// ============================================================
// src/app/core/services/admin-api.service.ts
// ADMIN-only endpoints. Every call here rides under
// /api/portfolio/admin/** and gets a JWT bearer token attached
// by auth.interceptor.ts. The API rejects these without a
// valid Admin-role token.
// ============================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CVProfile, BlogTopic, BlogPostSummary, PagedResult } from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/portfolio/admin`;

  // -- Portfolios --------------------------------------------
  getPortfolios(search?: string): Observable<any[]> {
    const params = search ? new HttpParams().set('search', search) : undefined;
    return this.http.get<any[]>(`${this.base}/cv/portfolios`, { params });
  }

  // -- CV / Profile -------------------------------------------
  getCv(appId: string): Observable<CVProfile> {
    return this.http.get<CVProfile>(`${this.base}/cv/${appId}`);
  }

  updateCv(appId: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.base}/cv/${appId}`, data);
  }

  uploadPhoto(appId: string, file: File): Observable<{ url: string }> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<{ url: string }>(`${this.base}/cv/${appId}/photo`, fd);
  }

  // -- Skills ---------------------------------------------------
  addSkillCategory(appId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/cv/${appId}/skills`, data);
  }
  updateSkillCategory(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/cv/skills/${id}`, data);
  }
  deleteSkillCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/cv/skills/${id}`);
  }

  // -- Experience -------------------------------------------------
  addExperience(appId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/cv/${appId}/experience`, data);
  }
  updateExperience(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/cv/experience/${id}`, data);
  }
  deleteExperience(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/cv/experience/${id}`);
  }

  // -- Projects -----------------------------------------------
  getProjects(appId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/projects/${appId}`);
  }
  createProject(appId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/projects/${appId}`, data);
  }
  updateProject(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/projects/${id}`, data);
  }
  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/projects/${id}`);
  }

  // -- Blog Topics ----------------------------------------------
  getBlogTopics(appId: string): Observable<BlogTopic[]> {
    return this.http.get<BlogTopic[]>(`${this.base}/blog/${appId}/topics`);
  }
  createTopic(appId: string, data: any): Observable<BlogTopic> {
    return this.http.post<BlogTopic>(`${this.base}/blog/${appId}/topics`, data);
  }
  updateTopic(id: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.base}/blog/topics/${id}`, data);
  }
  deleteTopic(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/topics/${id}`);
  }

  // -- Blog Posts -------------------------------------------------
  getBlogPosts(appId: string, page = 1, size = 20): Observable<PagedResult<BlogPostSummary>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PagedResult<BlogPostSummary>>(`${this.base}/blog/${appId}/posts`, { params });
  }
  createPost(appId: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/blog/${appId}/posts`, data);
  }
  updatePost(id: string, data: any): Observable<void> {
    return this.http.put<void>(`${this.base}/blog/posts/${id}`, data);
  }
  publishPost(id: string): Observable<void> {
    return this.http.put<void>(`${this.base}/blog/posts/${id}/publish`, {});
  }
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/posts/${id}`);
  }

  // -- Attachments ------------------------------------------------
  uploadAttachment(postId: string, file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<any>(`${this.base}/blog/posts/${postId}/attachments`, fd);
  }
  deleteAttachment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/attachments/${id}`);
  }

  // -- Comments ------------------------------------------------
  getComments(postId: string, pending = false): Observable<any[]> {
    const params = new HttpParams().set('pending', pending);
    return this.http.get<any[]>(`${this.base}/blog/posts/${postId}/comments`, { params });
  }
  approveComment(id: string): Observable<void> {
    return this.http.put<void>(`${this.base}/blog/comments/${id}/approve`, {});
  }
  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/blog/comments/${id}`);
  }

  // -- Reactions ------------------------------------------------
  getReactions(postId: string): Observable<any> {
    return this.http.get<any>(`${this.base}/blog/posts/${postId}/reactions`);
  }
}
