import { Component } from '@angular/core';
import { SidebarComponent, SidebarGroup } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  sidebarItems: SidebarGroup[] = [
    {
      title: 'HR',
      id: 'hr-group',
      items: [
        {
          title: 'Staff Management',
          icon: 'ri-user-line',
          id: 'staff-management',
          expanded: true,
          items: [
            { title: 'Guard Management', url: '/dashboard/guards', id: 'guard-management' },
            { title: 'Client Management', url: '/dashboard/clients', id: 'client-management' },
            { title: 'Leave Management', url: '/dashboard/leave', id: 'leave-management' },
            { title: 'User Management', url: '/dashboard/users', id: 'user-management' }
          ]
        }
      ]
    },
    {
      title: 'Control Unit',
      id: 'control-group',
      items: [
        {
          title: 'Operations',
          icon: 'ri-dashboard-line',
          id: 'operations',
          expanded: true,
          items: [
            { title: 'Shift Management', url: '/dashboard/shifts', id: 'shift-management' },
            { title: 'Check In / Check Out', url: '/dashboard/checkin', id: 'checkin-checkout' }
          ]
        }
      ]
    },
    {
      title: 'Procurement / Logistics',
      id: 'procurement-group',
      items: [
        {
          title: 'Supply Chain',
          icon: 'ri-truck-line',
          id: 'supply-chain',
          expanded: false,
          items: [
            { title: 'Supplier Management', url: '/dashboard/suppliers', id: 'supplier-management' },
            { title: 'Logistics Management', url: '/dashboard/logistics', id: 'logistics-management' }
          ]
        }
      ]
    },
    {
      title: 'Settings',
      id: 'settings-group',
      items: [
        { title: 'General', icon: 'ri-settings-4-line', url: '/dashboard/settings/general', id: 'general-settings' },
        { title: 'Security', icon: 'ri-shield-line', url: '/dashboard/settings/security', id: 'security-settings' },
        { title: 'Team', icon: 'ri-team-line', url: '/dashboard/settings/team', id: 'team-settings' }
      ]
    }
  ];

  constructor() {}
}
