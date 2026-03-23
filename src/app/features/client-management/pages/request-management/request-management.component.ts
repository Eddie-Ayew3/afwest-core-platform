import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  InputComponent,
  TextareaComponent,
  BadgeComponent,
  SelectComponent,
  SelectItemComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  LabelComponent,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ModalService,
  DataTableComponent,
  TolleCellDirective,
  TableColumn,
  AlertDialogService,
  ToastService
} from '@tolle_/tolle-ui';

export interface GuardRequest {
  id: string;
  guardName: string;
  guardId: string;
  requestType: 'uniform' | 'petty-cash' | 'equipment' | 'transportation' | 'other';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedDate: Date;
  expectedDeliveryDate?: Date;
  completedDate?: Date;
  cost?: number;
  items?: string[];
}

@Component({
  selector: 'app-request-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    SelectComponent,
    SelectItemComponent,
    TooltipDirective,
    DropdownTriggerDirective,
    LabelComponent,
    DropdownMenuComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    DataTableComponent,
    TolleCellDirective,
  ],
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.css']
})
export class RequestManagementComponent implements OnInit {
  modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('newRequestModal') newRequestModal!: TemplateRef<any>;
  @ViewChild('requestDetailModal') requestDetailModal!: TemplateRef<any>;

  requests: GuardRequest[] = [
    {
      id: 'REQ001',
      guardName: 'Kwame Mensah',
      guardId: 'GD-001',
      requestType: 'uniform',
      title: 'New Uniform Set',
      description: 'Request for complete uniform set including shirt, pants, and cap',
      urgency: 'high',
      status: 'pending',
      requestedDate: new Date('2025-03-01'),
      expectedDeliveryDate: new Date('2025-03-10'),
      cost: 320.00,
      items: ['Shirt (2x)', 'Pants (2x)', 'Cap (1x)', 'Boots (1x)']
    },
    {
      id: 'REQ002',
      guardName: 'Ama Boateng',
      guardId: 'GD-002',
      requestType: 'petty-cash',
      title: 'Transportation Allowance',
      description: 'Request for transportation allowance for night shift coverage at Kumasi Branch',
      urgency: 'medium',
      status: 'approved',
      requestedDate: new Date('2025-02-28'),
      expectedDeliveryDate: new Date('2025-03-02'),
      cost: 85.00
    },
    {
      id: 'REQ003',
      guardName: 'Kofi Asante',
      guardId: 'GD-003',
      requestType: 'equipment',
      title: 'Security Equipment Restock',
      description: 'Request for new flashlights and replacement radio batteries for the Tema Industrial site',
      urgency: 'low',
      status: 'completed',
      requestedDate: new Date('2025-02-20'),
      completedDate: new Date('2025-02-24'),
      cost: 95.00,
      items: ['Flashlight (2x)', 'Radio Batteries (8x)', 'Batons (2x)']
    },
    {
      id: 'REQ004',
      guardName: 'Abena Osei',
      guardId: 'GD-004',
      requestType: 'transportation',
      title: 'Emergency Site Transfer',
      description: 'Request for emergency transportation to cover Takoradi Branch due to vehicle breakdown',
      urgency: 'urgent',
      status: 'pending',
      requestedDate: new Date('2025-03-01'),
      cost: 150.00
    },
    {
      id: 'REQ005',
      guardName: 'Yaw Darko',
      guardId: 'GD-005',
      requestType: 'uniform',
      title: 'Replacement Uniform',
      description: 'Existing uniform is worn out and needs replacement ahead of client inspection',
      urgency: 'medium',
      status: 'rejected',
      requestedDate: new Date('2025-02-18'),
      cost: 180.00,
      items: ['Shirt (1x)', 'Pants (1x)']
    },
    {
      id: 'REQ006',
      guardName: 'Akosua Frimpong',
      guardId: 'GD-006',
      requestType: 'petty-cash',
      title: 'Meal Allowance – Night Shift',
      description: 'Meal allowance request for guards covering the extended night shift at Head Office',
      urgency: 'low',
      status: 'completed',
      requestedDate: new Date('2025-02-15'),
      completedDate: new Date('2025-02-16'),
      cost: 60.00
    }
  ];

  filteredRequests: GuardRequest[] = [];

  columns: TableColumn[] = [
    { key: 'requestId', label: 'Request ID' },
    { key: 'guardInfo', label: 'Guard Info' },
    { key: 'requestDetails', label: 'Request Details' },
    { key: 'type', label: 'Type' },
    { key: 'urgency', label: 'Urgency' },
    { key: 'status', label: 'Status' },
    { key: 'cost', label: 'Cost' },
    { key: 'requestedDate', label: 'Requested Date' },
    { key: 'actions', label: '' }
  ];

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  newRequestForm: { guardName: string; guardId: string; requestType: GuardRequest['requestType'] | ''; title: string; description: string; urgency: GuardRequest['urgency'] | ''; cost: number | null } = {
    guardName: '', guardId: '', requestType: '', title: '', description: '', urgency: '', cost: null
  };

  // Filters
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  selectedUrgency: string = 'all';

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.requests];

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(request =>
        request.guardName.toLowerCase().includes(query) ||
        request.title.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query) ||
        request.guardId.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(request => request.status === this.selectedStatus);
    }

    // Type filter
    if (this.selectedType !== 'all') {
      result = result.filter(request => request.requestType === this.selectedType);
    }

    // Urgency filter
    if (this.selectedUrgency !== 'all') {
      result = result.filter(request => request.urgency === this.selectedUrgency);
    }

    this.filteredRequests = result;
    this.updateActiveFilterCount();
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedType !== 'all') count++;
    if (this.selectedUrgency !== 'all') count++;
    this.activeFilterCount = count;
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.selectedType = 'all';
    this.selectedUrgency = 'all';
    this.applyFilters();
  }

  getRequestTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'uniform': 'ri-t-shirt-line',
      'petty-cash': 'ri-money-dollar-circle-line',
      'equipment': 'ri-tools-line',
      'transportation': 'ri-car-line',
      'other': 'ri-more-line'
    };
    return iconMap[type] || 'ri-file-line';
  }

  getUrgencyColor(urgency: string): string {
    const colorMap: { [key: string]: string } = {
      'low': 'secondary',
      'medium': 'default',
      'high': 'secondary',
      'urgent': 'destructive'
    };
    return colorMap[urgency] || 'default';
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'secondary',
      'approved': 'default',
      'rejected': 'destructive',
      'completed': 'default'
    };
    return colorMap[status] || 'default';
  }

  approveRequest(request: GuardRequest): void {
    const ref = this.alertDialog.open({
      title: 'Approve Request?',
      description: `Approve "${request.title}" submitted by ${request.guardName}? The guard will be notified.`,
      actionText: 'Approve',
      cancelText: 'Cancel',
      variant: 'default'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      request.status = 'approved';
      this.applyFilters();
      this.toast.show({ title: 'Request Approved', description: `"${request.title}" has been approved.`, variant: 'success' });
    });
  }

  rejectRequest(request: GuardRequest): void {
    const ref = this.alertDialog.open({
      title: 'Reject Request?',
      description: `Reject "${request.title}" submitted by ${request.guardName}? This action will notify the guard.`,
      actionText: 'Reject',
      cancelText: 'Cancel',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      request.status = 'rejected';
      this.applyFilters();
      this.toast.show({ title: 'Request Rejected', description: `"${request.title}" has been rejected.`, variant: 'destructive' });
    });
  }

  completeRequest(request: GuardRequest): void {
    const ref = this.alertDialog.open({
      title: 'Mark as Completed?',
      description: `Mark "${request.title}" as completed? This confirms the request has been fulfilled.`,
      actionText: 'Complete',
      cancelText: 'Cancel',
      variant: 'default'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      request.status = 'completed';
      request.completedDate = new Date();
      this.applyFilters();
      this.toast.show({ title: 'Request Completed', description: `"${request.title}" has been marked as completed.`, variant: 'success' });
    });
  }

  viewRequestDetails(request: GuardRequest): void {
    this.modalService.open({
      title: `Request Details – ${request.id}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.requestDetailModal,
      context: { request }
    });
  }

  openNewRequestDialog(): void {
    this.newRequestForm = { guardName: '', guardId: '', requestType: '', title: '', description: '', urgency: '', cost: null };
    this.modalService.open({
      title: 'New Guard Request',
      content: this.newRequestModal,
      showCloseButton: true,
      size: 'lg'
    });
  }

  submitNewRequest(): void {
    if (!this.newRequestForm.guardName || !this.newRequestForm.requestType || !this.newRequestForm.title || !this.newRequestForm.urgency) return;
    const newRequest: GuardRequest = {
      id: `REQ${String(this.requests.length + 1).padStart(3, '0')}`,
      guardName: this.newRequestForm.guardName,
      guardId: this.newRequestForm.guardId || `GRD${String(this.requests.length + 1).padStart(3, '0')}`,
      requestType: this.newRequestForm.requestType as GuardRequest['requestType'],
      title: this.newRequestForm.title,
      description: this.newRequestForm.description,
      urgency: this.newRequestForm.urgency as GuardRequest['urgency'],
      status: 'pending',
      requestedDate: new Date(),
      cost: this.newRequestForm.cost ?? undefined
    };
    this.requests.unshift(newRequest);
    this.applyFilters();
    this.modalService.closeAll();
    this.toast.show({ title: 'Request Submitted', description: `"${newRequest.title}" has been submitted for review.`, variant: 'success' });
  }

  deleteRequest(request: GuardRequest) {
    const ref = this.alertDialog.open({
      title: 'Delete Request?',
      description: `Delete guard request "${request.id}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.requests = this.requests.filter(r => r.id !== request.id);
      this.applyFilters();
      this.toast.show({ title: 'Request Deleted', description: 'The guard request has been deleted.', variant: 'destructive' });
    });
  }
}
