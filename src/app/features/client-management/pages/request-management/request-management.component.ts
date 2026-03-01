import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  ButtonComponent,
  InputComponent,
  BadgeComponent,
  SelectComponent,
  SelectItemComponent,
  DatePickerComponent,
  EmptyStateComponent,
  PaginationComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  LabelComponent,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ModalService
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
    CardComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    SelectComponent,
    SelectItemComponent,
    EmptyStateComponent,
    PaginationComponent,
    TooltipDirective,
    DropdownTriggerDirective,
    DropdownMenuComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent
  ],
  templateUrl: './request-management.component.html',
  styleUrls: ['./request-management.component.css']
})
export class RequestManagementComponent implements OnInit {
  private modalService = inject(ModalService);

  requests: GuardRequest[] = [
    {
      id: 'REQ001',
      guardName: 'John Smith',
      guardId: 'GRD001',
      requestType: 'uniform',
      title: 'New Uniform Set',
      description: 'Request for complete uniform set including shirt, pants, and cap',
      urgency: 'high',
      status: 'pending',
      requestedDate: new Date('2024-02-25'),
      expectedDeliveryDate: new Date('2024-03-05'),
      cost: 150.00,
      items: ['Shirt (2x)', 'Pants (2x)', 'Cap (1x)', 'Boots (1x)']
    },
    {
      id: 'REQ002',
      guardName: 'Sarah Johnson',
      guardId: 'GRD002',
      requestType: 'petty-cash',
      title: 'Transportation Allowance',
      description: 'Request for transportation allowance for night shift coverage',
      urgency: 'medium',
      status: 'approved',
      requestedDate: new Date('2024-02-24'),
      expectedDeliveryDate: new Date('2024-02-26'),
      completedDate: new Date('2024-02-26'),
      cost: 50.00
    },
    {
      id: 'REQ003',
      guardName: 'Mike Chen',
      guardId: 'GRD003',
      requestType: 'equipment',
      title: 'Security Equipment',
      description: 'Request for new flashlight and radio batteries',
      urgency: 'low',
      status: 'completed',
      requestedDate: new Date('2024-02-20'),
      completedDate: new Date('2024-02-23'),
      cost: 35.50,
      items: ['Flashlight (1x)', 'Radio Batteries (4x)']
    },
    {
      id: 'REQ004',
      guardName: 'Emily Rodriguez',
      guardId: 'GRD004',
      requestType: 'transportation',
      title: 'Emergency Transport',
      description: 'Request for emergency transportation due to vehicle breakdown',
      urgency: 'urgent',
      status: 'pending',
      requestedDate: new Date('2024-02-27'),
      cost: 75.00
    }
  ];

  filteredRequests: GuardRequest[] = [];
  displayedRequests: GuardRequest[] = [];

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  // Filters
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  selectedUrgency: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredRequests.length);
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
    this.currentPage = 1;
    this.updateDisplayedRequests();
  }

  updateDisplayedRequests(): void {
    this.displayedRequests = this.filteredRequests.slice(this.startIndex, this.endIndex);
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
    request.status = 'approved';
    this.applyFilters();
  }

  rejectRequest(request: GuardRequest): void {
    request.status = 'rejected';
    this.applyFilters();
  }

  completeRequest(request: GuardRequest): void {
    request.status = 'completed';
    request.completedDate = new Date();
    this.applyFilters();
  }

  viewRequestDetails(request: GuardRequest): void {
    console.log('View request details:', request);
  }

  openNewRequestDialog(): void {
    const modalRef = this.modalService.open({
      title: 'New Guard Request',
      content: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Guard Name</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter guard name">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Request Type</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select request type</option>
              <option value="uniform">Uniform</option>
              <option value="petty-cash">Petty Cash</option>
              <option value="equipment">Equipment</option>
              <option value="transportation">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Title</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter request title">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <textarea class="w-full p-2 border rounded-md" rows="3" placeholder="Enter request description"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Urgency</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Expected Cost ($)</label>
            <input type="number" class="w-full p-2 border rounded-md" placeholder="0.00">
          </div>
        </div>
      `,
      size: 'default'
    });

    modalRef.afterClosed$.subscribe((result: any) => {
      if (result?.success) {
        console.log('New request added successfully');
        // Here you would typically refresh the request list
      }
    });
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedRequests();
  }

  onPageChange(event: any): void {
    this.currentPage = event;
    this.updateDisplayedRequests();
  }
}
