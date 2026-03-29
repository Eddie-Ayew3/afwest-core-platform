import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent, TextareaComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  SheetComponent, SheetContentComponent,
  ModalService, AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../core/services/permissions.service';

interface Incident {
  id: string;
  type: string;
  site: string;
  region: string;
  reportedBy: string;
  date: string;
  time: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  description: string;
}

@Component({
  selector: 'app-incidents-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent, TextareaComponent,
    TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
    SheetComponent, SheetContentComponent,
  ],
  templateUrl: './incidents-management.component.html',
  styleUrls: ['./incidents-management.component.css'],
})
export class IncidentsManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog  = inject(AlertDialogService);
  private toast        = inject(ToastService);
  permissions = inject(PermissionsService);

  @ViewChild('reportModal') reportModal!: TemplateRef<any>;

  showFilterPanel  = false;
  showCreateSheet  = false;
  searchQuery      = '';
  selectedSeverity = 'all';
  selectedStatus   = 'all';
  selectedSite     = 'all';

  severityOptions = ['High', 'Medium', 'Low'];
  statusOptions   = ['Open', 'Investigating', 'Resolved', 'Closed'];
  siteOptions     = ['Head Office – Accra', 'Kumasi Branch', 'Takoradi Branch', 'Tema Industrial', 'Cape Coast Post'];

  newIncidentForm = {
    type: '',
    site: '',
    severity: '' as 'High' | 'Medium' | 'Low' | '',
    date: '',
    time: '',
    reportedBy: '',
    description: '',
  };

  columns: TableColumn[] = [
    { key: 'id',          label: 'Ref No.' },
    { key: 'type',        label: 'Incident Type' },
    { key: 'site',        label: 'Site' },
    { key: 'reportedBy',  label: 'Reported By' },
    { key: 'date',        label: 'Date' },
    { key: 'severity',    label: 'Severity' },
    { key: 'status',      label: 'Status' },
    { key: 'actions',     label: '' },
  ];

  incidents: Incident[] = [
    { id: 'INC-2025-011', type: 'Unauthorized Access',   site: 'Takoradi Branch',     region: 'Western',       reportedBy: 'Kwame Asante',    date: '21 Mar 2025', time: '09:15', severity: 'High',   status: 'Open',          description: 'Unknown individual forced entry through the east gate at approximately 09:00.' },
    { id: 'INC-2025-010', type: 'Guard Misconduct',      site: 'Head Office – Accra', region: 'Greater Accra', reportedBy: 'Ama Boateng',     date: '20 Mar 2025', time: '14:30', severity: 'Medium', status: 'Investigating', description: 'Guard found asleep during duty hours on floor 2.' },
    { id: 'INC-2025-009', type: 'Equipment Missing',     site: 'Takoradi Branch',     region: 'Western',       reportedBy: 'Kofi Acheampong', date: '20 Mar 2025', time: '08:00', severity: 'Medium', status: 'Open',          description: 'Two radio sets and one torchlight reported missing from the control room.' },
    { id: 'INC-2025-008', type: 'Suspicious Activity',  site: 'Kumasi Branch',       region: 'Ashanti',       reportedBy: 'Yaw Darko',       date: '19 Mar 2025', time: '22:45', severity: 'Low',    status: 'Resolved',      description: 'A vehicle was observed circling the perimeter three times before departing.' },
    { id: 'INC-2025-007', type: 'Medical Emergency',    site: 'Tema Industrial',     region: 'Greater Accra', reportedBy: 'Abena Osei',      date: '19 Mar 2025', time: '11:20', severity: 'High',   status: 'Resolved',      description: 'Guard Nana Mensah collapsed during patrol. Ambulance was called immediately.' },
    { id: 'INC-2025-006', type: 'Suspicious Vehicle',   site: 'Cape Coast Post',     region: 'Central',       reportedBy: 'Efua Mensah',     date: '18 Mar 2025', time: '03:10', severity: 'Medium', status: 'Closed',        description: 'Unplated vehicle parked near south perimeter for over 45 minutes.' },
    { id: 'INC-2025-005', type: 'Property Damage',      site: 'Head Office – Accra', region: 'Greater Accra', reportedBy: 'Kwame Asante',    date: '17 Mar 2025', time: '16:50', severity: 'Low',    status: 'Closed',        description: 'Vandalism to security booth window at entrance 3.' },
    { id: 'INC-2025-004', type: 'Trespassing',          site: 'Kumasi Branch',       region: 'Ashanti',       reportedBy: 'Nana Acheampong', date: '16 Mar 2025', time: '19:30', severity: 'Medium', status: 'Resolved',      description: 'Group of juveniles found on property after hours. Police contacted.' },
    { id: 'INC-2025-003', type: 'Theft',                site: 'Takoradi Branch',     region: 'Western',       reportedBy: 'Kofi Acheampong', date: '15 Mar 2025', time: '07:45', severity: 'High',   status: 'Closed',        description: 'Laptop reported stolen from client office on level 2. CCTV footage reviewed.' },
    { id: 'INC-2025-002', type: 'Fire Alarm Triggered', site: 'Tema Industrial',     region: 'Greater Accra', reportedBy: 'Abena Osei',      date: '14 Mar 2025', time: '10:05', severity: 'High',   status: 'Closed',        description: 'Fire alarm triggered in warehouse B. Confirmed false alarm — faulty sensor.' },
  ];

  filteredIncidents: Incident[] = [];

  get activeFilterCount(): number {
    let c = 0;
    if (this.selectedSeverity !== 'all') c++;
    if (this.selectedStatus   !== 'all') c++;
    if (this.selectedSite     !== 'all') c++;
    return c;
  }

  get openCount():          number { return this.incidents.filter(i => i.status === 'Open').length; }
  get investigatingCount(): number { return this.incidents.filter(i => i.status === 'Investigating').length; }
  get resolvedCount():      number { return this.incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length; }
  get highCount():          number { return this.incidents.filter(i => i.severity === 'High').length; }

  ngOnInit(): void { this.applyFilter(); }

  applyFilter(): void {
    let result = [...this.incidents];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.site.toLowerCase().includes(q) ||
        i.reportedBy.toLowerCase().includes(q)
      );
    }
    if (this.selectedSeverity !== 'all') result = result.filter(i => i.severity === this.selectedSeverity);
    if (this.selectedStatus   !== 'all') result = result.filter(i => i.status   === this.selectedStatus);
    if (this.selectedSite     !== 'all') result = result.filter(i => i.site     === this.selectedSite);
    this.filteredIncidents = result;
  }

  onSearch(): void { this.applyFilter(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void {
    this.selectedSeverity = 'all';
    this.selectedStatus   = 'all';
    this.selectedSite     = 'all';
    this.applyFilter();
  }

  openCreateSheet(): void {
    this.newIncidentForm = { type: '', site: '', severity: '', date: '', time: '', reportedBy: '', description: '' };
    this.showCreateSheet = true;
  }

  submitIncident(): void {
    if (!this.newIncidentForm.type || !this.newIncidentForm.site || !this.newIncidentForm.severity) return;
    const nextNum = this.incidents.length + 1;
    const id = `INC-2025-0${String(nextNum).padStart(2, '0')}`;
    const newIncident: Incident = {
      id,
      type:       this.newIncidentForm.type,
      site:       this.newIncidentForm.site,
      region:     this.getRegionForSite(this.newIncidentForm.site),
      reportedBy: this.newIncidentForm.reportedBy || this.permissions.displayName,
      date:       this.newIncidentForm.date || '21 Mar 2025',
      time:       this.newIncidentForm.time || '--:--',
      severity:   this.newIncidentForm.severity as 'High' | 'Medium' | 'Low',
      status:     'Open',
      description: this.newIncidentForm.description,
    };
    this.incidents.unshift(newIncident);
    this.applyFilter();
    this.showCreateSheet = false;
    this.toast.show({ title: 'Incident Reported', description: `${id} has been logged successfully.`, variant: 'success' });
  }

  viewIncident(incident: Incident): void {
    this.modalService.open({
      title: `${incident.id} — ${incident.type}`,
      content: `
        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-3">
            <div><p class="text-xs text-muted-foreground mb-0.5">Site</p><p class="font-medium">${incident.site}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Region</p><p class="font-medium">${incident.region}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Date & Time</p><p class="font-medium">${incident.date} · ${incident.time}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Reported By</p><p class="font-medium">${incident.reportedBy}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Severity</p><p class="font-medium">${incident.severity}</p></div>
            <div><p class="text-xs text-muted-foreground mb-0.5">Status</p><p class="font-medium">${incident.status}</p></div>
          </div>
          <div class="border-t border-border pt-3">
            <p class="text-xs text-muted-foreground mb-1">Description</p>
            <p>${incident.description}</p>
          </div>
        </div>
      `,
      size: 'default',
    });
  }

  updateStatus(incident: Incident, status: Incident['status']): void {
    incident.status = status;
    this.applyFilter();
    this.toast.show({ title: 'Status Updated', description: `${incident.id} marked as ${status}.`, variant: 'success' });
  }

  deleteIncident(incident: Incident): void {
    const ref = this.alertDialog.open({
      title: 'Delete Incident Report?',
      description: `Delete "${incident.id}"? This action cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.incidents = this.incidents.filter(i => i.id !== incident.id);
      this.applyFilter();
      this.toast.show({ title: 'Deleted', description: `${incident.id} has been removed.`, variant: 'destructive' });
    });
  }

  getSeverityBg(severity: string): string {
    const map: Record<string, string> = { 'High': 'rgba(239,68,68,0.15)', 'Medium': 'rgba(234,179,8,0.15)', 'Low': 'rgba(34,197,94,0.15)' };
    return map[severity] ?? 'rgba(148,163,184,0.15)';
  }

  getSeverityFg(severity: string): string {
    const map: Record<string, string> = { 'High': '#dc2626', 'Medium': '#ca8a04', 'Low': '#16a34a' };
    return map[severity] ?? '#64748b';
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Open':          'rgba(239,68,68,0.15)',
      'Investigating': 'rgba(234,179,8,0.15)',
      'Resolved':      'rgba(34,197,94,0.15)',
      'Closed':        'rgba(148,163,184,0.15)',
    };
    return map[status] ?? 'rgba(148,163,184,0.15)';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Open':          '#dc2626',
      'Investigating': '#ca8a04',
      'Resolved':      '#16a34a',
      'Closed':        '#64748b',
    };
    return map[status] ?? '#64748b';
  }

  private getRegionForSite(site: string): string {
    const map: Record<string, string> = {
      'Head Office – Accra': 'Greater Accra',
      'Tema Industrial':     'Greater Accra',
      'Kumasi Branch':       'Ashanti',
      'Takoradi Branch':     'Western',
      'Cape Coast Post':     'Central',
    };
    return map[site] ?? 'Unknown';
  }
}
