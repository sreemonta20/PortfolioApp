// ============================================================
// src/app/admin/blog-manager/post-editor/post-editor.component.ts
// ============================================================
import { Component, inject, signal, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { BlogTopic } from '../../../core/models/portfolio.models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {
  private admin  = inject(AdminApiService);
  private fb     = inject(FormBuilder);
  private router = inject(Router);

  // Route input (Angular 17+ componentInputBinding)
  id = input<string | null>(null);

  appId   = environment.appId;
  topics  = signal<BlogTopic[]>([]);
  loading = signal(false);
  saving  = signal(false);
  attachments = signal<any[]>([]);
  activeTab   = signal<'write'|'preview'|'attachments'>('write');

  form = this.fb.group({
    blogTopicId: ['', Validators.required],
    title:       ['', [Validators.required, Validators.maxLength(300)]],
    slug:        ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    excerpt:     ['', [Validators.required, Validators.maxLength(500)]],
    body:        [''],
    readTimeMin: [5, [Validators.min(1), Validators.max(120)]],
    isPublished: [false],
    isFeatured:  [false]
  });

  ngOnInit() {
    this.admin.getBlogTopics(this.appId).subscribe(t => this.topics.set(t));

    const postId = this.id();
    if (postId) {
      this.loading.set(true);
      // Load existing post for edit
      this.admin.getBlogPosts(this.appId).subscribe(r => {
        const post = r.items.find(p => p.id === postId);
        if (post) {
          this.form.patchValue({
            blogTopicId: post.topicId,
            title:       post.title,
            slug:        post.slug,
            excerpt:     post.excerpt,
            readTimeMin: post.readTimeMin,
            isPublished: !!post.publishedAt
          });
        }
        this.loading.set(false);
      });
    }
  }

  onTitleInput(val: string) {
    if (!this.id()) {
      const slug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
      this.form.patchValue({ slug });
    }
  }

  estimateReadTime() {
    const body  = this.form.get('body')?.value ?? '';
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    const mins  = Math.max(1, Math.ceil(words / 220));
    this.form.patchValue({ readTimeMin: mins });
  }

  save(publish = false) {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const val = { ...this.form.value, isPublished: publish || this.form.get('isPublished')?.value };
    const postId = this.id();
    const obs = postId
      ? this.admin.updatePost(postId, val)
      : this.admin.createPost(this.appId, val);

    obs.subscribe({
      next: () => { this.saving.set(false); this.router.navigate(['/admin/blog/posts']); },
      error: () => this.saving.set(false)
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file || !this.id()) return;
    this.admin.uploadAttachment(this.id()!, file).subscribe(att => {
      this.attachments.update(a => [...a, att]);
    });
  }

  deleteAttachment(id: string) {
    this.admin.deleteAttachment(id).subscribe(() => {
      this.attachments.update(a => a.filter(x => x.id !== id));
    });
  }

  getFileIcon(type: string): string {
    const map: Record<string, string> = { pdf:'bi-file-earmark-pdf', image:'bi-image', excel:'bi-file-earmark-excel', word:'bi-file-earmark-word' };
    return map[type] ?? 'bi-file-earmark';
  }

  cancel() { this.router.navigate(['/admin/blog/posts']); }
}
