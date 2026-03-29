import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../core/services/permissions.service';
import { ShiftActions } from '../shift-management/stores/shift.actions';
import { selectShifts, selectShiftLoading, selectActiveShifts } from '../shift-management/stores/shift.selectors';
import { ShiftDto, ManualCheckInDto, ManualCheckOutDto } from '../shift-management/models/shift.model';

interface AttendanceRecord {
  shiftId: string;
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
  private store = inject(Store);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private permissions = inject(PermissionsService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('recordModal') recordModal!: TemplateRef<any>;

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

  shifts: ShiftDto[] = [];
  records: AttendanceRecord[] = [];
  filteredRecords: AttendanceRecord[] = [];
  showFilterPanel = false;
  filterStatus: 'All' | 'Present' | 'Left' | 'Late' | 'Absent' = 'All';
  loading = false;

  // Check-in modal state
  showCheckInModal = false;
  checkInShiftId = '';
  checkInTime = '';
  checkInError = '';
  checkingIn = false;

  // Check-out modal state
  showCheckOutModal = false;
  checkOutShiftId = '';
  checkOutTime = '';
  checkOutError = '';
  checkingOut = false;

  get presentCount() { return this.records.filter(r => r.status === 'Present' || r.status === 'Late').length; }
  get leftCount()    { return this.records.filter(r => r.status === 'Left').length; }
  get lateCount()    { return this.records.filter(r => r.status === 'Late').length; }
  get absentCount()  { return this.records.filter(r => r.status === 'Absent').length; }
  get activeFilterCount(): number { return this.filterStatus !== 'All' ? 1 : 0; }

  get absentRecords() { return this.records.filter(r => r.status === 'Absent'); }
  get onSiteRecords() { return this.records.filter(r => r.status === 'Present' || r.status === 'Late'); }

  ngOnInit() {
    this.store.dispatch(ShiftActions.loadShifts({ params: { status: 'Active', pageNumber: 1, pageSize: 100 } }));
    
    this.store.select(selectShifts)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(shifts => {
        this.shifts = shifts;
        this.mapShiftsToRecords();
        this.applyFilter();
      });

    this.store.select(selectShiftLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);
  }

  private mapShiftsToRecords() {
    this.records = this.shifts.map(shift => {
      const attendance = shift.attendance;
      const checkIn = attendance?.checkInTime ? new Date(attendance.checkInTime).toTimeString().slice(0, 5) : null;
      const checkOut = attendance?.checkOutTime ? new Date(attendance.checkOutTime).toTimeString().slice(0, 5) : null;
      
      let status: 'Present' | 'Left' | 'Late' | 'Absent' = 'Absent';
      if (checkIn && checkOut) {
        status = 'Left';
      } else if (checkIn) {
        const [h, m] = checkIn.split(':').map(Number);
        const shiftStartHour = new Date(shift.startTime).getHours();
        const shiftStartMin = new Date(shift.startTime).getMinutes();
        status = (h > shiftStartHour || (h === shiftStartHour && m > shiftStartMin + 30)) ? 'Late' : 'Present';
      }

      let hoursWorked: string | null = null;
      if (checkIn && checkOut) {
        hoursWorked = this.calcHoursWorked(checkIn, checkOut);
      }

      return {
        shiftId: shift.id,
        staffId: shift.guardId,
        name: shift.guardName,
        role: 'Guard',
        site: shift.siteName,
        checkIn,
        checkOut,
        status,
        hoursWorked
      };
    });
  }

  private calcHoursWorked(checkIn: string, checkOut: string): string {
    const [h1, m1] = checkIn.split(':').map(Number);
    const [h2, m2] = checkOut.split(':').map(Number);
    let mins = (h2 * 60 + m2) - (h1 * 60 + m1);
    if (mins < 0) mins += 24 * 60;
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m`;
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

  openCheckInModal() {
    this.checkInShiftId = this.absentRecords[0]?.shiftId ?? '';
    this.checkInTime = this.getCurrentTime();
    this.checkInError = '';
    this.showCheckInModal = true;
  }

  closeCheckInModal() { this.showCheckInModal = false; }

  submitCheckIn() {
    if (!this.checkInShiftId) { this.checkInError = 'Please select a staff member.'; return; }
    if (!this.checkInTime)     { this.checkInError = 'Please enter a check-in time.'; return; }
    
    this.checkingIn = true;
    const shift = this.shifts.find(s => s.id === this.checkInShiftId);
    if (!shift) {
      this.checkInError = 'Shift not found.';
      this.checkingIn = false;
      return;
    }

    const dto: ManualCheckInDto = {
      guardId: shift.guardId,
      checkInTime: new Date(`2000-01-01T${this.checkInTime}`).toISOString(),
      notes: ''
    };

    this.store.dispatch(ShiftActions.manualCheckIn({ id: this.checkInShiftId, dto }));
    this.showCheckInModal = false;
    this.checkingIn = false;
  }

  openCheckOutModal() {
    this.checkOutShiftId = this.onSiteRecords[0]?.shiftId ?? '';
    this.checkOutTime = this.getCurrentTime();
    this.checkOutError = '';
    this.showCheckOutModal = true;
  }

  closeCheckOutModal() { this.showCheckOutModal = false; }

  submitCheckOut() {
    if (!this.checkOutShiftId) { this.checkOutError = 'Please select a staff member.'; return; }
    if (!this.checkOutTime)     { this.checkOutError = 'Please enter a check-out time.'; return; }
    
    this.checkingOut = true;
    const shift = this.shifts.find(s => s.id === this.checkOutShiftId);
    if (!shift) {
      this.checkOutError = 'Shift not found.';
      this.checkingOut = false;
      return;
    }

    const dto: ManualCheckOutDto = {
      guardId: shift.guardId,
      checkOutTime: new Date(`2000-01-01T${this.checkOutTime}`).toISOString(),
      notes: ''
    };

    this.store.dispatch(ShiftActions.manualCheckOut({ id: this.checkOutShiftId, dto }));
    this.showCheckOutModal = false;
    this.checkingOut = false;
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
      // In real implementation, this would call an API to remove attendance
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
