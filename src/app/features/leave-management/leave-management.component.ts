import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ButtonComponent, BadgeComponent, SheetComponent, SheetContentComponent,
  SelectComponent, SelectItemComponent, DatePickerComponent, TextareaComponent,
  LabelComponent, EmptyStateComponent, ModalService, CardComponent, CardContentComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  InputComponent, DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective, PaginationComponent
} from '@tolle_/tolle-ui';

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
}

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    SheetComponent, SheetContentComponent,
    SelectComponent, SelectItemComponent, DatePickerComponent,
    TextareaComponent, LabelComponent, EmptyStateComponent,
    CardComponent, CardContentComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    InputComponent, DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective, PaginationComponent
  ],
  templateUrl: './leave-management.component.html'
})
export class LeaveManagementComponent implements OnInit {
  private modalService = inject(ModalService);

  requests: LeaveRequest[] = [
    { id: 1, employee: 'Sarah Johnson', department: 'Marketing', type: 'Vacation', start: new Date('2024-12-10'), end: new Date('2024-12-15'), status: 'Approved', manager: 'John Doe', reason: 'Family vacation' },
    { id: 2, employee: 'Michael Brown', department: 'Engineering', type: 'Sick', start: new Date('2024-12-20'), end: new Date('2024-12-22'), status: 'Pending', manager: 'Maria Garcia', reason: 'Flu symptoms' },
    { id: 3, employee: 'Emily Davis', department: 'Design', type: 'Personal', start: new Date('2024-12-24'), end: new Date('2024-12-26'), status: 'Rejected', manager: 'David Lee', reason: 'Family event' },
    { id: 4, employee: 'James Wilson', department: 'Sales', type: 'Vacation', start: new Date('2024-12-28'), end: new Date('2025-01-03'), status: 'Approved', manager: 'Anna Smith', reason: 'Holiday trip' },
    { id: 5, employee: 'Jennifer Martinez', department: 'Finance', type: 'Sick', start: new Date('2024-12-30'), end: new Date('2025-01-01'), status: 'Pending', manager: 'Robert Brown', reason: 'Migraine treatment' },
    { id: 6, employee: 'William Taylor', department: 'Operations', type: 'Unpaid', start: new Date('2025-01-05'), end: new Date('2025-01-10'), status: 'Approved', manager: 'Linda Davis', reason: 'Personal matters' },
    { id: 7, employee: 'Elizabeth Anderson', department: 'HR', type: 'Personal', start: new Date('2025-01-12'), end: new Date('2025-01-13'), status: 'Pending', manager: 'James Wilson', reason: 'Doctor appointment' },
    { id: 8, employee: 'David Thomas', department: 'Engineering', type: 'Vacation', start: new Date('2025-01-15'), end: new Date('2025-01-22'), status: 'Approved', manager: 'Maria Garcia', reason: 'Winter break' },
    { id: 9, employee: 'Susan Jackson', department: 'Marketing', type: 'Sick', start: new Date('2025-01-20'), end: new Date('2025-01-21'), status: 'Rejected', manager: 'Sarah Johnson', reason: 'Minor illness' },
    { id: 10, employee: 'Christopher White', department: 'Sales', type: 'Vacation', start: new Date('2025-02-01'), end: new Date('2025-02-10'), status: 'Pending', manager: 'Anna Smith', reason: 'Business trip' },
    { id: 11, employee: 'Amanda Harris', department: 'Design', type: 'Personal', start: new Date('2025-02-05'), end: new Date('2025-02-07'), status: 'Approved', manager: 'David Lee', reason: 'Wedding ceremony' },
    { id: 12, employee: 'Daniel Martin', department: 'Operations', type: 'Unpaid', start: new Date('2025-02-10'), end: new Date('2025-02-15'), status: 'Pending', manager: 'Linda Davis', reason: 'Family emergency' }
  ];

  filteredRequests: LeaveRequest[] = [];
  displayedRequests: LeaveRequest[] = [];
  
  searchQuery = '';
  searchTimeout: any;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  startIndex = 0;
  endIndex = 0;

  // Filter state
  showFilterPanel = false;
  filterStatus: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'All';

  // Sheet
  showRequestSheet = false;
  submitting = false;
  newRequest = {
    type: 'Sick',
    start: new Date(),
    end: new Date(),
    reason: ''
  };

  ngOnInit() {
    this.filteredRequests = [...this.requests];
    this.applyFiltersAndPagination();
  }

  // Search functionality with debounce
  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFiltersAndPagination();
    }, 300);
  }

  // Apply search, filter, and pagination
  applyFiltersAndPagination() {
    let result = [...this.requests];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.employee.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.manager.toLowerCase().includes(q)
      );
    }

    // Apply status filter
    if (this.filterStatus !== 'All') {
      result = result.filter(r => r.status === this.filterStatus);
    }

    this.filteredRequests = result;

    // Apply pagination
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredRequests.length);
    this.displayedRequests = this.filteredRequests.slice(this.startIndex, this.endIndex);
  }

  // Page change handler
 
  onPageChange(event: Event | number) {
    const pageNumber = typeof event === 'number' ? event : (event as any).detail || (event as any).page || 1;
    this.currentPage = pageNumber;
    this.applyFiltersAndPagination();
  }

  // Page size change handler
  onPageSizeChange() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  // Clear all filters
  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'All';
    this.filteredRequests = [...this.requests];
    this.displayedRequests = this.filteredRequests.slice(0, this.pageSize);
  }

  // Toggle filter panel
  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  // Get active filter count
  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.filterStatus !== 'All') count++;
    return count;
  }

  // View request details
  viewRequest(request: LeaveRequest) {
    this.modalService.open({
      title: `Leave Request - ${request.employee}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: `
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
              ${request.employee.charAt(0)}
            </div>
            <div>
              <h4 class="font-semibold">${request.employee}</h4>
              <p class="text-sm text-muted-foreground">${request.department}</p>
            </div>
          </div>
          <div class="space-y-2">
            <div class="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Leave Type</p>
                <p class="font-medium mt-1">${request.type}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Manager</p>
                <p class="font-medium mt-1">${request.manager}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Start Date</p>
                <p class="font-medium mt-1">${this.formatDate(request.start)}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">End Date</p>
                <p class="font-medium mt-1">${this.formatDate(request.end)}</p>
              </div>
            </div>
            <div class="p-3 bg-muted/50 rounded-lg">
              <p class="text-xs text-muted-foreground uppercase font-semibold">Total Duration</p>
              <p class="font-medium mt-1">${this.calculateRequestDays(request)} days</p>
            </div>
            <div class="p-3 bg-muted/50 rounded-lg">
              <p class="text-xs text-muted-foreground uppercase font-semibold">Status</p>
              <p class="font-medium mt-1 flex items-center gap-2">
                <span class="h-2 w-2 rounded-full ${
                  request.status === 'Approved' ? 'bg-green-500' : 
                  request.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                }"></span>
                ${request.status}
              </p>
            </div>
          </div>
          <div class="p-4 bg-muted/50 rounded-lg">
            <p class="text-xs text-muted-foreground uppercase font-semibold mb-2">Comments</p>
            <p class="text-sm text-muted-foreground italic">${request.reason || 'No comments provided'}</p>
          </div>
        </div>
      `
    });
  }

  // Calculate days for a request
  calculateRequestDays(request: LeaveRequest): number {
    if (!request.start || !request.end) return 0;
    const diff = Math.abs(request.end.getTime() - request.start.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Calculate duration for display
  formatDuration(start: Date, end: Date): string {
    const diff = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  // Calculate days between dates
  calculateDays(): number {
    if (!this.newRequest.start || !this.newRequest.end) return 0;
    const diff = Math.abs(this.newRequest.end.getTime() - this.newRequest.start.getTime());
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  }

  // Open the request leave sheet
  openRequestLeaveSheet() {
    this.newRequest = { type: 'Sick', start: new Date(), end: new Date(), reason: '' };
    this.showRequestSheet = true;
  }

  // Submit new leave request
  submitRequest() {
    this.submitting = true;
    
    setTimeout(() => {
      // Add new request
      this.requests.unshift({
        id: Date.now(),
        employee: 'You',
        department: 'Your Department',
        type: this.newRequest.type,
        start: this.newRequest.start,
        end: this.newRequest.end,
        status: 'Pending',
        manager: 'HR Team',
        reason: this.newRequest.reason
      });
      
      this.applyFiltersAndPagination();
      this.showRequestSheet = false;
      this.submitting = false;
      
      this.modalService.open({
        title: 'Request Submitted',
        backdropClose: true,
        size: 'default',
        showCloseButton: true,
        content: 'Your leave request has been submitted successfully. You will receive a notification when it is reviewed.'
      });
    }, 800);
  }
}
