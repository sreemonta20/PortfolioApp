// ============================================================
// src/app/admin/blog-manager/topic-manager/topic-manager.component.ts
// ============================================================
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { BlogTopic } from '../../../core/models/portfolio.models';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-topic-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './topic-manager.component.html',
  styleUrls: ['./topic-manager.component.scss']
})
export class TopicManagerComponent implements OnInit {
  private admin = inject(AdminApiService);
  private fb    = inject(FormBuilder);
  appId = environment.appId;

  topics    = signal<BlogTopic[]>([]);
  editingId = signal<string | null>(null);
  loading   = signal(false);
  saving    = signal(false);
  showForm  = signal(false);

  iconOptions = [
    'bi-braces','bi-layers','bi-cloud','bi-diagram-3','bi-cpu',
    'bi-database','bi-shield-check','bi-code-slash','bi-gear',
    'bi-terminal','bi-globe','bi-lightbulb','bi-book','bi-stars'
  ];

  colorPresets = [
    '#00d4aa','#f5a623','#64c8ff','#b464ff',
    '#00e870','#ff6464','#ff9664','#ffd700'
  ];

  form = this.fb.group({
    name:      ['', [Validators.required, Validators.maxLength(100)]],
    slug:      ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    iconClass: ['bi-braces'],
    colorHex:  ['#00d4aa'],
    sortOrder: [0]
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.admin.getBlogTopics(this.appId).subscribe({
      next: t => { this.topics.set(t); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openNew() {
    this.editingId.set(null);
    this.form.reset({ iconClass:'bi-braces', colorHex:'#00d4aa', sortOrder: this.topics().length });
    this.showForm.set(true);
  }

  edit(t: BlogTopic) {
    this.editingId.set(t.id);
    this.form.patchValue({ name:t.name, slug:t.slug, iconClass:t.iconClass, colorHex:t.colorHex, sortOrder:t.sortOrder });
    this.showForm.set(true);
  }

  cancel() { this.showForm.set(false); this.editingId.set(null); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const val = this.form.value;
    const id  = this.editingId();
    const obs = id
      ? this.admin.updateTopic(id, val)
      : this.admin.createTopic(this.appId, val);

    obs.subscribe({
      next: () => { this.load(); this.cancel(); this.saving.set(false); },
      error: () => this.saving.set(false)
    });
  }

  delete(t: BlogTopic) {
    if (!confirm(`Delete topic "${t.name}"? All posts in this topic will be unassigned.`)) return;
    this.admin.deleteTopic(t.id).subscribe(() => this.load());
  }

  onNameInput(val: string) {
    if (!this.editingId()) {
      const slug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
      this.form.patchValue({ slug });
    }
  }

  setColor(c: string) { this.form.patchValue({ colorHex: c }); }
  setIcon(i: string)  { this.form.patchValue({ iconClass: i }); }

  trackByTopic(_: number, t: BlogTopic) { return t.id; }
}
