import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  SheetComponent, SheetContentComponent, LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../core/services/permissions.service';

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
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
   LabelComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './shift-management.component.html',
  styleUrl: './shift-management.component.css'
})
export class ShiftManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('shiftModal') shiftModal!: TemplateRef<any>;
  @ViewChild('createShiftModal') createShiftModal!: TemplateRef<any>;
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
  filterStatus: 'All' | 'Active' | 'Upcoming' | 'Completed' | 'Cancelled' = 'All';
  filterType: 'All' | 'Morning' | 'Afternoon' | 'Night' = 'All';
  
  // Modal state
  showCreateModal = false;
  createStep = 0;
  step1Error = '';
  creating = false;

  newShift = {
    shiftName: '',
    site: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'Morning' as 'Morning' | 'Afternoon' | 'Night',
    supervisor: '',
    guardsAssigned: 2,
    status: 'Upcoming' as 'Active' | 'Upcoming' | 'Completed' | 'Cancelled',
    notes: ''
  };

  readonly sites = [
    'Head Office – Accra',
    'Kumasi Branch', 
    'Takoradi Branch',
    'Tema Industrial',
    'Cape Coast Post'
  ];

  readonly supervisors = [
    'Kofi Asante',
    'Akosua Frimpong', 
    'Kweku Baffoe',
    'Kwame Mensah',
    'Nana Acheampong',
    'Yaw Darko',
    'Adwoa Kyei',
    'Kojo Agyemang'
  ];

  readonly shiftTypes = [
    { value: 'Morning', label: 'Morning (06:00–14:00)', icon: 'ri-sun-line', color: 'yellow' },
    { value: 'Afternoon', label: 'Afternoon (14:00–22:00)', icon: 'ri-sun-foggy-line', color: 'orange' },
    { value: 'Night', label: 'Night (22:00–06:00)', icon: 'ri-moon-line', color: 'blue' }
  ];

  readonly statuses = [
    { value: 'Upcoming', label: 'Upcoming', color: 'blue' },
    { value: 'Active', label: 'Active', color: 'green' },
    { value: 'Completed', label: 'Completed', color: 'gray' },
    { value: 'Cancelled', label: 'Cancelled', color: 'red' }
  ];

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

  openCreateModal() {
    this.createStep = 0;
    this.step1Error = '';
    this.newShift = {
      shiftName: '',
      site: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'Morning',
      supervisor: '',
      guardsAssigned: 2,
      status: 'Upcoming',
      notes: ''
    };
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  nextCreateStep() {
    if (!this.newShift.shiftName.trim()) {
      this.step1Error = 'Shift name is required.';
      return;
    }
    if (!this.newShift.site) {
      this.step1Error = 'Please select a site.';
      return;
    }
    if (!this.newShift.date) {
      this.step1Error = 'Please select a date.';
      return;
    }
    this.step1Error = '';
    this.createStep = 1;
  }

  prevCreateStep() {
    this.createStep = 0;
  }

  submitShift() {
    this.creating = true;
    setTimeout(() => {
      const typeMap: Record<string, string> = { 
        Morning: '06:00–14:00', 
        Afternoon: '14:00–22:00', 
        Night: '22:00–06:00' 
      };
      const times = this.newShift.startTime && this.newShift.endTime 
        ? [this.newShift.startTime, this.newShift.endTime]
        : typeMap[this.newShift.type].split('–');
      
      this.shifts.unshift({
        id: Date.now(),
        shiftCode: `SH-${String(this.shifts.length + 1).padStart(3, '0')}`,
        shiftName: this.newShift.shiftName || `${this.newShift.type} Shift`,
        site: this.newShift.site,
        date: this.newShift.date,
        startTime: times[0],
        endTime: times[1],
        supervisor: this.newShift.supervisor || 'TBD',
        guardsAssigned: this.newShift.guardsAssigned,
        guardsPresent: 0,
        type: this.newShift.type,
        status: this.newShift.status
      });
      this.applyFilter();
      this.showCreateModal = false;
      this.creating = false;
    }, 600);
  }

  cancelShift(shift: Shift) {
    const ref = this.alertDialog.open({
      title: 'Cancel Shift?',
      description: `Cancel shift "${shift.shiftCode}"? Assigned guards will be notified.`,
      actionText: 'Cancel Shift',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      shift.status = 'Cancelled';
      this.applyFilter();
      this.toast.show({ title: 'Shift Cancelled', description: 'Shift has been cancelled.', variant: 'destructive' });
    });
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
