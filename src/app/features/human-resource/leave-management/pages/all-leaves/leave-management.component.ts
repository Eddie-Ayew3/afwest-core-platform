import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, SelectComponent, SelectItemComponent, DatePickerComponent, TextareaComponent,
  LabelComponent, ModalService, DataTableComponent, TolleCellDirective, TableColumn,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { InputComponent } from '@tolle_/tolle-ui';

interface LeaveRequest {
  id: number;
  employee: string;
  department: string;
  type: string;
  start: Date;
  end: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
  manager: string;
  reason: string;
  suggestedOfficer: string;
  leaveContactAddress: { address: string; phone: string; email: string; };
  leaveEntitlement: {
    currentLeaveDays: number; accruedLeaveDays: number; leaveTaken: number;
    leaveBalance: number; outstandingLeave: number; leaveGranted: number;
    commencementDate: Date; resumptionDate: Date;
  };
  approvals: {
    supervisor: { name: string; date?: Date; signature?: string; approved: boolean; };
    operationalManager: { name: string; date?: Date; signature?: string; approved: boolean; };
    humanResourceOfficer: { name: string; remarks?: string; date?: Date; signature?: string; approved: boolean; };
  };
}

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
export class LeaveManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('requestModal') requestModal!: TemplateRef<any>;
  @ViewChild('requestLeaveModal') requestLeaveModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'type', label: 'Leave Type' },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status' },
    { key: 'manager', label: 'Manager' },
    { key: 'actions', label: '' },
  ];

  requests: LeaveRequest[] = [
    {
      id: 1, employee: 'Ama Boateng', department: 'Operations', type: 'Vacation',
      start: new Date('2024-12-10'), end: new Date('2024-12-15'), status: 'Approved',
      manager: 'Kwame Mensah', reason: 'Family vacation', suggestedOfficer: 'Kofi Asante',
      leaveContactAddress: { address: '14 Ring Road, Accra, Ghana', phone: '+233-24-123-4567', email: 'ama.b@afwest.com.gh' },
      leaveEntitlement: { currentLeaveDays: 21, accruedLeaveDays: 5, leaveTaken: 10, leaveBalance: 16, outstandingLeave: 0, leaveGranted: 5, commencementDate: new Date('2024-12-10'), resumptionDate: new Date('2024-12-16') },
      approvals: {
        supervisor: { name: 'Kwame Mensah', date: new Date('2024-12-05'), signature: 'KM', approved: true },
        operationalManager: { name: 'Yaw Acheampong', date: new Date('2024-12-06'), signature: 'YA', approved: true },
        humanResourceOfficer: { name: 'HR Team', remarks: 'Approved as per company policy', date: new Date('2024-12-07'), signature: 'HR', approved: true }
      }
    },
    {
      id: 2, employee: 'Kofi Asante', department: 'Security', type: 'Sick',
      start: new Date('2024-12-20'), end: new Date('2024-12-22'), status: 'Pending',
      manager: 'Abena Frimpong', reason: 'Flu symptoms', suggestedOfficer: 'Nana Osei',
      leaveContactAddress: { address: '7 Asokwa Road, Kumasi, Ghana', phone: '+233-24-987-6543', email: 'kofi.a@afwest.com.gh' },
      leaveEntitlement: { currentLeaveDays: 21, accruedLeaveDays: 3, leaveTaken: 8, leaveBalance: 16, outstandingLeave: 0, leaveGranted: 3, commencementDate: new Date('2024-12-20'), resumptionDate: new Date('2024-12-23') },
      approvals: {
        supervisor: { name: 'Abena Frimpong', approved: false },
        operationalManager: { name: 'Yaw Darko', approved: false },
        humanResourceOfficer: { name: 'HR Team', approved: false }
      }
    },
    {
      id: 3, employee: 'Akosua Frimpong', department: 'Finance', type: 'Personal',
      start: new Date('2024-12-24'), end: new Date('2024-12-26'), status: 'Rejected',
      manager: 'Nana Acheampong', reason: 'Family event', suggestedOfficer: 'Efua Mensah',
      leaveContactAddress: { address: '22 Harbour Road, Takoradi, Ghana', phone: '+233-24-555-1234', email: 'akosua.f@afwest.com.gh' },
      leaveEntitlement: { currentLeaveDays: 21, accruedLeaveDays: 2, leaveTaken: 12, leaveBalance: 11, outstandingLeave: 0, leaveGranted: 0, commencementDate: new Date('2024-12-24'), resumptionDate: new Date('2024-12-27') },
      approvals: {
        supervisor: { name: 'Nana Acheampong', date: new Date('2024-12-20'), signature: 'NA', approved: false },
        operationalManager: { name: 'Kweku Baffoe', date: new Date('2024-12-21'), signature: 'KB', approved: false },
        humanResourceOfficer: { name: 'HR Team', remarks: 'Insufficient leave balance', date: new Date('2024-12-22'), signature: 'HR', approved: false }
      }
    },
    {
      id: 4, employee: 'Yaw Acheampong', department: 'Logistics', type: 'Vacation',
      start: new Date('2024-12-28'), end: new Date('2025-01-03'), status: 'Approved',
      manager: 'Adwoa Kyei', reason: 'Holiday trip', suggestedOfficer: 'Kweku Baffoe',
      leaveContactAddress: { address: '5 Market Circle, Tema, Ghana', phone: '+233-24-777-8888', email: 'yaw.a@afwest.com.gh' },
      leaveEntitlement: { currentLeaveDays: 21, accruedLeaveDays: 8, leaveTaken: 5, leaveBalance: 24, outstandingLeave: 0, leaveGranted: 6, commencementDate: new Date('2024-12-28'), resumptionDate: new Date('2025-01-04') },
      approvals: {
        supervisor: { name: 'Adwoa Kyei', date: new Date('2024-12-25'), signature: 'AK', approved: true },
        operationalManager: { name: 'Kojo Agyemang', date: new Date('2024-12-26'), signature: 'KA', approved: true },
        humanResourceOfficer: { name: 'HR Team', remarks: 'Approved within policy limits', date: new Date('2024-12-27'), signature: 'HR', approved: true }
      }
    },
    {
      id: 5, employee: 'Abena Osei', department: 'Administration', type: 'Sick',
      start: new Date('2024-12-30'), end: new Date('2025-01-01'), status: 'Pending',
      manager: 'Kwame Mensah', reason: 'Migraine treatment', suggestedOfficer: 'Ama Boateng',
      leaveContactAddress: { address: '9 Independence Avenue, Accra, Ghana', phone: '+233-24-999-0000', email: 'abena.o@afwest.com.gh' },
      leaveEntitlement: { currentLeaveDays: 21, accruedLeaveDays: 4, leaveTaken: 7, leaveBalance: 18, outstandingLeave: 0, leaveGranted: 2, commencementDate: new Date('2024-12-30'), resumptionDate: new Date('2025-01-02') },
      approvals: {
        supervisor: { name: 'Kwame Mensah', approved: false },
        operationalManager: { name: 'Yaw Acheampong', approved: false },
        humanResourceOfficer: { name: 'HR Team', approved: false }
      }
    },
    {
      id: 6, employee: 'Nana Acheampong', department: 'Security', type: 'Unpaid',
      start: new Date('2025-01-05'), end: new Date('2025-01-10'), status: 'Approved',
      manager: 'Abena Frimpong', reason: 'Personal matters', suggestedOfficer: 'Kofi Asante',
      leaveContactAddress: { address: '3 Adum Road, Kumasi, Ghana', phone: '+233-24-333-4444', email: 'nana.a@afwest.com.gh' },
      leaveEntitlement: { currentLeaveDays: 21, accruedLeaveDays: 0, leaveTaken: 15, leaveBalance: 6, outstandingLeave: 0, leaveGranted: 5, commencementDate: new Date('2025-01-05'), resumptionDate: new Date('2025-01-13') },
      approvals: {
        supervisor: { name: 'Abena Frimpong', date: new Date('2025-01-03'), signature: 'AF', approved: true },
        operationalManager: { name: 'Yaw Darko', date: new Date('2025-01-04'), signature: 'YD', approved: true },
        humanResourceOfficer: { name: 'HR Team', remarks: 'Unpaid leave approved', date: new Date('2025-01-05'), signature: 'HR', approved: true }
      }
    }
  ];

  filteredRequests: LeaveRequest[] = [];
  showFilterPanel = false;
  filterStatus: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'All';
  private modalRef: any;

  submitting = false;
  newRequest = {
    type: 'Sick', start: new Date(), end: new Date(), reason: '',
    suggestedOfficer: '',
    leaveContactAddress: { address: '', phone: '', email: '' }
  };

  ngOnInit() {
    this.applyFilter();
  }

  applyFilter() {
    this.filteredRequests = this.filterStatus === 'All'
      ? [...this.requests]
      : this.requests.filter(r => r.status === this.filterStatus);
  }

  get activeFilterCount(): number { return this.filterStatus !== 'All' ? 1 : 0; }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.applyFilter();
  }

  deleteLeave(leave: LeaveRequest) {
    const ref = this.alertDialog.open({
      title: 'Delete Leave Request?',
      description: `Delete the leave request for "${leave.employee}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.requests = this.requests.filter(r => r.id !== leave.id);
      this.applyFilter();
      this.toast.show({ title: 'Leave Deleted', description: 'The leave request has been deleted.', variant: 'destructive' });
    });
  }

  viewRequest(request: LeaveRequest) {
    this.modalService.open({
      title: `Leave Request – ${request.employee}`,
      backdropClose: true, size: 'lg', showCloseButton: true,
      content: this.requestModal, context: { request }
    });
  }

  calculateRequestDays(request: LeaveRequest): number {
    if (!request.start || !request.end) return 0;
    return Math.ceil(Math.abs(request.end.getTime() - request.start.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatDuration(start: Date, end: Date): string {
    const days = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  calculateDays(): number {
    if (!this.newRequest.start || !this.newRequest.end) return 0;
    return Math.ceil(Math.abs(this.newRequest.end.getTime() - this.newRequest.start.getTime()) / (1000 * 3600 * 24)) + 1;
  }

  openRequestLeaveModal() {
    this.newRequest = {
      type: 'Sick', start: new Date(), end: new Date(), reason: '',
      suggestedOfficer: '', leaveContactAddress: { address: '', phone: '', email: '' }
    };
    this.modalRef = this.modalService.open({
      title: 'Request Leave', backdropClose: true, size: 'lg', showCloseButton: true,
      content: this.requestLeaveModal
    });
  }

  submitRequest() {
    this.submitting = true;
    setTimeout(() => {
      this.requests.unshift({
        id: Date.now(), employee: 'You', department: 'Your Department',
        type: this.newRequest.type, start: this.newRequest.start, end: this.newRequest.end,
        status: 'Pending', manager: 'HR Team', reason: this.newRequest.reason,
        suggestedOfficer: this.newRequest.suggestedOfficer,
        leaveContactAddress: this.newRequest.leaveContactAddress,
        leaveEntitlement: {
          currentLeaveDays: 21, accruedLeaveDays: 0, leaveTaken: 0, leaveBalance: 21,
          outstandingLeave: 0, leaveGranted: this.calculateDays(),
          commencementDate: this.newRequest.start, resumptionDate: this.newRequest.end
        },
        approvals: {
          supervisor: { name: 'Pending Supervisor', approved: false },
          operationalManager: { name: 'Pending Manager', approved: false },
          humanResourceOfficer: { name: 'HR Team', approved: false }
        }
      });
      this.applyFilter();
      this.submitting = false;
      if (this.modalRef) this.modalRef.close();
      this.toast.show({ title: 'Leave Request Submitted', description: 'Your leave request has been submitted successfully and is pending approval.', variant: 'success' });
    }, 800);
  }
}
