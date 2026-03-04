import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  BreadcrumbSeparatorComponent
} from '@tolle_/tolle-ui';
import { GhanaSite } from '../../../../core/models/rbac.models';
import { PermissionsService } from '../../../../core/services/permissions.service';

interface StaffMember {
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
    BreadcrumbSeparatorComponent
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);

  searchQuery = '';
  activeFilterCount = 0;
  filterPanelOpen = false;
  pageSize = 10;
  currentPage = 1;

  staff: StaffMember[] = [
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

  filteredStaff: StaffMember[] = [];
  displayedStaff: StaffMember[] = [];

  ngOnInit(): void {
    this.staff = this.permissions.filterBySite(this.staff);
    this.applyFilters();
  }

  get staffStartIndex(): number { return (this.currentPage - 1) * this.pageSize; }
  get staffEndIndex(): number   { return Math.min(this.staffStartIndex + this.pageSize, this.filteredStaff.length); }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredStaff = this.staff.filter(p =>
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
    this.displayedStaff = this.filteredStaff.slice(start, start + this.pageSize);
  }

  onSearch(): void { this.applyFilters(); }
  toggleFilterPanel(): void { this.filterPanelOpen = !this.filterPanelOpen; }
  viewPerson(person: StaffMember): void { console.log('View staff:', person); }

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
    this.currentPage = (event as any).detail || (event as any).page || event;
    this.updateDisplayedData();
  }

  navigateToNewStaff(): void {
    this.router.navigate(['/hr/staff-management/new-staff']);
  }
}
