import { Component, OnInit, inject, DestroyRef, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { PayrollActions } from '../stores/payroll.actions';
import { selectPayrollRecords, selectPayrollLoading, selectPayrollSaving } from '../stores/payroll.selectors';
import { PayrollRecordDto } from '../models/payroll.model';

@Component({
  selector: 'app-payroll-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './payroll-management.component.html',
  styleUrl: './payroll-management.component.css'
})
export class PayrollManagementComponent implements OnInit {
  private store = inject(Store);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('payrollModal') payrollModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'staff',      label: 'Staff Member'  },
    { key: 'department', label: 'Department'     },
    { key: 'period',     label: 'Pay Period'     },
    { key: 'baseSalary', label: 'Base (₵)'       },
    { key: 'allowances', label: 'Allowances (₵)' },
    { key: 'deductions', label: 'Deductions (₵)' },
    { key: 'netPay',     label: 'Net Pay (₵)'    },
    { key: 'status',     label: 'Status'         },
    { key: 'actions',    label: ''               },
  ];

  payrollRecords: PayrollRecordDto[] = [];
  filteredRecords: PayrollRecordDto[] = [];
  get filteredPayroll() { return this.filteredRecords; }
  loading = false;
  saving = false;
  showCreateModal = false;
  showFilterPanel = false;
  filterDepartment = 'All';
  filterStatus = 'All';
  filterPayPeriod = 'All';
  searchQuery = '';
  searchTerm = '';

  readonly payPeriods: string[] = [];
  readonly statuses = ['Pending', 'Processed', 'Paid'];
  readonly departments = ['Operations', 'HR', 'Finance', 'Admin', 'Security'];

  get totalPayroll() { return this.payrollRecords.reduce((sum, p) => sum + p.netPay, 0); }
  get pendingCount() { return this.payrollRecords.filter(p => p.statusName === 'Pending').length; }
  get processedCount() { return this.payrollRecords.filter(p => p.statusName === 'Processed').length; }
  get paidCount() { return this.payrollRecords.filter(p => p.statusName === 'Paid').length; }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filterDepartment !== 'All') count++;
    if (this.filterStatus !== 'All') count++;
    if (this.filterPayPeriod !== 'All') count++;
    return count;
  }

  ngOnInit() {
    this.store.dispatch(PayrollActions.loadPayrollRecords({ params: { pageNumber: 1, pageSize: 100 } }));
    
    this.store.select(selectPayrollRecords)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(records => {
        this.payrollRecords = records;
        this.applyFilter();
      });

    this.store.select(selectPayrollLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectPayrollSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => this.saving = saving);
  }

  applyFilter() { this.applyFilters(); }

  applyFilters() {
    let result = [...this.payrollRecords];
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      result = result.filter(p => p.employeeName.toLowerCase().includes(q) || p.employeeStaffId.toLowerCase().includes(q));
    }
    if (this.filterStatus !== 'All') result = result.filter(p => p.statusName === this.filterStatus);
    if (this.filterPayPeriod !== 'All') result = result.filter(p => p.periodLabel === this.filterPayPeriod);
    this.filteredRecords = result;
  }

  clearFilters() {
    this.filterDepartment = 'All';
    this.filterStatus = 'All';
    this.filterPayPeriod = 'All';
    this.searchTerm = '';
    this.applyFilters();
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  deletePayroll(payroll: PayrollRecordDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Payroll Record?',
      description: `Delete payroll for "${payroll.employeeName}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(PayrollActions.deletePayrollRecord({ id: payroll.id }));
      }
    });
  }

  processPayroll(payroll: PayrollRecordDto) {
    const ref = this.alertDialog.open({
      title: 'Process Payroll?',
      description: `Process payroll for "${payroll.employeeName}"?`,
      actionText: 'Process',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(PayrollActions.processPayroll({ id: payroll.id }));
      }
    });
  }

  payPayroll(payroll: PayrollRecordDto) {
    const ref = this.alertDialog.open({
      title: 'Record Payment?',
      description: `Record payment for "${payroll.employeeName}"?`,
      actionText: 'Pay',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(PayrollActions.payPayroll({ id: payroll.id }));
      }
    });
  }

  getDeptBg(dept: string): string {
    const map: Record<string, string> = {
      'Operations': 'rgba(33, 150, 243, 0.15)',
      'HR': 'rgba(139, 92, 246, 0.15)',
      'Finance': 'rgba(34, 197, 94, 0.15)',
      'Admin': 'rgba(234, 179, 8, 0.15)',
      'Security': 'rgba(244, 67, 54, 0.15)',
    };
    return map[dept] ?? 'rgba(120,120,120,0.15)';
  }

  getDeptFg(dept: string): string {
    const map: Record<string, string> = {
      'Operations': '#2196F3',
      'HR': '#7C3AED',
      'Finance': '#16a34a',
      'Admin': '#ca8a04',
      'Security': '#dc2626',
    };
    return map[dept] ?? '#555';
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Pending': 'rgba(234, 179, 8, 0.15)',
      'Processed': 'rgba(33, 150, 243, 0.15)',
      'Paid': 'rgba(34, 197, 94, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Pending': '#ca8a04',
      'Processed': '#2563eb',
      'Paid': '#16a34a'
    };
    return map[status] ?? '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  getInitials(name: string): string {
    return (name ?? '').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  viewPayroll(payroll: PayrollRecordDto) {
    this.modalService.open({
      title: `Payroll — ${payroll.employeeName}`,
      content: this.payrollModal,
      context: {
        payroll: {
          ...payroll,
          staffName: payroll.employeeName,
          staffId: payroll.employeeStaffId,
          position: '',
        }
      },
      size: 'default',
      showCloseButton: true,
    });
  }
}
