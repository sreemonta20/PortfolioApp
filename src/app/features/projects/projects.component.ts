// ============================================================
// src/app/features/projects/projects.component.ts
// ============================================================
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioApiService } from '../../core/services/portfolio-api.service';
import { Project } from '../../core/models/portfolio.models';

const DEMO_PROJECTS: Project[] = [
  {
    id:'proj1', portfolioId:'', title:'Dubai Health Charity Portal',
    description:'Public-facing charity request submission & tracking system. Built with Ocelot API Gateway, UAE Pass SSO integration, and Angular 16 frontend serving 200+ non-DAHC requests immediately upon launch.',
    liveUrl:'https://services.dubaihealth.ae/financialaidtreatment', repoUrl:null,
    iconClass:'bi-hospital-fill', tags:['Angular 16','.NET API','Ocelot','SSO','UAE Pass'],
    sortOrder:1, isActive:true, createdAt:new Date(), updatedAt:new Date()
  },
  {
    id:'proj2', portfolioId:'', title:'Biometric Analytics Platform',
    description:'High-performance biometric identity service processing 100K+ daily transactions. Eliminated $50K annual third-party dependency and reduced response time by 25%.',
    liveUrl:'https://identity.cloudabis.com/', repoUrl:null,
    iconClass:'bi-shield-check', tags:['ASP.NET Core','Angular','Biometrics','CloudABIS'],
    sortOrder:2, isActive:true, createdAt:new Date(), updatedAt:new Date()
  },
];

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private api = inject(PortfolioApiService);
  projects = signal<Project[]>(DEMO_PROJECTS);
  loading  = signal(false);

  ngOnInit() {
    this.api.getProjects().subscribe(p => { if (p.length) this.projects.set(p); });
  }
  trackByProject(_: number, p: Project) { return p.id; }
}
