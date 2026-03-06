import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  SheetComponent, SheetContentComponent, LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../core/services/permissions.service';

interface Shift {
  id: number;
  shiftCode: string;
  shiftName: string;
  site: string;
  date: string;
  startTime: string;
  endTime: string;
  supervisor: string;
  guardsAssigned: number;
  guardsPresent: number;
  type: 'Morning' | 'Afternoon' | 'Night';
  status: 'Active' | 'Upcoming' | 'Completed' | 'Cancelled';
}

@Component({
  selector: 'app-shift-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    SheetComponent, SheetContentComponent, LabelComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './shift-management.component.html',
  styleUrl: './shift-management.component.css'
})
export class ShiftManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('shiftModal') shiftModal!: TemplateRef<any>;
  private permissions = inject(PermissionsService);

  columns: TableColumn[] = [
    { key: 'shift', label: 'Shift' },
    { key: 'type', label: 'Type' },
    { key: 'site', label: 'Site' },
    { key: 'datetime', label: 'Date & Time' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'guards', label: 'Guards' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  shifts: Shift[] = [
    { id: 1,  shiftCode: 'SH-001', shiftName: 'Morning Alpha',   site: 'Head Office – Accra', date: '2025-03-01', startTime: '06:00', endTime: '14:00', supervisor: 'Kofi Asante',     guardsAssigned: 5, guardsPresent: 5, type: 'Morning',   status: 'Active' },
    { id: 2,  shiftCode: 'SH-002', shiftName: 'Afternoon Bravo', site: 'Kumasi Branch',       date: '2025-03-01', startTime: '14:00', endTime: '22:00', supervisor: 'Akosua Frimpong', guardsAssigned: 4, guardsPresent: 3, type: 'Afternoon', status: 'Active' },
    { id: 3,  shiftCode: 'SH-003', shiftName: 'Night Charlie',   site: 'Tema Industrial',     date: '2025-03-01', startTime: '22:00', endTime: '06:00', supervisor: 'Kweku Baffoe',    guardsAssigned: 3, guardsPresent: 3, type: 'Night',     status: 'Active' },
    { id: 4,  shiftCode: 'SH-004', shiftName: 'Morning Delta',   site: 'Takoradi Branch',     date: '2025-03-01', startTime: '06:00', endTime: '14:00', supervisor: 'Kwame Mensah',    guardsAssigned: 4, guardsPresent: 2, type: 'Morning',   status: 'Active' },
    { id: 5,  shiftCode: 'SH-005', shiftName: 'Afternoon Echo',  site: 'Cape Coast Post',     date: '2025-03-01', startTime: '14:00', endTime: '22:00', supervisor: 'Nana Acheampong', guardsAssigned: 2, guardsPresent: 0, type: 'Afternoon', status: 'Upcoming' },
    { id: 6,  shiftCode: 'SH-006', shiftName: 'Morning Foxtrot', site: 'Head Office – Accra', date: '2025-03-01', startTime: '06:00', endTime: '14:00', supervisor: 'Akua Tetteh',     guardsAssigned: 6, guardsPresent: 6, type: 'Morning',   status: 'Active' },
    { id: 7,  shiftCode: 'SH-007', shiftName: 'Night Golf',      site: 'Kumasi Branch',       date: '2025-02-28', startTime: '22:00', endTime: '06:00', supervisor: 'Yaw Darko',       guardsAssigned: 3, guardsPresent: 3, type: 'Night',     status: 'Completed' },
    { id: 8,  shiftCode: 'SH-008', shiftName: 'Morning Hotel',   site: 'Tema Industrial',     date: '2025-02-28', startTime: '06:00', endTime: '14:00', supervisor: 'Adwoa Kyei',      guardsAssigned: 4, guardsPresent: 4, type: 'Morning',   status: 'Completed' },
    { id: 9,  shiftCode: 'SH-009', shiftName: 'Afternoon India', site: 'Takoradi Branch',     date: '2025-02-28', startTime: '14:00', endTime: '22:00', supervisor: 'Ama Boateng',     guardsAssigned: 3, guardsPresent: 2, type: 'Afternoon', status: 'Completed' },
    { id: 10, shiftCode: 'SH-010', shiftName: 'Morning Juliet',  site: 'Cape Coast Post',     date: '2025-03-02', startTime: '06:00', endTime: '14:00', supervisor: 'Kojo Agyemang',   guardsAssigned: 3, guardsPresent: 0, type: 'Morning',   status: 'Upcoming' },
  ];

  filteredShifts: Shift[] = [];
  showFilterPanel = false;
  showCreateSheet = false;
  creating = false;

  filterStatus: 'All' | 'Active' | 'Upcoming' | 'Completed' | 'Cancelled' = 'All';
  filterType: 'All' | 'Morning' | 'Afternoon' | 'Night' = 'All';

  newShift = { site: '', date: '', type: 'Morning', supervisor: '', guardsAssigned: 2 };

  get activeCount()   { return this.shifts.filter(s => s.status === 'Active').length; }
  get upcomingCount() { return this.shifts.filter(s => s.status === 'Upcoming').length; }
  get onDutyCount()   { return this.shifts.filter(s => s.status === 'Active').reduce((acc, s) => acc + s.guardsPresent, 0); }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filterStatus !== 'All') count++;
    if (this.filterType !== 'All') count++;
    return count;
  }

  ngOnInit() {
    this.shifts = this.permissions.filterBySite(this.shifts);
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.shifts];
    if (this.filterStatus !== 'All') result = result.filter(s => s.status === this.filterStatus);
    if (this.filterType !== 'All') result = result.filter(s => s.type === this.filterType);
    this.filteredShifts = result;
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.filterType = 'All';
    this.applyFilter();
  }

  openCreateSheet() {
    this.newShift = { site: '', date: '', type: 'Morning', supervisor: '', guardsAssigned: 2 };
    this.showCreateSheet = true;
  }

  submitShift() {
    this.creating = true;
    setTimeout(() => {
      const typeMap: Record<string, string> = { Morning: '06:00–14:00', Afternoon: '14:00–22:00', Night: '22:00–06:00' };
      const times = typeMap[this.newShift.type].split('–');
      this.shifts.unshift({
        id: Date.now(),
        shiftCode: `SH-${String(this.shifts.length + 1).padStart(3, '0')}`,
        shiftName: `${this.newShift.type} New`,
        site: this.newShift.site || 'Head Office – Accra',
        date: this.newShift.date || new Date().toISOString().split('T')[0],
        startTime: times[0],
        endTime: times[1],
        supervisor: this.newShift.supervisor || 'TBD',
        guardsAssigned: this.newShift.guardsAssigned,
        guardsPresent: 0,
        type: this.newShift.type as 'Morning' | 'Afternoon' | 'Night',
        status: 'Upcoming'
      });
      this.applyFilter();
      this.showCreateSheet = false;
      this.creating = false;
    }, 600);
  }

  viewShift(shift: Shift) {
    this.modalService.open({
      title: `Shift Details – ${shift.shiftCode}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.shiftModal,
      context: { shift }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Active':    'rgba(76, 175, 80, 0.15)',
      'Upcoming':  'rgba(33, 150, 243, 0.15)',
      'Completed': 'rgba(120, 120, 120, 0.15)',
      'Cancelled': 'rgba(244, 67, 54, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Active':    '#4CAF50',
      'Upcoming':  '#2196F3',
      'Completed': '#757575',
      'Cancelled': '#F44336'
    };
    return map[status] ?? '';
  }

  getTypeBg(type: string): string {
    const map: Record<string, string> = {
      'Morning':   'rgba(255, 193, 7, 0.15)',
      'Afternoon': 'rgba(255, 152, 0, 0.15)',
      'Night':     'rgba(63, 81, 181, 0.15)'
    };
    return map[type] ?? '';
  }

  getTypeFg(type: string): string {
    const map: Record<string, string> = {
      'Morning':   '#F59E0B',
      'Afternoon': '#FF9800',
      'Night':     '#3F51B5'
    };
    return map[type] ?? '';
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      'Morning':   'ri-sun-line',
      'Afternoon': 'ri-sun-foggy-line',
      'Night':     'ri-moon-line'
    };
    return map[type] ?? 'ri-time-line';
  }
}
