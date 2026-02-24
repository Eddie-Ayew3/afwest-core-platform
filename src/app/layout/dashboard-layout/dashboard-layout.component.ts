import { Component } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent, 
    RouterOutlet,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    ButtonComponent,
    CommonModule
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css'
})
export class DashboardLayoutComponent {
    breadcrumbItems: { label: string; url?: string; active?: boolean }[] = [];
    pageTitle: string = 'Dashboard';
    pageSubtitle: string = 'Welcome back, John! Here\'s what\'s happening.';
    sidebarItems: SidebarGroup[] = [
        {
            title: 'Main',
            items: [
                {
                    title: 'Overview',
                    icon: 'ri-dashboard-line',
                    url: '/dashboard'
                }
            ]
        },
        {
            title: 'Platform',
            items: [
                {
                    title: 'HR',
                    icon: 'ri-team-line',
                    expanded: false,
                    items: [
                        { title: 'Staff/Guard Management', url: '/hr/staff-management' },
                        { title: 'Client Management', url: '/hr/client-management' },
                        { title: 'Leave Management', url: '/hr/leave-management' },
                        { title:  'User Management',  url: '/hr/user-management'}
                    ]
                },
                {
                    title: 'Control Unit',
                    icon: 'ri-shield-check-line',
                    expanded: false,
                    items: [
                        { title: 'Shift Management', url: '/control-unit/shift-management' },
                        { title: 'Check In? Check Out', url: '/control-unit/check-in-out' },
                        { title: 'Quantum', url: '#' }
                    ]
                },
                {
                    title: 'Procurement',
                    icon: 'ri-shopping-cart-line',
                    expanded: false,
                    items: [
                        { title: 'Supplier Management', url: '/procurement/supplier-management' },
                        { title: 'Logistics Management', url: '/procurement/logistics-management' },
                        { title: 'Petty Cash Management', url: '/procurement/petty-cash-management' },
                        { title: 'Changelog', url: '#' }
                    ]
                },
                {
                    title: 'Settings',
                    icon: 'ri-settings-4-line',
                    expanded: false,
                    items: [
                        { title: 'General', url: '#' },
                        { title: 'Team', url: '#' },
                        { title: 'Billing', url: '#' },
                        { title: 'Limits', url: '#' }
                    ]
                }
            ]
        },
        {
            title: 'Projects',
            items: [
                { title: 'Design Engineering', icon: 'ri-layout-line', url: '#' },
                { title: 'Sales & Marketing', icon: 'ri-pie-chart-line', url: '#' },
                { title: 'Travel', icon: 'ri-map-pin-line', url: '#' }
            ]
        }
    ];
    
    constructor(private router: Router) {
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
        this.pageSubtitle = 'Welcome back, John! Here\'s what\'s happening.';
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
        this.pageSubtitle = 'Welcome back, John! Here\'s what\'s happening.';
      }
    }
    
    private formatSectionName(section: string): string {
      const sectionMap: { [key: string]: string } = {
        'staff-management': 'Staff Management',
        'client-management': 'Client Management',
        'leave-management': 'Leave Management',
        'user-management': 'User Management',
        'shift-management': 'Shift Management',
        'check-in-out': 'Check In/Check Out',
        'supplier-management': 'Supplier Management',
        'logistics-management': 'Logistics Management',
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
