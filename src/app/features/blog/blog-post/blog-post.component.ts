// ============================================================
// src/app/features/blog/blog-post/blog-post.component.ts
// ============================================================
import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PortfolioApiService } from '../../../core/services/portfolio-api.service';
import { BlogPostDetail, Comment } from '../../../core/models/portfolio.models';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  private api = inject(PortfolioApiService);
  private fb  = inject(FormBuilder);

  slug = input.required<string>();

  post       = signal<BlogPostDetail | null>(null);
  loading    = signal(true);
  notFound   = signal(false);
  submitting = signal(false);
  submitted  = signal(false);

  reactions  = signal({ like: 0, dislike: 0, love: 0, celebrate: 0 });
  userReacted = signal<Set<string>>(new Set());

  commentForm = this.fb.group({
    authorName:  ['', [Validators.required, Validators.maxLength(100)]],
    authorEmail: ['', Validators.email],
    body:        ['', [Validators.required, Validators.maxLength(2000)]]
  });

  emojiMap = [
    { label: 'like',      emoji: '👍', icon: 'bi-hand-thumbs-up-fill' },
    { label: 'love',      emoji: '❤️',  icon: 'bi-heart-fill'          },
    { label: 'celebrate', emoji: '🎉',  icon: 'bi-stars'               },
    { label: 'dislike',   emoji: '👎',  icon: 'bi-hand-thumbs-down-fill'},
  ];

  ngOnInit() {
    const s = this.slug();
    this.api.getBlogPost(s).subscribe({
      next: p => {
        if (!p) { this.notFound.set(true); this.loading.set(false); return; }
        this.post.set(p);
        this.reactions.set(p.reactions ?? { like: p.likeCount, dislike: p.dislikeCount, love: 0, celebrate: 0 });
        this.loading.set(false);
      },
      error: () => { this.notFound.set(true); this.loading.set(false); }
    });
  }

  react(label: string) {
    const p = this.post();
    if (!p) return;
    const reacted = new Set(this.userReacted());
    if (reacted.has(label)) {
      reacted.delete(label);
      this.reactions.update(r => ({ ...r, [label]: Math.max(0, (r as any)[label] - 1) }));
    } else {
      reacted.add(label);
      this.reactions.update(r => ({ ...r, [label]: (r as any)[label] + 1 }));
      this.api.addReaction(p.id, label).subscribe();
    }
    this.userReacted.set(reacted);
  }

  getReactionCount(label: string): number {
    return (this.reactions() as any)[label] ?? 0;
  }

  submitComment() {
    if (this.commentForm.invalid) { this.commentForm.markAllAsTouched(); return; }
    const p = this.post();
    if (!p) return;
    this.submitting.set(true);
    this.api.addComment(p.id, this.commentForm.value as any).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
        this.commentForm.reset();
      },
      error: () => this.submitting.set(false)
    });
  }

  getFileIcon(type: string): string {
    const m: Record<string, string> = { pdf:'bi-file-earmark-pdf-fill', image:'bi-image-fill', excel:'bi-file-earmark-excel-fill', word:'bi-file-earmark-word-fill' };
    return m[type] ?? 'bi-file-earmark-fill';
  }

  getFileColor(type: string): string {
    const m: Record<string, string> = { pdf:'#f87171', image:'#60a5fa', excel:'#4ade80', word:'#818cf8' };
    return m[type] ?? 'var(--teal)';
  }
}
