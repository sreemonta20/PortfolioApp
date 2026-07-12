// ============================================================
// src/app/admin/cv-manager/cv-manager.component.ts
// ============================================================
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { STATIC_CV } from '../../core/models/portfolio.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cv-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './cv-manager.component.html',
  styleUrls: ['./cv-manager.component.scss']
})
export class CvManagerComponent implements OnInit {
  private admin = inject(AdminApiService);
  private fb    = inject(FormBuilder);
  appId   = environment.appId;
  saving  = signal(false);
  loading = signal(true);
  saved   = signal(false);
  activeTab = signal<'profile'|'experience'|'skills'|'certs'|'education'>('profile');

  form = this.fb.group({
    firstName:            ['', Validators.required],
    lastName:             ['', Validators.required],
    role:                 ['', Validators.required],
    address:              [''],
    mobileNumber:         [''],
    email:                ['', [Validators.required, Validators.email]],
    linkedInUrl:          [''],
    gitHubUrl:            [''],
    portfolioUrl:         [''],
    professionalSummary:  [''],
    availability:         [''],
    visaStatus:           [''],
    languages:            [''],
  });

  photoFile = signal<File | null>(null);
  photoPreview = signal<string | null>(null);

  ngOnInit() {
    this.admin.getCv(this.appId).subscribe({
      next: cv => { this.form.patchValue(cv as any); this.loading.set(false); },
      error: () => {
        this.form.patchValue(STATIC_CV as any);
        this.loading.set(false);
      }
    });
  }

  onPhotoChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.photoFile.set(file);
    const reader = new FileReader();
    reader.onload = (r) => this.photoPreview.set(r.target?.result as string);
    reader.readAsDataURL(file);
  }

  saveProfile() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.admin.updateCv(this.appId, this.form.value).subscribe({
      next: () => {
        const pf = this.photoFile();
        if (pf) {
          this.admin.uploadPhoto(this.appId, pf).subscribe();
        }
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: () => this.saving.set(false)
    });
  }
}
