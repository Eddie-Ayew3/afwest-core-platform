import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
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

const CLIENT_NAMES: Record<string, string> = {
  CLT001: 'GoldFields Ghana Ltd.',
  CLT002: 'Accra Mall Management',
  CLT003: 'Kumasi Hive Ventures',
  CLT004: 'KNUST Research Institute',
  CLT005: 'Takoradi Harbour Authority',
  CLT006: 'Ahanta West Municipal',
  CLT007: 'Cape Coast Teaching Hospital',
  CLT008: 'Volta River Authority',
};

@Component({
  selector: 'app-client-dashboard-layout',
  standalone: true,
  imports: [
    AppHeaderComponent,
    SidebarComponent,
    RouterOutlet,
    RouterLink,
    CommonModule
  ],
  templateUrl: './client-dashboard-layout.component.html',
  styleUrl: './client-dashboard-layout.component.css'
})
export class ClientDashboardLayoutComponent implements OnInit {
    breadcrumbItems: { label: string; url?: string; active?: boolean }[] = [];
    pageTitle: string = 'Client Dashboard';
    pageSubtitle: string = 'Client overview and management.';
    clientId: string = '';
    clientName: string = '';
    
    // Client-specific sidebar items
    clientSidebarItems: SidebarGroup[] = [
        {
            title: 'Client Operations',
            items: [
                {
                    title: 'Dashboard',
                    icon: 'ri-dashboard-line',
                    url: '/client/dashboard'
                },
                {
                    title: 'Shift Management',
                    icon: 'ri-time-line',
                    url: '/client/shift'
                },
                {
                    title: 'Request Management',
                    icon: 'ri-file-list-line',
                    url: '/client/request'
                },
                {
                    title: 'Site Management',
                    icon: 'ri-map-pin-line',
                    url: '/client/site'
                },
                {
                    title: 'Guard Management',
                    icon: 'ri-shield-user-line',
                    url: '/client/guard'
                }
            ]
        },
        {
            title: 'Client Information',
            items: [
                {
                    title: 'Usage Statistics',
                    icon: 'ri-bar-chart-line',
                    url: '/client/usage'
                },
                {
                    title: 'Access Keys',
                    icon: 'ri-key-line',
                    url: '/client/generate-access-key'
                },
                {
                    title: 'Contacts',
                    icon: 'ri-contacts-line',
                    url: '/client/contacts'
                }
            ]
        },
        {
            title: 'Financial',
            items: [
                {
                    title: 'Invoices',
                    icon: 'ri-file-invoice-line',
                    url: '/client/invoices'
                },
                {
                    title: 'Payments',
                    icon: 'ri-bank-card-line',
                    url: '/client/payments'
                }
            ]
        }
    ];
    
    constructor(
      private router: Router,
      private route: ActivatedRoute
    ) {
      // Listen for future navigations
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        // clientId lives on the child route (e.g. dashboard/:id), not on /client
        this.clientId = this.route.firstChild?.snapshot.paramMap.get('id') || '';
        this.clientName = CLIENT_NAMES[this.clientId] ?? this.clientId;
        this.updateSidebarUrls();
        this.updateBreadcrumb();
      });
    }

    ngOnInit(): void {
      // Initial load — child route is already activated by the time ngOnInit runs
      this.clientId = this.route.firstChild?.snapshot.paramMap.get('id') || '';
      this.clientName = CLIENT_NAMES[this.clientId] ?? this.clientId;
      this.updateSidebarUrls();
      this.updateBreadcrumb();
    }
    
    updateSidebarUrls(): void {
      // Routes are defined as /client/<section>/:id, e.g. /client/dashboard/123
      const id = this.clientId;

      this.clientSidebarItems[0].items[0].url = `/client/dashboard/${id}`;
      this.clientSidebarItems[0].items[1].url = `/client/shift/${id}`;
      this.clientSidebarItems[0].items[2].url = `/client/request/${id}`;
      this.clientSidebarItems[0].items[3].url = `/client/site/${id}`;
      this.clientSidebarItems[0].items[4].url = `/client/guard/${id}`;

      this.clientSidebarItems[1].items[0].url = `/client/usage/${id}`;
      this.clientSidebarItems[1].items[1].url = `/client/generate-access-key/${id}`;
      this.clientSidebarItems[1].items[2].url = `/client/contacts/${id}`;

      this.clientSidebarItems[2].items[0].url = `/client/invoices/${id}`;
      this.clientSidebarItems[2].items[1].url = `/client/payments/${id}`;
    }
    
    private updateBreadcrumb() {
      const url = this.router.url;
      // Back-link to the dashboard tab for this client, matches route /client/dashboard/:id
      const clientDashboardUrl = this.clientId ? `/client/dashboard/${this.clientId}` : '/client/dashboard';
      
      if (url.includes('/client/dashboard')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', active: true }
        ];
        this.pageTitle = 'Client Dashboard';
        this.pageSubtitle = this.clientId ? `Overview for client ${this.clientId}` : 'Client overview and management.';
      } else if (url.includes('/client/request')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Request Management', active: true }
        ];
        this.pageTitle = 'Request Management';
        this.pageSubtitle = this.clientId ? `Manage requests for client ${this.clientId}` : 'Client request tracking and management.';
      } else if (url.includes('/client/shift')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Shift Management', active: true }
        ];
        this.pageTitle = 'Shift Management';
        this.pageSubtitle = this.clientId ? `Manage shifts for client ${this.clientId}` : 'Client shift scheduling and management.';
      } else if (url.includes('/client/site')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Site Management', active: true }
        ];
        this.pageTitle = 'Site Management';
        this.pageSubtitle = this.clientId ? `Manage sites for client ${this.clientId}` : 'Client site and location management.';
      } else if (url.includes('/client/guard')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Guard Management', active: true }
        ];
        this.pageTitle = 'Guard Management';
        this.pageSubtitle = this.clientId ? `Manage guards for client ${this.clientId}` : 'Client guard personnel management.';
      } else if (url.includes('/client/usage')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Usage Statistics', active: true }
        ];
        this.pageTitle = 'Usage Statistics';
        this.pageSubtitle = this.clientId ? `Usage data for client ${this.clientId}` : 'Client usage statistics and analytics.';
      } else if (url.includes('/client/generate-access-key')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Access Keys', active: true }
        ];
        this.pageTitle = 'Access Keys';
        this.pageSubtitle = this.clientId ? `Manage access keys for client ${this.clientId}` : 'Generate and manage client access keys.';
      } else if (url.includes('/client/contacts')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Contacts', active: true }
        ];
        this.pageTitle = 'Contacts';
        this.pageSubtitle = this.clientId ? `Manage contacts for client ${this.clientId}` : 'Client contact management.';
      } else if (url.includes('/client/invoices')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Invoices', active: true }
        ];
        this.pageTitle = 'Invoices';
        this.pageSubtitle = this.clientId ? `Manage invoices for client ${this.clientId}` : 'Client invoice management.';
      } else if (url.includes('/client/payments')) {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', url: clientDashboardUrl },
          { label: 'Payments', active: true }
        ];
        this.pageTitle = 'Payments';
        this.pageSubtitle = this.clientId ? `Manage payments for client ${this.clientId}` : 'Client payment management.';
      } else {
        this.breadcrumbItems = [
          { label: 'Home', url: '/dashboard' },
          { label: 'Client Management', url: '/hr/client-management' },
          { label: 'Client Dashboard', active: true }
        ];
        this.pageTitle = 'Client Dashboard';
        this.pageSubtitle = this.clientId ? `Overview for client ${this.clientId}` : 'Client overview and management.';
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
}
