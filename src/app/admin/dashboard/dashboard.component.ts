// ============================================================
// src/app/admin/dashboard/dashboard.component.ts
// ============================================================
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminApiService } from '../../core/services/admin-api.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private admin = inject(AdminApiService);

  appId = environment.appId;

  stats = signal([
    { label: 'Blog Topics', value: 5,  icon: 'bi-tags-fill',           color: 'var(--teal)',  path: '/admin/blog/topics'   },
    { label: 'Blog Posts',  value: 6,  icon: 'bi-file-earmark-text-fill', color: 'var(--amber)', path: '/admin/blog/posts'    },
    { label: 'Comments',    value: 80, icon: 'bi-chat-dots-fill',       color: '#b464ff',      path: '/admin/blog/comments' },
    { label: 'Projects',    value: 2,  icon: 'bi-grid-fill',            color: '#64c8ff',      path: '/admin/projects'      },
  ]);

  quickLinks = [
    { label: 'Edit CV & Profile',   icon: 'bi-person-lines-fill', path: '/admin/cv',            color: 'var(--teal)'  },
    { label: 'New Blog Post',       icon: 'bi-pencil-square',     path: '/admin/blog/posts/new',color: 'var(--amber)' },
    { label: 'Add Blog Topic',      icon: 'bi-plus-circle',       path: '/admin/blog/topics',   color: '#b464ff'      },
    { label: 'Add Project',         icon: 'bi-grid-1x2',          path: '/admin/projects',      color: '#64c8ff'      },
    { label: 'Moderate Comments',   icon: 'bi-chat-square-text',  path: '/admin/blog/comments', color: '#00e870'      },
    { label: 'View Live Portfolio', icon: 'bi-box-arrow-up-right',path: '/profile',             color: 'var(--text-sub)' },
  ];

  activity = signal([
    { type:'BLOG',    typeColor:'var(--teal)',  msg:'New post published: <strong>Building Robust API Gateway with Ocelot</strong>', time:'2h ago' },
    { type:'CV',      typeColor:'var(--amber)', msg:'CV Profile updated successfully', time:'1d ago' },
    { type:'TOPIC',   typeColor:'#b464ff',      msg:'New topic created: <strong>AI & GenAI</strong>', time:'3d ago' },
    { type:'COMMENT', typeColor:'#64c8ff',      msg:'8 new comments pending moderation', time:'4d ago' },
    { type:'PROJECT', typeColor:'var(--teal)',  msg:'Project added: <strong>Biometric Analytics Platform</strong>', time:'5d ago' },
  ]);

  ngOnInit() {
    // Load real stats from API
    this.admin.getBlogTopics(this.appId).subscribe(t => {
      this.stats.update(s => s.map(st => st.label === 'Blog Topics' ? { ...st, value: t.length } : st));
    });
  }
}
