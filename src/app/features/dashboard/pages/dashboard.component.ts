import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ButtonComponent, BadgeComponent,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../core/services/permissions.service';

interface SiteCoverage {
  site: string;
  region: string;
  guardsPresent: number;
  guardsAssigned: number;
  activeShift: string;
  shiftStatus: 'Active' | 'Upcoming' | 'No Shift';
  openIncidents: number;
}

interface AlertItem {
  id: string;
  message: string;
  site: string;
  severity: 'High' | 'Medium' | 'Low';
  time: string;
}

interface RecentIncident {
  id: string;
  type: string;
  site: string;
  severity: 'High' | 'Medium' | 'Low';
  time: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    BadgeComponent,
    DataTableComponent,
    TolleCellDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashBoardComponent {
  private router = inject(Router);
  permissions = inject(PermissionsService);

  guardsOnDuty = 42;
  activeShifts = 8;
  absentToday = 5;
  openIncidents = 3;

  siteCoverageColumns: TableColumn[] = [
    { key: 'site',          label: 'Site' },
    { key: 'region',        label: 'Region' },
    { key: 'coverage',      label: 'Coverage' },
    { key: 'shiftStatus',   label: 'Shift Status' },
    { key: 'openIncidents', label: 'Incidents' },
  ];

  siteCoverage: SiteCoverage[] = [
    { site: 'Head Office – Accra', region: 'Greater Accra', guardsPresent: 12, guardsAssigned: 14, activeShift: 'SH-001', shiftStatus: 'Active',   openIncidents: 1 },
    { site: 'Kumasi Branch',       region: 'Ashanti',       guardsPresent: 8,  guardsAssigned: 8,  activeShift: 'SH-002', shiftStatus: 'Active',   openIncidents: 0 },
    { site: 'Takoradi Branch',     region: 'Western',       guardsPresent: 7,  guardsAssigned: 9,  activeShift: 'SH-003', shiftStatus: 'Active',   openIncidents: 2 },
    { site: 'Tema Industrial',     region: 'Greater Accra', guardsPresent: 10, guardsAssigned: 10, activeShift: 'SH-004', shiftStatus: 'Active',   openIncidents: 0 },
    { site: 'Cape Coast Post',     region: 'Central',       guardsPresent: 5,  guardsAssigned: 6,  activeShift: 'SH-005', shiftStatus: 'Upcoming', openIncidents: 0 },
  ];

  alerts: AlertItem[] = [
    { id: 'ALT-001', message: 'Guard Kwame Asante has not checked in for 2+ hours',      site: 'Takoradi Branch',     severity: 'High',   time: '08:42 AM' },
    { id: 'ALT-002', message: 'Incident report submitted — unauthorized access at gate', site: 'Takoradi Branch',     severity: 'High',   time: '09:15 AM' },
    { id: 'ALT-003', message: 'Patrol route deviation detected on Zone B',               site: 'Head Office – Accra', severity: 'Medium', time: '10:03 AM' },
  ];

  recentIncidents: RecentIncident[] = [
    { id: 'INC-2025-011', type: 'Unauthorized Access', site: 'Takoradi Branch',     severity: 'High',   time: '09:15 AM',   status: 'Open' },
    { id: 'INC-2025-010', type: 'Guard Misconduct',    site: 'Head Office – Accra', severity: 'Medium', time: 'Yesterday',  status: 'Investigating' },
    { id: 'INC-2025-009', type: 'Equipment Missing',   site: 'Takoradi Branch',     severity: 'Medium', time: 'Yesterday',  status: 'Open' },
    { id: 'INC-2025-008', type: 'Suspicious Activity', site: 'Kumasi Branch',       severity: 'Low',    time: '2 days ago', status: 'Resolved' },
    { id: 'INC-2025-007', type: 'Medical Emergency',   site: 'Tema Industrial',     severity: 'High',   time: '2 days ago', status: 'Resolved' },
  ];

  getCoveragePct(row: SiteCoverage): number {
    return Math.round((row.guardsPresent / row.guardsAssigned) * 100);
  }

  getShiftStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Active':   'rgba(34, 197, 94, 0.15)',
      'Upcoming': 'rgba(234, 179, 8, 0.15)',
      'No Shift': 'rgba(239, 68, 68, 0.15)',
    };
    return map[status] ?? 'rgba(148, 163, 184, 0.15)';
  }

  getShiftStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Active':   '#16a34a',
      'Upcoming': '#ca8a04',
      'No Shift': '#dc2626',
    };
    return map[status] ?? '#64748b';
  }

  getSeverityBg(severity: string): string {
    const map: Record<string, string> = {
      'High':   'rgba(239, 68, 68, 0.15)',
      'Medium': 'rgba(234, 179, 8, 0.15)',
      'Low':    'rgba(34, 197, 94, 0.15)',
    };
    return map[severity] ?? 'rgba(148, 163, 184, 0.15)';
  }

  getSeverityFg(severity: string): string {
    const map: Record<string, string> = {
      'High':   '#dc2626',
      'Medium': '#ca8a04',
      'Low':    '#16a34a',
    };
    return map[severity] ?? '#64748b';
  }

  getIncidentStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Open':          'rgba(239, 68, 68, 0.15)',
      'Investigating': 'rgba(234, 179, 8, 0.15)',
      'Resolved':      'rgba(34, 197, 94, 0.15)',
    };
    return map[status] ?? 'rgba(148, 163, 184, 0.15)';
  }

  getIncidentStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Open':          '#dc2626',
      'Investigating': '#ca8a04',
      'Resolved':      '#16a34a',
    };
    return map[status] ?? '#64748b';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
