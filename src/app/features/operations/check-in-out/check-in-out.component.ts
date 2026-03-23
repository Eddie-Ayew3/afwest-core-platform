import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../core/services/permissions.service';

interface AttendanceRecord {
  id: number;
  staffId: string;
  name: string;
  role: string;
  site: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Left' | 'Late' | 'Absent';
  hoursWorked: string | null;
}

@Component({
  selector: 'app-check-in-out',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './check-in-out.component.html',
  styleUrl: './check-in-out.component.css'
})
export class CheckInOutComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('recordModal') recordModal!: TemplateRef<any>;
  private permissions = inject(PermissionsService);

  columns: TableColumn[] = [
    { key: 'staff', label: 'Staff' },
    { key: 'staffId', label: 'Staff ID' },
    { key: 'site', label: 'Site' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    { key: 'hoursWorked', label: 'Hours' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  records: AttendanceRecord[] = [
    { id: 1,  staffId: 'GD-001', name: 'Kwame Mensah',    role: 'Senior Guard', site: 'Head Office – Accra', checkIn: '06:02', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 2,  staffId: 'GD-002', name: 'Ama Boateng',     role: 'Guard',        site: 'Kumasi Branch',       checkIn: '05:58', checkOut: '14:00', status: 'Left',    hoursWorked: '8h 02m' },
    { id: 3,  staffId: 'GD-003', name: 'Kofi Asante',     role: 'Supervisor',   site: 'Head Office – Accra', checkIn: '06:41', checkOut: null,    status: 'Late',    hoursWorked: null },
    { id: 4,  staffId: 'GD-004', name: 'Abena Osei',      role: 'Guard',        site: 'Takoradi Branch',     checkIn: null,    checkOut: null,    status: 'Absent',  hoursWorked: null },
    { id: 5,  staffId: 'GD-005', name: 'Yaw Darko',       role: 'Guard',        site: 'Cape Coast Post',     checkIn: '05:55', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 6,  staffId: 'GD-006', name: 'Akosua Frimpong', role: 'Senior Guard', site: 'Kumasi Branch',       checkIn: '06:00', checkOut: '14:05', status: 'Left',    hoursWorked: '8h 05m' },
    { id: 7,  staffId: 'GD-007', name: 'Nana Acheampong', role: 'Guard',        site: 'Head Office – Accra', checkIn: '06:05', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 8,  staffId: 'GD-008', name: 'Efua Asante',     role: 'Guard',        site: 'Tema Industrial',     checkIn: null,    checkOut: null,    status: 'Absent',  hoursWorked: null },
    { id: 9,  staffId: 'GD-009', name: 'Kweku Baffoe',    role: 'Supervisor',   site: 'Takoradi Branch',     checkIn: '06:03', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 10, staffId: 'GD-010', name: 'Adwoa Kyei',      role: 'Guard',        site: 'Head Office – Accra', checkIn: '06:52', checkOut: null,    status: 'Late',    hoursWorked: null },
    { id: 11, staffId: 'GD-011', name: 'Kojo Agyemang',   role: 'Guard',        site: 'Tema Industrial',     checkIn: '06:01', checkOut: '14:00', status: 'Left',    hoursWorked: '7h 59m' },
    { id: 12, staffId: 'GD-012', name: 'Akua Tetteh',     role: 'Senior Guard', site: 'Cape Coast Post',     checkIn: '05:59', checkOut: null,    status: 'Present', hoursWorked: null },
  ];

  filteredRecords: AttendanceRecord[] = [];
  showFilterPanel = false;
  filterStatus: 'All' | 'Present' | 'Left' | 'Late' | 'Absent' = 'All';

  // Check-in modal state
  showCheckInModal = false;
  checkInRecordId = 0;
  checkInTime = '';
  checkInError = '';
  checkingIn = false;

  // Check-out modal state
  showCheckOutModal = false;
  checkOutRecordId = 0;
  checkOutTime = '';
  checkOutError = '';
  checkingOut = false;

  get presentCount() { return this.records.filter(r => r.status === 'Present').length; }
  get leftCount()    { return this.records.filter(r => r.status === 'Left').length; }
  get lateCount()    { return this.records.filter(r => r.status === 'Late').length; }
  get absentCount()  { return this.records.filter(r => r.status === 'Absent').length; }
  get activeFilterCount(): number { return this.filterStatus !== 'All' ? 1 : 0; }

  get absentRecords() { return this.records.filter(r => r.status === 'Absent'); }
  get onSiteRecords() { return this.records.filter(r => r.status === 'Present' || r.status === 'Late'); }

  ngOnInit() {
    this.records = this.permissions.filterBySite(this.records);
    this.applyFilter();
  }

  applyFilter() {
    this.filteredRecords = this.filterStatus === 'All'
      ? [...this.records]
      : this.records.filter(r => r.status === this.filterStatus);
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.applyFilter();
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }

  private calcHoursWorked(checkIn: string, checkOut: string): string {
    const [h1, m1] = checkIn.split(':').map(Number);
    const [h2, m2] = checkOut.split(':').map(Number);
    let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (mins < 0) mins += 24 * 60;
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
  }

  openCheckInModal() {
    this.checkInRecordId = this.absentRecords[0]?.id ?? 0;
    this.checkInTime = this.getCurrentTime();
    this.checkInError = '';
    this.showCheckInModal = true;
  }

  closeCheckInModal() { this.showCheckInModal = false; }

  submitCheckIn() {
    if (!this.checkInRecordId) { this.checkInError = 'Please select a staff member.'; return; }
    if (!this.checkInTime)     { this.checkInError = 'Please enter a check-in time.'; return; }
    this.checkingIn = true;
    setTimeout(() => {
      const record = this.records.find(r => r.id === this.checkInRecordId)!;
      record.checkIn = this.checkInTime;
      const [h, m] = this.checkInTime.split(':').map(Number);
      record.status = (h > 6 || (h === 6 && m > 30)) ? 'Late' : 'Present';
      this.applyFilter();
      this.showCheckInModal = false;
      this.checkingIn = false;
      this.toast.show({ title: 'Checked In', description: `${record.name} checked in at ${this.checkInTime}.`, variant: 'success' });
    }, 500);
  }

  openCheckOutModal() {
    this.checkOutRecordId = this.onSiteRecords[0]?.id ?? 0;
    this.checkOutTime = this.getCurrentTime();
    this.checkOutError = '';
    this.showCheckOutModal = true;
  }

  closeCheckOutModal() { this.showCheckOutModal = false; }

  submitCheckOut() {
    if (!this.checkOutRecordId) { this.checkOutError = 'Please select a staff member.'; return; }
    if (!this.checkOutTime)     { this.checkOutError = 'Please enter a check-out time.'; return; }
    this.checkingOut = true;
    setTimeout(() => {
      const record = this.records.find(r => r.id === this.checkOutRecordId)!;
      record.checkOut = this.checkOutTime;
      record.status = 'Left';
      if (record.checkIn) record.hoursWorked = this.calcHoursWorked(record.checkIn, this.checkOutTime);
      this.applyFilter();
      this.showCheckOutModal = false;
      this.checkingOut = false;
      this.toast.show({ title: 'Checked Out', description: `${record.name} checked out at ${this.checkOutTime}.`, variant: 'success' });
    }, 500);
  }

  removeRecord(record: AttendanceRecord) {
    const ref = this.alertDialog.open({
      title: 'Remove Record?',
      description: `Remove the attendance record for "${record.name}"?`,
      actionText: 'Remove',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.records = this.records.filter(r => r.id !== record.id);
      this.applyFilter();
      this.toast.show({ title: 'Record Removed', description: 'The attendance record has been removed.', variant: 'destructive' });
    });
  }

  viewRecord(record: AttendanceRecord) {
    this.modalService.open({
      title: `Attendance – ${record.name}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.recordModal,
      context: { record }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Present': 'rgba(76, 175, 80, 0.15)',
      'Left':    'rgba(33, 150, 243, 0.15)',
      'Late':    'rgba(255, 152, 0, 0.15)',
      'Absent':  'rgba(244, 67, 54, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Present': '#4CAF50',
      'Left':    '#2196F3',
      'Late':    '#FF9800',
      'Absent':  '#F44336'
    };
    return map[status] ?? '';
  }
}
