import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonComponent, BadgeComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';
import { LoadingService } from '../../../../core/guards/loading.guard';

interface ClientShift {
  shiftCode: string;
  site: string;
  date: string;
  time: string;
  guardsAssigned: number;
  status: 'Active' | 'Completed' | 'Upcoming';
}

interface ClientIncident {
  id: string;
  type: string;
  site: string;
  severity: 'High' | 'Medium' | 'Low';
  date: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

const CLIENT_DATA: Record<string, {
  name: string;
  guardsAssigned: number;
  activeSites: number;
  pendingRequests: number;
  slaCompliance: number;
  shifts: ClientShift[];
  incidents: ClientIncident[];
}> = {
  'CLT001': {
    name: 'GoldFields Ghana Ltd.',
    guardsAssigned: 24, activeSites: 3, pendingRequests: 2, slaCompliance: 97,
    shifts: [
      { shiftCode: 'SH-001', site: 'Tarkwa Mine — Gate A', date: '21 Mar 2025', time: '06:00 – 18:00', guardsAssigned: 8,  status: 'Active' },
      { shiftCode: 'SH-002', site: 'Tarkwa Mine — Gate B', date: '21 Mar 2025', time: '06:00 – 18:00', guardsAssigned: 6,  status: 'Active' },
      { shiftCode: 'SH-003', site: 'Damang Site',          date: '20 Mar 2025', time: '18:00 – 06:00', guardsAssigned: 10, status: 'Completed' },
    ],
    incidents: [
      { id: 'INC-2025-009', type: 'Unauthorized Access',   site: 'Tarkwa Mine — Gate A', severity: 'High',   date: '19 Mar 2025', status: 'Investigating' },
      { id: 'INC-2025-004', type: 'Equipment Tampering',   site: 'Damang Site',          severity: 'Medium', date: '15 Mar 2025', status: 'Resolved' },
    ],
  },
  'CLT002': {
    name: 'Accra Mall Management',
    guardsAssigned: 12, activeSites: 1, pendingRequests: 1, slaCompliance: 99,
    shifts: [
      { shiftCode: 'SH-011', site: 'Accra Mall — Main Entrance', date: '21 Mar 2025', time: '06:00 – 18:00', guardsAssigned: 6, status: 'Active' },
      { shiftCode: 'SH-012', site: 'Accra Mall — Car Park',      date: '21 Mar 2025', time: '18:00 – 06:00', guardsAssigned: 6, status: 'Upcoming' },
    ],
    incidents: [
      { id: 'INC-2025-011', type: 'Shoplifting Attempt', site: 'Accra Mall — Main Entrance', severity: 'Low', date: '20 Mar 2025', status: 'Resolved' },
    ],
  },
  'CLT003': {
    name: 'Kumasi Hive Ventures',
    guardsAssigned: 6, activeSites: 1, pendingRequests: 0, slaCompliance: 95,
    shifts: [
      { shiftCode: 'SH-021', site: 'Kumasi Hive HQ', date: '21 Mar 2025', time: '08:00 – 20:00', guardsAssigned: 3, status: 'Active' },
      { shiftCode: 'SH-022', site: 'Kumasi Hive HQ', date: '20 Mar 2025', time: '20:00 – 08:00', guardsAssigned: 3, status: 'Completed' },
    ],
    incidents: [],
  },
  'CLT004': {
    name: 'KNUST Research Institute',
    guardsAssigned: 8, activeSites: 2, pendingRequests: 1, slaCompliance: 93,
    shifts: [
      { shiftCode: 'SH-031', site: 'KNUST Main Gate',  date: '21 Mar 2025', time: '06:00 – 18:00', guardsAssigned: 4, status: 'Active' },
      { shiftCode: 'SH-032', site: 'KNUST Research Lab', date: '20 Mar 2025', time: '18:00 – 06:00', guardsAssigned: 4, status: 'Completed' },
    ],
    incidents: [
      { id: 'INC-2025-006', type: 'Suspicious Vehicle', site: 'KNUST Main Gate', severity: 'Medium', date: '18 Mar 2025', status: 'Resolved' },
    ],
  },
  'CLT005': {
    name: 'Takoradi Harbour Authority',
    guardsAssigned: 18, activeSites: 2, pendingRequests: 3, slaCompliance: 91,
    shifts: [
      { shiftCode: 'SH-041', site: 'Takoradi Port — North', date: '21 Mar 2025', time: '06:00 – 18:00', guardsAssigned: 9, status: 'Active' },
      { shiftCode: 'SH-042', site: 'Takoradi Port — South', date: '21 Mar 2025', time: '06:00 – 18:00', guardsAssigned: 9, status: 'Active' },
    ],
    incidents: [
      { id: 'INC-2025-010', type: 'Cargo Theft Attempt', site: 'Takoradi Port — North', severity: 'High',   date: '20 Mar 2025', status: 'Open' },
      { id: 'INC-2025-008', type: 'Unauthorized Access', site: 'Takoradi Port — South', severity: 'Medium', date: '17 Mar 2025', status: 'Investigating' },
    ],
  },
};

const FALLBACK_DATA = {
  name: 'Unknown Client',
  guardsAssigned: 0, activeSites: 0, pendingRequests: 0, slaCompliance: 0,
  shifts: [], incidents: [],
};

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent, BadgeComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  clientId = '';
  clientName = '';
  guardsAssigned = 0;
  activeSites = 0;
  pendingRequests = 0;
  slaCompliance = 0;

  shifts: ClientShift[] = [];
  incidents: ClientIncident[] = [];

  shiftColumns: TableColumn[] = [
    { key: 'shiftCode',      label: 'Shift' },
    { key: 'site',           label: 'Site' },
    { key: 'date',           label: 'Date' },
    { key: 'time',           label: 'Time' },
    { key: 'guardsAssigned', label: 'Guards' },
    { key: 'status',         label: 'Status' },
  ];

  incidentColumns: TableColumn[] = [
    { key: 'id',       label: 'Ref' },
    { key: 'type',     label: 'Incident Type' },
    { key: 'site',     label: 'Site' },
    { key: 'severity', label: 'Severity' },
    { key: 'date',     label: 'Date' },
    { key: 'status',   label: 'Status' },
  ];

  ngOnInit(): void {
    this.loadingService.show();
    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('id') || '';
      this.loadClientData();
    });
  }

  private loadClientData(): void {
    setTimeout(() => {
      const data = CLIENT_DATA[this.clientId] ?? FALLBACK_DATA;
      this.clientName      = data.name;
      this.guardsAssigned  = data.guardsAssigned;
      this.activeSites     = data.activeSites;
      this.pendingRequests = data.pendingRequests;
      this.slaCompliance   = data.slaCompliance;
      this.shifts          = data.shifts;
      this.incidents       = data.incidents;
      this.loadingService.hide();
    }, 1500);
  }

  getShiftStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Active':    'rgba(34, 197, 94, 0.15)',
      'Upcoming':  'rgba(234, 179, 8, 0.15)',
      'Completed': 'rgba(148, 163, 184, 0.15)',
    };
    return map[status] ?? 'rgba(148, 163, 184, 0.15)';
  }

  getShiftStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Active':    '#16a34a',
      'Upcoming':  '#ca8a04',
      'Completed': '#64748b',
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

  getSlaColor(): string {
    if (this.slaCompliance >= 95) return '#16a34a';
    if (this.slaCompliance >= 85) return '#ca8a04';
    return '#dc2626';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateBack(): void {
    this.router.navigate(['/client-management']);
  }
}
