import { Component, OnInit, inject, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
  ButtonComponent, BadgeComponent, SelectComponent, SelectItemComponent, DatePickerComponent, TextareaComponent,
  LabelComponent, ModalService, DataTableComponent, TolleCellDirective, TableColumn,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { InputComponent } from '@tolle_/tolle-ui';
import { LeaveService } from '../../services/leave.service';
import { LeaveRequestDto, CreateLeaveRequestDto, LeaveStatus, LeaveType, LeaveBalanceDto, InitializeLeaveBalanceDto, LeaveBalanceEntryDto } from '../../models/leave.model';
import { LeaveActions } from '../../stores/leave.actions';
import { selectLeaves, selectLeaveLoading, selectLeaveError, selectBalances } from '../../stores/leave.selectors';


@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    SelectComponent, SelectItemComponent, DatePickerComponent,
    TextareaComponent, LabelComponent,
    DataTableComponent, TolleCellDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    InputComponent, DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  ],
  templateUrl: './leave-management.component.html'
})
export class LeaveManagementComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private leaveService = inject(LeaveService);
  public modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('requestModal') requestModal!: TemplateRef<any>;
  @ViewChild('requestLeaveModal') requestLeaveModal!: TemplateRef<any>;
  @ViewChild('balanceModal') balanceModal!: TemplateRef<any>;
  @ViewChild('initializeBalanceModal') initializeBalanceModal!: TemplateRef<any>;

  private subscriptions = new Subscription();

  columns: TableColumn[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'type', label: 'Leave Type' },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status' },
    { key: 'manager', label: 'Manager' },
    { key: 'actions', label: 'Actions' },
  ];

  leaves$ = this.store.select(selectLeaves);
  loading$ = this.store.select(selectLeaveLoading);
  error$ = this.store.select(selectLeaveError);
  balances$ = this.store.select(selectBalances);
  
  leaves: LeaveRequestDto[] = [];
  filteredRequests: LeaveRequestDto[] = [];
  balances: LeaveBalanceDto[] = [];
  loading = false;
  error: string | null = null;
  showFilterPanel = false;
  filterStatus: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'All';
  private modalRef: any;

  // Balance management properties
  selectedUserIdForBalance = '';
  balanceYear = new Date().getFullYear();
  initializeBalanceForm: InitializeLeaveBalanceDto = {
    year: new Date().getFullYear(),
    balances: []
  };

  submitting = false;
  newRequest = {
    leaveType: 'Annual' as LeaveType,
    startDate: '',
    endDate: '',
    reason: ''
  };

  ngOnInit() {
    this.store.dispatch(LeaveActions.loadLeaves({}));
    
    this.subscriptions.add(
      this.leaves$.subscribe(leaves => {
        this.leaves = leaves;
        this.applyFilter();
      })
    );
    
    this.subscriptions.add(
      this.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );
    
    this.subscriptions.add(
      this.error$.subscribe(error => {
        this.error = error;
        if (error) {
          this.toast.show({
            title: 'Error',
            description: error,
            variant: 'destructive'
          });
        }
      })
    );

    this.subscriptions.add(
      this.balances$.subscribe(balances => {
        this.balances = balances;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  applyFilter() {
    this.filteredRequests = this.filterStatus === 'All'
      ? [...this.leaves]
      : this.leaves.filter(r => r.status === this.filterStatus);
  }

  get activeFilterCount(): number { return this.filterStatus !== 'All' ? 1 : 0; }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.applyFilter();
  }

  deleteLeave(leave: LeaveRequestDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Leave Request?',
      description: `Delete the leave request for "${leave.guardName}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      // TODO: Implement delete functionality in service and store
      this.toast.show({ title: 'Leave Deleted', description: 'The leave request has been deleted.', variant: 'destructive' });
    });
  }

  viewRequest(request: LeaveRequestDto) {
    this.modalService.open({
      title: `Leave Request – ${request.guardName}`,
      backdropClose: true, size: 'lg', showCloseButton: true,
      content: this.requestModal, context: { request }
    });
  }

  calculateRequestDays(request: LeaveRequestDto): number {
    if (!request.startDate || !request.endDate) return 0;
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  calculateDays(): number {
    if (!this.newRequest.startDate || !this.newRequest.endDate) return 0;
    const start = new Date(this.newRequest.startDate);
    const end = new Date(this.newRequest.endDate);
    return Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  openRequestLeaveModal() {
    this.newRequest = {
      leaveType: 'Annual' as LeaveType,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reason: ''
    };
    this.modalRef = this.modalService.open({
      title: 'Request Leave', backdropClose: true, size: 'lg', showCloseButton: true,
      content: this.requestLeaveModal
    });
  }

  submitRequest() {
    this.submitting = true;
    
    const createDto: CreateLeaveRequestDto = {
      leaveType: this.newRequest.leaveType,
      startDate: this.newRequest.startDate,
      endDate: this.newRequest.endDate,
      reason: this.newRequest.reason
    };
    
    this.store.dispatch(LeaveActions.submitLeave({ dto: createDto }));
    
    // Subscribe to the result
    this.subscriptions.add(
      this.leaves$.subscribe(() => {
        this.submitting = false;
        if (this.modalRef) this.modalRef.close();
        this.toast.show({ 
          title: 'Leave Request Submitted', 
          description: 'Your leave request has been submitted successfully and is pending approval.', 
          variant: 'success' 
        });
      })
    );
  }

  // Balance management methods
  openBalanceModal(userId: string): void {
    this.selectedUserIdForBalance = userId;
    this.store.dispatch(LeaveActions.loadLeaveBalances({ userId, year: this.balanceYear }));
    this.modalRef = this.modalService.open({
      title: 'Leave Balance',
      content: this.balanceModal,
      size: 'default'
    });
  }

  openInitializeBalanceModal(userId: string): void {
    this.selectedUserIdForBalance = userId;
    this.initializeBalanceForm = {
      year: new Date().getFullYear(),
      balances: [
        { leaveType: 'Annual', year: new Date().getFullYear(), totalDays: 21, usedDays: 0 },
        { leaveType: 'Sick', year: new Date().getFullYear(), totalDays: 10, usedDays: 0 },
        { leaveType: 'Emergency', year: new Date().getFullYear(), totalDays: 3, usedDays: 0 },
        { leaveType: 'Maternity', year: new Date().getFullYear(), totalDays: 90, usedDays: 0 },
        { leaveType: 'Paternity', year: new Date().getFullYear(), totalDays: 14, usedDays: 0 },
        { leaveType: 'Unpaid', year: new Date().getFullYear(), totalDays: 365, usedDays: 0 }
      ]
    };
    this.modalRef = this.modalService.open({
      title: 'Initialize Leave Balance',
      content: this.initializeBalanceModal,
      size: 'default'
    });
  }

  autoInitializeBalance(userId: string): void {
    this.store.dispatch(LeaveActions.autoInitializeLeaveBalance({ userId }));
  }

  submitInitializeBalance(): void {
    if (!this.selectedUserIdForBalance) return;
    
    this.store.dispatch(LeaveActions.initializeLeaveBalance({ 
      userId: this.selectedUserIdForBalance, 
      dto: this.initializeBalanceForm 
    }));
    
    if (this.modalRef) this.modalRef.close();
  }

  updateBalanceYear(): void {
    if (this.selectedUserIdForBalance) {
      this.store.dispatch(LeaveActions.loadLeaveBalances({ 
        userId: this.selectedUserIdForBalance, 
        year: this.balanceYear 
      }));
    }
  }
}
