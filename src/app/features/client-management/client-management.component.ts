import { Component, OnInit } from '@angular/core';
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
 DropdownMenuComponent
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
    DropdownMenuComponent
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  // Sample data matching the screen.png
  clients: Client[] = [
    {
      id: 'CLT001',
      name: 'Acme Corp.',
      contactPerson: 'John Smith',
      contactEmail: 'john.smith@acme.com',
      status: 'Active',
      contractEnd: new Date('2024-12-31'),
      region: 'North America'
    },
    {
      id: 'CLT002',
      name: 'Beta Industries',
      contactPerson: 'Sarah Johnson',
      contactEmail: 'sarah.j@betaind.com',
      status: 'Suspended',
      contractEnd: new Date('2024-10-15'),
      region: 'Europe'
    },
    {
      id: 'CLT003',
      name: 'Gamma Logistics',
      contactPerson: 'Mike Chen',
      contactEmail: 'm.chen@gammalogistics.com',
      status: 'Active',
      contractEnd: new Date('2025-03-20'),
      region: 'Asia-Pacific'
    },
    {
      id: 'CLT004',
      name: 'Delta Solutions',
      contactPerson: 'Emily Rodriguez',
      contactEmail: 'emily.r@delta.com',
      status: 'Active',
      contractEnd: new Date('2024-06-30'),
      region: 'South America'
    },
    {
      id: 'CLT005',
      name: 'Epsilon Tech',
      contactPerson: 'David Kim',
      contactEmail: 'd.kim@epsilontech.com',
      status: 'Suspended',
      contractEnd: new Date('2024-11-01'),
      region: 'North America'
    }
  ];

  filteredClients: Client[] = [];
  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  
  constructor() {}

  ngOnInit(): void {
    this.filteredClients = [...this.clients];
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredClients.length);
  }

  onSearch(): void {
    // Implement search logic
    if (!this.searchQuery.trim()) {
      this.filteredClients = [...this.clients];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredClients = this.clients.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.contactPerson.toLowerCase().includes(query) ||
        client.region.toLowerCase().includes(query)
      );
    }
    this.currentPage = 1;
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filteredClients = [...this.clients];
    this.activeFilterCount = 0;
    this.currentPage = 1;
  }

  isContractEndingSoon(endDate: Date): boolean {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate >= today;
  }

  openNewClientDialog(): void {
    console.log('Open new client dialog');
    // Implement dialog logic
  }

  editClient(client: Client): void {
    console.log('Edit client:', client);
    // Implement edit logic
  }

  viewClient(client: Client): void {
    console.log('View client:', client);
    // Implement view logic
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  onPageChange(event: any): void {
    this.currentPage = event;
  }
}