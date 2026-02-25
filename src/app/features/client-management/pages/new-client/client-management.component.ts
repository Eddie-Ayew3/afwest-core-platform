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
  CheckboxComponent,
  SelectComponent,
  SelectItemComponent,
  DatePickerComponent,
  CollapsibleComponent,
  CollapsibleContentComponent,
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

interface Client {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  status: 'Active' | 'Suspended';
  contractEnd: Date;
  region: string;
}

@Component({
  selector: 'app-client-management',
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
    BreadcrumbSeparatorComponent,
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  private modalService = inject(ModalService);

  clients: Client[] = [
    { id: 'CLT001', name: 'Acme Corp.', contactPerson: 'John Smith', contactEmail: 'john.smith@acme.com', status: 'Active', contractEnd: new Date('2024-12-31'), region: 'North America' },
    { id: 'CLT002', name: 'Beta Industries', contactPerson: 'Sarah Johnson', contactEmail: 'sarah.j@betaind.com', status: 'Suspended', contractEnd: new Date('2024-10-15'), region: 'Europe' },
    { id: 'CLT003', name: 'Gamma Logistics', contactPerson: 'Mike Chen', contactEmail: 'm.chen@gammalogistics.com', status: 'Active', contractEnd: new Date('2025-03-20'), region: 'Asia-Pacific' },
    { id: 'CLT004', name: 'Delta Solutions', contactPerson: 'Emily Rodriguez', contactEmail: 'emily.r@delta.com', status: 'Active', contractEnd: new Date('2024-06-30'), region: 'South America' },
    { id: 'CLT005', name: 'Epsilon Tech', contactPerson: 'David Kim', contactEmail: 'd.kim@epsilontech.com', status: 'Suspended', contractEnd: new Date('2024-11-01'), region: 'North America' }
  ];

  filteredClients: Client[] = [];
  displayedClients: Client[] = [];

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  // Filters
  selectedStatus: string = 'all';
  selectedRegion: string = 'all';

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
    return Math.min(this.startIndex + this.pageSize, this.filteredClients.length);
  }

  applyFilters(): void {
    let result = [...this.clients];

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.contactPerson.toLowerCase().includes(query) ||
        client.region.toLowerCase().includes(query) ||
        client.contactEmail.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(client => client.status === this.selectedStatus);
    }

    // Region filter
    if (this.selectedRegion !== 'all') {
      result = result.filter(client => client.region === this.selectedRegion);
    }

    this.filteredClients = result;
    this.updateActiveFilterCount();
    this.currentPage = 1;
    this.updateDisplayedClients();
  }

  updateDisplayedClients(): void {
    this.displayedClients = this.filteredClients.slice(this.startIndex, this.endIndex);
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedRegion !== 'all') count++;
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
    this.selectedRegion = 'all';
    this.applyFilters();
  }

  isContractEndingSoon(endDate: Date): boolean {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate >= today;
  }

  openNewClientDialog(): void {
    const modalRef = this.modalService.open({
      title: 'Add New Client',
      content: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Client Name</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter client name">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Contact Person</label>
            <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter contact person">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Contact Email</label>
            <input type="email" class="w-full p-2 border rounded-md" placeholder="Enter email address">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Region</label>
            <select class="w-full p-2 border rounded-md">
              <option value="">Select region</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="South America">South America</option>
            </select>
          </div>
        </div>
      `,
      size: 'default'
    });

    modalRef.afterClosed$.subscribe((result: any) => {
      if (result?.success) {
        console.log('New client added successfully');
        // Here you would typically refresh the client list
      }
    });
  }

  editClient(client: Client): void {
    console.log('Edit client:', client);
  }

  viewClient(client: Client): void {
    console.log('View client:', client);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedClients();
  }

  onPageChange(event: any): void {
    this.currentPage = event;
    this.updateDisplayedClients();
  }
}