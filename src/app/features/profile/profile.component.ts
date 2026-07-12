// ============================================================
// src/app/features/profile/profile.component.ts
// ============================================================
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { CVProfile, STATIC_CV } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private api = inject(PortfolioApiService);

  cv      = signal<CVProfile>(STATIC_CV as CVProfile);
  loading = signal(true);

  ngOnInit() {
    this.api.getCv().subscribe(data => {
      this.cv.set(data);
      this.loading.set(false);
    });
  }

  get fullName(): string {
    const cv = this.cv();
    return `${cv.firstName} ${cv.lastName}`;
  }

  trackBySkillCat(_: number, item: any) { return item.id; }
  trackBySkill(_: number, item: any)    { return item.id; }
  trackByExp(_: number, item: any)      { return item.id; }
  trackByEdu(_: number, item: any)      { return item.id; }
  trackByCert(_: number, item: any)     { return item.id; }
}
