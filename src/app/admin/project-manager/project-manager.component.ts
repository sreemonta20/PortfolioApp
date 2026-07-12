// ============================================================
// src/app/admin/project-manager/project-manager.component.ts
// ============================================================
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Project } from '../../core/models/portfolio.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-project-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-manager.component.html',
  styleUrls: ['./project-manager.component.scss']
})
export class ProjectManagerComponent implements OnInit {
  private admin = inject(AdminApiService);
  private fb    = inject(FormBuilder);
  appId    = environment.appId;
  projects = signal<Project[]>([]);
  loading  = signal(true);
  saving   = signal(false);
  showForm = signal(false);
  editId   = signal<string | null>(null);

  iconOptions = [
    'bi-hospital-fill','bi-shield-check','bi-code-slash','bi-cloud',
    'bi-database','bi-gear','bi-graph-up','bi-people-fill',
    'bi-cart-fill','bi-building','bi-cpu','bi-globe'
  ];

  form = this.fb.group({
    title:       ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', Validators.required],
    liveUrl:     [''],
    repoUrl:     [''],
    iconClass:   ['bi-code-slash'],
    tags:        [''],   // comma-separated input
    sortOrder:   [0]
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.admin.getProjects(this.appId).subscribe({
      next: p => { this.projects.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openNew() {
    this.editId.set(null);
    this.form.reset({ iconClass: 'bi-code-slash', sortOrder: this.projects().length });
    this.showForm.set(true);
  }

  edit(p: Project) {
    this.editId.set(p.id);
    this.form.patchValue({
      title: p.title,
      description: p.description,
      liveUrl: p.liveUrl ?? '',
      repoUrl: p.repoUrl ?? '',
      iconClass: p.iconClass,
      tags: p.tags.join(', '),
      sortOrder: p.sortOrder
    });
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel() { this.showForm.set(false); this.editId.set(null); }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    const raw  = this.form.value;
    const data = {
      ...raw,
      tags: (raw.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
    };
    const id  = this.editId();
    const obs = id
      ? this.admin.updateProject(id, data)
      : this.admin.createProject(this.appId, data);

    obs.subscribe({
      next: () => { this.load(); this.cancel(); this.saving.set(false); },
      error: () => this.saving.set(false)
    });
  }

  delete(p: Project) {
    if (!confirm(`Delete project "${p.title}"?`)) return;
    this.admin.deleteProject(p.id).subscribe(() => this.load());
  }

  setIcon(ic: string) { this.form.patchValue({ iconClass: ic }); }
  trackByProject(_: number, p: Project) { return p.id; }
}
