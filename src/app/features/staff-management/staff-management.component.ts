import { Component, OnInit, inject } from '@angular/core';
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
import { PermissionsService } from '../../core/services/permissions.service';
import { GhanaSite } from '../../core/models/rbac.models';

interface Person {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  contact: string;
  site: GhanaSite;
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
  private permissions = inject(PermissionsService);

  searchQuery: string = '';
  activeFilterCount: number = 0;
  filterPanelOpen: boolean = false;
  pageSize: number = 10;
  currentPage: number = 1;
  activeTab: string = 'staff';

  staff: Person[] = [
    { id: 'ST001', name: 'Kwame Mensah',    role: 'Operations Manager',  status: 'Active',    contact: 'k.mensah@afwest.com.gh',    site: 'Head Office – Accra' },
    { id: 'ST002', name: 'Ama Boateng',     role: 'HR Assistant',        status: 'Active',    contact: 'a.boateng@afwest.com.gh',   site: 'Kumasi Branch' },
    { id: 'ST003', name: 'Kofi Asante',     role: 'Zone Coordinator',    status: 'Suspended', contact: 'k.asante@afwest.com.gh',    site: 'Head Office – Accra' },
    { id: 'ST004', name: 'Abena Osei',      role: 'Admin Specialist',    status: 'Active',    contact: 'a.osei@afwest.com.gh',      site: 'Takoradi Branch' },
    { id: 'ST005', name: 'Yaw Darko',       role: 'Finance Analyst',     status: 'Active',    contact: 'y.darko@afwest.com.gh',     site: 'Head Office – Accra' },
    { id: 'ST006', name: 'Akosua Frimpong', role: 'Branch Manager',      status: 'Active',    contact: 'a.frimpong@afwest.com.gh',  site: 'Kumasi Branch' },
    { id: 'ST007', name: 'Nana Acheampong', role: 'IT Consultant',       status: 'Inactive',  contact: 'n.acheampong@afwest.com.gh',site: 'Head Office – Accra' },
    { id: 'ST008', name: 'Efua Asante',     role: 'Site Supervisor',     status: 'Active',    contact: 'e.asante@afwest.com.gh',    site: 'Tema Industrial' },
    { id: 'ST009', name: 'Kweku Baffoe',    role: 'Logistics Officer',   status: 'Active',    contact: 'k.baffoe@afwest.com.gh',    site: 'Cape Coast Post' },
    { id: 'ST010', name: 'Adwoa Kyei',      role: 'Procurement Officer', status: 'Active',    contact: 'a.kyei@afwest.com.gh',      site: 'Head Office – Accra' },
    { id: 'ST011', name: 'Kojo Agyemang',   role: 'Control Coordinator', status: 'Active',    contact: 'k.agyemang@afwest.com.gh',  site: 'Kumasi Branch' },
    { id: 'ST012', name: 'Akua Tetteh',     role: 'Admin Coordinator',   status: 'Suspended', contact: 'a.tetteh@afwest.com.gh',    site: 'Takoradi Branch' },
  ];

  guards: Person[] = [
    { id: 'GD001', name: 'Kwesi Owusu',       role: 'Senior Guard',       status: 'Active',    contact: 'k.owusu@afwest.com.gh',     site: 'Head Office – Accra' },
    { id: 'GD002', name: 'Esi Mensah',         role: 'Guard Supervisor',   status: 'Active',    contact: 'e.mensah@afwest.com.gh',    site: 'Kumasi Branch' },
    { id: 'GD003', name: 'Fiifi Aidoo',        role: 'Guard',              status: 'Active',    contact: 'f.aidoo@afwest.com.gh',     site: 'Head Office – Accra' },
    { id: 'GD004', name: 'Afia Nyarko',        role: 'Guard',              status: 'Suspended', contact: 'a.nyarko@afwest.com.gh',    site: 'Tema Industrial' },
    { id: 'GD005', name: 'Yoofi Entsie',       role: 'Guard',              status: 'Active',    contact: 'y.entsie@afwest.com.gh',    site: 'Cape Coast Post' },
    { id: 'GD006', name: 'Maame Serwaa',       role: 'Senior Guard',       status: 'Active',    contact: 'm.serwaa@afwest.com.gh',    site: 'Head Office – Accra' },
    { id: 'GD007', name: 'Nii Armah',          role: 'Guard',              status: 'Active',    contact: 'n.armah@afwest.com.gh',     site: 'Kumasi Branch' },
    { id: 'GD008', name: 'Akosua Agyare',      role: 'Guard Supervisor',   status: 'Inactive',  contact: 'a.agyare@afwest.com.gh',    site: 'Takoradi Branch' },
    { id: 'GD009', name: 'Kofi Tawiah',        role: 'Guard',              status: 'Active',    contact: 'k.tawiah@afwest.com.gh',    site: 'Head Office – Accra' },
    { id: 'GD010', name: 'Abena Boampong',     role: 'Senior Guard',       status: 'Active',    contact: 'a.boampong@afwest.com.gh',  site: 'Tema Industrial' },
    { id: 'GD011', name: 'Ato Hagan',          role: 'Guard',              status: 'Active',    contact: 'a.hagan@afwest.com.gh',     site: 'Kumasi Branch' },
    { id: 'GD012', name: 'Ewuraba Piesie',     role: 'Guard',              status: 'Active',    contact: 'e.piesie@afwest.com.gh',    site: 'Cape Coast Post' },
  ];

  filteredStaff: Person[] = [];
  filteredGuards: Person[] = [];
  displayedStaff: Person[] = [];
  displayedGuards: Person[] = [];

  ngOnInit(): void {
    this.staff  = this.permissions.filterBySite(this.staff);
    this.guards = this.permissions.filterBySite(this.guards);
    this.applyFilters();
  }

  get staffStartIndex(): number { return (this.currentPage - 1) * this.pageSize; }
  get staffEndIndex(): number   { return Math.min(this.staffStartIndex + this.pageSize, this.filteredStaff.length); }
  get guardStartIndex(): number { return (this.currentPage - 1) * this.pageSize; }
  get guardEndIndex(): number   { return Math.min(this.guardStartIndex + this.pageSize, this.filteredGuards.length); }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredStaff = this.staff.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.role.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.contact.toLowerCase().includes(query)
    );
    this.filteredGuards = this.guards.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.role.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.contact.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updateDisplayedData();
  }

  updateDisplayedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedStaff  = this.filteredStaff.slice(start, start + this.pageSize);
    this.displayedGuards = this.filteredGuards.slice(start, start + this.pageSize);
  }

  onSearch(): void { this.applyFilters(); }

  toggleFilterPanel(): void { this.filterPanelOpen = !this.filterPanelOpen; }

  viewPerson(person: Person): void { console.log('View person:', person); }

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
    this.currentPage = event?.page ?? event;
    this.updateDisplayedData();
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId;
    this.currentPage = 1;
  }
}
