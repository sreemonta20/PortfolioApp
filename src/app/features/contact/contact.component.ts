// ============================================================
// src/app/features/contact/contact.component.ts
// ============================================================
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contacts = [
    {
      icon: 'bi-telephone-fill',
      iconColor: 'var(--teal)',
      borderColor: 'rgba(0,212,170,0.3)',
      bgColor: 'rgba(0,212,170,0.12)',
      label: 'Phone / Mobile',
      value: '+971 505518307',
      href: 'tel:+971505518307',
      btnLabel: 'Call Now',
      btnIcon: 'bi-telephone'
    },
    {
      icon: 'bi-envelope-fill',
      iconColor: 'var(--teal)',
      borderColor: 'rgba(0,212,170,0.3)',
      bgColor: 'rgba(0,212,170,0.12)',
      label: 'Email Address',
      value: 'sreemonta.bhowmik@gmail.com',
      href: 'mailto:sreemonta.bhowmik@gmail.com',
      btnLabel: 'Send Email',
      btnIcon: 'bi-send'
    },
    {
      icon: 'bi-linkedin',
      iconColor: '#4a9eff',
      borderColor: 'rgba(10,102,194,0.35)',
      bgColor: 'rgba(10,102,194,0.12)',
      label: 'LinkedIn',
      value: 'sreemonta-bhowmik',
      href: 'https://www.linkedin.com/in/sreemonta-bhowmik-92b89320',
      btnLabel: 'Connect',
      btnIcon: 'bi-linkedin'
    },
    {
      icon: 'bi-github',
      iconColor: '#e8edf5',
      borderColor: 'rgba(255,255,255,0.2)',
      bgColor: 'rgba(255,255,255,0.05)',
      label: 'GitHub',
      value: 'sreemonta20',
      href: 'https://github.com/sreemonta20',
      btnLabel: 'View Code',
      btnIcon: 'bi-github'
    },
  ];
}
