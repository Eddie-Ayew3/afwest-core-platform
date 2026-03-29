import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  SheetComponent, SheetContentComponent, LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../core/services/permissions.service';
import { ShiftActions } from '../stores/shift.actions';
import { selectShifts, selectShiftLoading, selectShiftSaving, selectShiftsByStatus } from '../stores/shift.selectors';
import { ShiftDto, CreateShiftDto } from '../models/shift.model';

interface ShiftFormModel {
  shiftName: string;
  site: string;
  type: string;
  date: string;
  startTime: string;
  endTime: string;
  supervisor: string;
  guardsAssigned: number;
  status: string;
  guardId: string;
  notes: string;
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
  private store = inject(Store);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private permissions = inject(PermissionsService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('shiftModal') shiftModal!: TemplateRef<any>;
  @ViewChild('createShiftModal') createShiftModal!: TemplateRef<any>;

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

  shifts: ShiftDto[] = [];
  filteredShifts: ShiftDto[] = [];
  showFilterPanel = false;
  filterStatus: 'All' | 'Scheduled' | 'Active' | 'Completed' | 'Cancelled' | 'Missed' = 'All';
  filterType: 'All' | 'Morning' | 'Afternoon' | 'Night' = 'All';
  loading = false;
  saving = false;

  // Modal state
  showCreateModal = false;
  createStep = 0;
  step1Error = '';
  creating = false;

  newShift: ShiftFormModel = {
    shiftName: '', site: '', type: 'Morning', date: '',
    startTime: '', endTime: '',
    supervisor: '', guardsAssigned: 1, status: 'Scheduled',
    guardId: '', notes: ''
  };

  guards: { id: string; name: string }[] = [];
  sites: { id: string; name: string }[] = [];
  supervisors: string[] = [];

  readonly shiftTypes = [
    { value: 'Morning', label: 'Morning', icon: 'ri-sun-line' },
    { value: 'Afternoon', label: 'Afternoon', icon: 'ri-sun-foggy-line' },
    { value: 'Night', label: 'Night', icon: 'ri-moon-line' },
  ];

  readonly statuses = [
    { value: 'Scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'Active', label: 'Active', color: 'green' },
    { value: 'Completed', label: 'Completed', color: 'gray' },
    { value: 'Cancelled', label: 'Cancelled', color: 'red' },
    { value: 'Missed', label: 'Missed', color: 'red' }
  ];

  get scheduledCount() { return this.shifts.filter(s => s.status === 'Scheduled').length; }
  get upcomingCount() { return this.scheduledCount; }
  get onDutyCount() { return this.activeCount; }
  get activeCount() { return this.shifts.filter(s => s.status === 'Active').length; }
  get completedCount() { return this.shifts.filter(s => s.status === 'Completed').length; }

  get activeFilterCount(): number {
    return this.filterStatus !== 'All' ? 1 : 0;
  }

  ngOnInit() {
    this.store.dispatch(ShiftActions.loadShifts({ params: { pageNumber: 1, pageSize: 100 } }));
    
    this.store.select(selectShifts)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(shifts => {
        this.shifts = shifts;
        this.applyFilter();
      });

    this.store.select(selectShiftLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectShiftSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => this.saving = saving);

    this.loadGuardsAndSites();
  }

  private loadGuardsAndSites() {
    // Load guards from localStorage or API
    const storedGuards = localStorage.getItem('guards');
    if (storedGuards) {
      this.guards = JSON.parse(storedGuards);
    }

    // Load sites from localStorage or API
    const storedSites = localStorage.getItem('sites');
    if (storedSites) {
      this.sites = JSON.parse(storedSites);
    }
  }

  applyFilter() {
    let result = [...this.shifts];
    if (this.filterStatus !== 'All') {
      result = result.filter(s => s.status === this.filterStatus);
    }
    this.filteredShifts = result;
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.applyFilter();
  }

  openCreateModal() {
    this.createStep = 0;
    this.step1Error = '';
    this.newShift = {
      shiftName: '', site: '', type: 'Morning', date: '',
      startTime: '', endTime: '',
      supervisor: '', guardsAssigned: 1, status: 'Scheduled',
      guardId: '', notes: ''
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
    if (!this.newShift.startTime || !this.newShift.endTime) {
      this.step1Error = 'Please select start and end times.';
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
    const dto: CreateShiftDto = {
      name: this.newShift.shiftName,
      guardId: this.newShift.guardId,
      siteId: this.newShift.site,
      startTime: this.newShift.date ? `${this.newShift.date}T${this.newShift.startTime}` : this.newShift.startTime,
      endTime: this.newShift.date ? `${this.newShift.date}T${this.newShift.endTime}` : this.newShift.endTime,
      notes: this.newShift.notes
    };
    this.store.dispatch(ShiftActions.createShift({ dto }));
    this.showCreateModal = false;
    this.creating = false;
  }

  deleteShift(shift: ShiftDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Shift?',
      description: `Delete shift "${shift.name}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(ShiftActions.deleteShift({ id: shift.id }));
      }
    });
  }

  startShift(shift: ShiftDto) {
    const ref = this.alertDialog.open({
      title: 'Start Shift?',
      description: `Start shift "${shift.name}"?`,
      actionText: 'Start',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(ShiftActions.startShift({ id: shift.id }));
      }
    });
  }

  completeShift(shift: ShiftDto) {
    const ref = this.alertDialog.open({
      title: 'Complete Shift?',
      description: `Complete shift "${shift.name}"?`,
      actionText: 'Complete',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(ShiftActions.completeShift({ id: shift.id }));
      }
    });
  }

  cancelShift(shift: ShiftDto) {
    const ref = this.alertDialog.open({
      title: 'Cancel Shift?',
      description: `Cancel shift "${shift.name}"? Assigned guards will be notified.`,
      actionText: 'Cancel Shift',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(ShiftActions.cancelShift({ id: shift.id, reason: 'User cancelled' }));
      }
    });
  }

  markMissed(shift: ShiftDto) {
    const ref = this.alertDialog.open({
      title: 'Mark as Missed?',
      description: `Mark shift "${shift.name}" as missed?`,
      actionText: 'Mark Missed',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(ShiftActions.markMissed({ id: shift.id, reason: 'No show' }));
      }
    });
  }

  viewShift(shift: ShiftDto) {
    this.modalService.open({
      title: `Shift Details – ${shift.name}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.shiftModal,
      context: { shift }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': 'rgba(33, 150, 243, 0.15)',
      'Active': 'rgba(76, 175, 80, 0.15)',
      'Completed': 'rgba(120, 120, 120, 0.15)',
      'Cancelled': 'rgba(244, 67, 54, 0.15)',
      'Missed': 'rgba(244, 67, 54, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Scheduled': '#2196F3',
      'Active': '#4CAF50',
      'Completed': '#757575',
      'Cancelled': '#F44336',
      'Missed': '#F44336'
    };
    return map[status] ?? '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  formatTime(timeStr: string): string {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  getShiftType(startTime: string): string {
    const hour = new Date(`2000-01-01T${startTime}`).getHours();
    if (hour >= 6 && hour < 14) return 'Morning';
    if (hour >= 14 && hour < 22) return 'Afternoon';
    return 'Night';
  }

  getTypeBg(type: string): string {
    const map: Record<string, string> = {
      'Morning': 'rgba(255, 193, 7, 0.15)',
      'Afternoon': 'rgba(255, 152, 0, 0.15)',
      'Night': 'rgba(63, 81, 181, 0.15)'
    };
    return map[type] ?? '';
  }

  getTypeFg(type: string): string {
    const map: Record<string, string> = {
      'Morning': '#F59E0B',
      'Afternoon': '#FF9800',
      'Night': '#3F51B5'
    };
    return map[type] ?? '';
  }

  getTypeIcon(type: string): string {
    const map: Record<string, string> = {
      'Morning': 'ri-sun-line',
      'Afternoon': 'ri-sun-foggy-line',
      'Night': 'ri-moon-line'
    };
    return map[type] ?? 'ri-time-line';
  }
}
