import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import {
  SidebarComponent,
  SidebarGroup,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ButtonComponent
} from '@tolle_/tolle-ui';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { PermissionsService } from '../../core/services/permissions.service';

@Component({
  selector: 'app-main-dashboard-layout',
  standalone: true,
  imports: [
    AppHeaderComponent,
    SidebarComponent,
    RouterOutlet,
    CommonModule
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
  private permissions = inject(PermissionsService);
  private router = inject(Router);

  breadcrumbItems: { label: string; url?: string; active?: boolean }[] = [];
  pageTitle: string = 'Dashboard';
  pageSubtitle: string = `Welcome back, ${this.permissions.displayName}! Here's what's happening.`;
  sidebarItems: SidebarGroup[] = this.permissions.buildSidebarItems();

  constructor() {
    this.updateBreadcrumb();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumb();
    });
  }

  private updateBreadcrumb() {
    const url = this.router.url;

    if (url === '/dashboard') {
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Overview', active: true }
      ];
      this.pageTitle = 'Dashboard';
      this.pageSubtitle = `Welcome back, ${this.permissions.displayName}! Here's what's happening.`;
    } else if (url === '/client-management') {
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Client Management', active: true }
      ];
      this.pageTitle = 'Client Management';
      this.pageSubtitle = 'Manage clients and their information.';
    } else if (url === '/zone-management') {
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Zone Management', active: true }
      ];
      this.pageTitle = 'Zone Management';
      this.pageSubtitle = 'Manage security patrol zones and coverage areas across Ghana.';
    } else if (url.startsWith('/finance/')) {
      const section = url.replace('/finance/', '');
      const sectionName = this.formatSectionName(section);
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Finance', url: '#' },
        { label: sectionName, active: true }
      ];
      this.pageTitle = sectionName;
      this.pageSubtitle = `Manage ${sectionName.toLowerCase()} and financial operations.`;
    } else if (url.startsWith('/hr/')) {
      const section = url.replace('/hr/', '');
      const sectionName = this.formatSectionName(section);
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'HR', url: '#' },
        { label: sectionName, active: true }
      ];
      this.pageTitle = sectionName;
      this.pageSubtitle = `Manage ${sectionName.toLowerCase()} and related operations.`;
    } else if (url.startsWith('/control-unit/')) {
      const section = url.replace('/control-unit/', '');
      const sectionName = this.formatSectionName(section);
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Control Unit', url: '#' },
        { label: sectionName, active: true }
      ];
      this.pageTitle = sectionName;
      this.pageSubtitle = `Manage ${sectionName.toLowerCase()} and security operations.`;
    } else if (url.startsWith('/procurement/')) {
      const section = url.replace('/procurement/', '');
      const sectionName = this.formatSectionName(section);
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Procurement', url: '#' },
        { label: sectionName, active: true }
      ];
      this.pageTitle = sectionName;
      this.pageSubtitle = `Manage ${sectionName.toLowerCase()} and procurement operations.`;
    } else {
      this.breadcrumbItems = [
        { label: 'Home', url: '/dashboard' },
        { label: 'Overview', active: true }
      ];
      this.pageTitle = 'Dashboard';
      this.pageSubtitle = `Welcome back, ${this.permissions.displayName}! Here's what's happening.`;
    }
  }

  private formatSectionName(section: string): string {
    const sectionMap: { [key: string]: string } = {
      'staff-management':      'Staff Management',
      'guard-management':      'Guard Management',
      'client-management':     'Client Management',
      'leave-management':      'Leave Management',
      'user-management':       'User Management',
      'shift-management':      'Shift Management',
      'check-in-out':          'Check In/Check Out',
      'zone-management':       'Zone Management',
      'payroll-management':    'Payroll Management',
      'payment-management':    'Payment Management',
      'supplier-management':   'Supplier Management',
      'logistics-management':  'Logistics Management',
      'petty-cash-management': 'Petty Cash Management'
    };
    return sectionMap[section] || section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');
  }

  navigateTo(url: string) {
    if (url && url !== '#') {
      this.router.navigate([url]);
    }
  }
}
