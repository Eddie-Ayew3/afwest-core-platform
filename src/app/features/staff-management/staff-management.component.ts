import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
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
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent
} from '@tolle_/tolle-ui';

interface Person {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  contact: string;
}

@Component({
  selector: 'app-staff-management',
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
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  // Search query
  searchQuery: string = '';
  
  // Filter state
  activeFilterCount: number = 0;
  filterPanelOpen: boolean = false;
  
  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  
  // Active tab
  activeTab: string = 'staff';
  
  // Staff data
  staff: Person[] = [
    { id: 'ST001', name: 'John Doe', role: 'Manager', status: 'Active', contact: 'john@example.com' },
    { id: 'ST002', name: 'Jane Smith', role: 'Assistant', status: 'Active', contact: 'jane@example.com' },
    { id: 'ST003', name: 'Bob Johnson', role: 'Coordinator', status: 'Suspended', contact: 'bob@example.com' },
    { id: 'ST004', name: 'Alice Brown', role: 'Specialist', status: 'Active', contact: 'alice@example.com' },
    { id: 'ST005', name: 'Charlie Wilson', role: 'Analyst', status: 'Active', contact: 'charlie@example.com' },
    { id: 'ST006', name: 'Diana Lee', role: 'Director', status: 'Active', contact: 'diana@example.com' },
    { id: 'ST007', name: 'Edward Clark', role: 'Consultant', status: 'Inactive', contact: 'edward@example.com' },
    { id: 'ST008', name: 'Fiona Davis', role: 'Supervisor', status: 'Active', contact: 'fiona@example.com' },
    { id: 'ST009', name: 'George Miller', role: 'Technician', status: 'Active', contact: 'george@example.com' },
    { id: 'ST010', name: 'Helen Moore', role: 'Officer', status: 'Active', contact: 'helen@example.com' },
    { id: 'ST011', name: 'Ivan Taylor', role: 'Agent', status: 'Active', contact: 'ivan@example.com' },
    { id: 'ST012', name: 'Julia White', role: 'Coordinator', status: 'Suspended', contact: 'julia@example.com' }
  ];
  
  // Guards data
  guards: Person[] = [
    { id: 'GD001', name: 'Kevin Anderson', role: 'Security Officer', status: 'Active', contact: 'kevin@example.com' },
    { id: 'GD002', name: 'Laura Thomas', role: 'Security Supervisor', status: 'Active', contact: 'laura@example.com' },
    { id: 'GD003', name: 'Michael Jackson', role: 'Security Manager', status: 'Active', contact: 'michael@example.com' },
    { id: 'GD004', name: 'Nancy Harris', role: 'Security Analyst', status: 'Suspended', contact: 'nancy@example.com' },
    { id: 'GD005', name: 'Oscar Martin', role: 'Security Consultant', status: 'Active', contact: 'oscar@example.com' },
    { id: 'GD006', name: 'Patricia Thompson', role: 'Security Officer', status: 'Active', contact: 'patricia@example.com' },
    { id: 'GD007', name: 'Quinn Garcia', role: 'Security Specialist', status: 'Active', contact: 'quinn@example.com' },
    { id: 'GD008', name: 'Rachel Martinez', role: 'Security Supervisor', status: 'Inactive', contact: 'rachel@example.com' },
    { id: 'GD009', name: 'Sam Robinson', role: 'Security Officer', status: 'Active', contact: 'sam@example.com' },
    { id: 'GD010', name: 'Tina Walker', role: 'Security Manager', status: 'Active', contact: 'tina@example.com' },
    { id: 'GD011', name: 'Uma Hall', role: 'Security Analyst', status: 'Active', contact: 'uma@example.com' },
    { id: 'GD012', name: 'Victor Allen', role: 'Security Consultant', status: 'Active', contact: 'victor@example.com' }
  ];
  
  // Filtered data
  filteredStaff: Person[] = [];
  filteredGuards: Person[] = [];
  
  // Displayed data (paginated)
  displayedStaff: Person[] = [];
  displayedGuards: Person[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }
  
  // Pagination helpers
  get staffStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get staffEndIndex(): number {
    return Math.min(this.staffStartIndex + this.pageSize, this.filteredStaff.length);
  }
  
  get guardStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  
  get guardEndIndex(): number {
    return Math.min(this.guardStartIndex + this.pageSize, this.filteredGuards.length);
  }
  
  // Apply filters and search
  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    
    // Filter staff
    this.filteredStaff = this.staff.filter(person => 
      person.name.toLowerCase().includes(query) || 
      person.role.toLowerCase().includes(query) ||
      person.id.toLowerCase().includes(query) ||
      person.contact.toLowerCase().includes(query)
    );
    
    // Filter guards
    this.filteredGuards = this.guards.filter(person => 
      person.name.toLowerCase().includes(query) || 
      person.role.toLowerCase().includes(query) ||
      person.id.toLowerCase().includes(query) ||
      person.contact.toLowerCase().includes(query)
    );
    
    this.currentPage = 1; // Reset to first page on filter
    this.updateDisplayedData();
  }
  
  // Update paginated data
  updateDisplayedData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedStaff = this.filteredStaff.slice(startIndex, startIndex + this.pageSize);
    this.displayedGuards = this.filteredGuards.slice(startIndex, startIndex + this.pageSize);
  }
  
  onSearch(): void {
    this.applyFilters();
  }
  
  toggleFilterPanel(): void {
    this.filterPanelOpen = !this.filterPanelOpen;
  }
  
  viewPerson(person: Person): void {
    console.log('View person:', person);
    // Add view logic here
  }
  
  clearFilters(): void {
    this.searchQuery = '';
    this.applyFilters();
    this.activeFilterCount = 0;
  }
  
  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedData();
  }
  
  onPageChange(event: any): void {
    // Extract page number from event depending on what pagination component emits
    this.currentPage = event?.page ?? event;
    this.updateDisplayedData();
  }
  
  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    this.currentPage = 1; // Reset page when switching tabs
  }
}