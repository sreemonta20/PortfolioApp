// ============================================================
// src/app/admin/blog-manager/comment-moderator/comment-moderator.component.ts
// ============================================================
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-comment-moderator',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="admin-page-wrap" style="max-width:900px">
    <div class="page-head mb-4">
      <div>
        <h2 class="page-title">Comment Moderation</h2>
        <p class="page-sub">Review, approve, or delete reader comments.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn-crystal btn-sm" [class.btn-amber]="showPending()" (click)="showPending.update(v=>!v)">
          <i class="bi bi-funnel"></i>{{ showPending() ? 'Show All' : 'Pending Only' }}
        </button>
      </div>
    </div>

    <div class="glass-card p-4" *ngIf="!loading(); else loadTpl">
      <div *ngIf="filtered().length === 0" class="empty-state">
        <i class="bi bi-chat-square-text"></i>
        <p>No comments {{ showPending() ? 'pending moderation' : 'found' }}.</p>
      </div>

      <div *ngFor="let c of filtered(); trackBy: trackBy" class="comment-row glass-card p-3 mb-2">
        <div class="d-flex align-items-start gap-3">
          <div class="comment-avatar"><i class="bi bi-person"></i></div>
          <div class="flex-1">
            <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <strong style="color:#fff;font-size:0.85rem">{{ c.authorName }}</strong>
              <span *ngIf="c.authorEmail" style="font-size:0.72rem;color:var(--text-sub)">{{ c.authorEmail }}</span>
              <span class="badge-teal" *ngIf="c.isApproved"><i class="bi bi-check-circle-fill"></i>Approved</span>
              <span class="badge-amber" *ngIf="!c.isApproved"><i class="bi bi-clock"></i>Pending</span>
              <span style="font-size:0.7rem;color:var(--text-sub)" class="ms-auto">{{ c.createdAt | date:'MMM d, y . h:mm a' }}</span>
            </div>
            <p style="font-size:0.83rem;color:var(--text-sub);line-height:1.6;margin:0">{{ c.body }}</p>
          </div>
        </div>
        <div class="d-flex gap-2 mt-3 justify-content-end">
          <button *ngIf="!c.isApproved" class="btn-crystal btn-sm" (click)="approve(c.id)">
            <i class="bi bi-check-lg"></i>Approve
          </button>
          <button class="btn-crystal btn-danger-crystal btn-sm" (click)="deleteComment(c.id)">
            <i class="bi bi-trash3"></i>Delete
          </button>
        </div>
      </div>
    </div>

    <ng-template #loadTpl>
      <div class="glass-card p-4">
        <div *ngFor="let i of [1,2,3]" class="skeleton mb-2" style="height:80px;border-radius:10px"></div>
      </div>
    </ng-template>
  </div>
  `,
  styles: [`
    .admin-page-wrap { max-width:900px; }
    .page-head { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
    .page-title{ font-family:'Playfair Display',serif; font-size:1.65rem; font-weight:700; color:#fff; margin:0; }
    .page-sub  { font-size:0.82rem; color:var(--text-sub); margin:0.3rem 0 0; }
    .comment-avatar { width:34px; height:34px; background:rgba(0,212,170,0.1); border:1px solid rgba(0,212,170,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .comment-avatar i { color:var(--teal); }
    .flex-1 { flex:1; min-width:0; }
    .empty-state { text-align:center; padding:3rem 1rem; color:var(--text-sub); }
    .empty-state i { font-size:2.8rem; color:rgba(0,212,170,0.18); display:block; margin-bottom:0.75rem; }
  `]
})
export class CommentModeratorComponent implements OnInit {
  private admin = inject(AdminApiService);
  comments    = signal<any[]>([]);
  loading     = signal(true);
  showPending = signal(false);

  filtered = () => this.showPending()
    ? this.comments().filter(c => !c.isApproved)
    : this.comments();

  ngOnInit() {
    this.admin.getComments('', false).subscribe({
      next: (data) => { this.comments.set(data); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  approve(id: string) {
    this.admin.approveComment(id).subscribe(() => {
      this.comments.update(cs => cs.map(c => c.id === id ? { ...c, isApproved: true } : c));
    });
  }

  deleteComment(id: string) {
    if (!confirm('Delete this comment permanently?')) return;
    this.admin.deleteComment(id).subscribe(() => {
      this.comments.update(cs => cs.filter(c => c.id !== id));
    });
  }

  trackBy(_: number, c: any) { return c.id; }
}
