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
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { GhanaSite } from '../../../../../core/models/rbac.models';

interface Guard {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  contact: string;
  site: GhanaSite;
}

@Component({
  selector: 'app-guard-management',
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
  templateUrl: './guard-management.component.html',
  styleUrls: ['./guard-management.component.css']
})
export class GuardManagementComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);

  // true when accessed from /hr/guard-management, false when from client/guard/:id
  isHrContext = false;

  searchQuery = '';
  activeFilterCount = 0;
  filterPanelOpen = false;
  pageSize = 10;
  currentPage = 1;

  guards: Guard[] = [
    { id: 'GD001', name: 'Kwesi Owusu',    role: 'Senior Guard',     status: 'Active',    contact: 'k.owusu@afwest.com.gh',    site: 'Head Office – Accra' },
    { id: 'GD002', name: 'Esi Mensah',     role: 'Guard Supervisor', status: 'Active',    contact: 'e.mensah@afwest.com.gh',   site: 'Kumasi Branch' },
    { id: 'GD003', name: 'Fiifi Aidoo',    role: 'Guard',            status: 'Active',    contact: 'f.aidoo@afwest.com.gh',    site: 'Head Office – Accra' },
    { id: 'GD004', name: 'Afia Nyarko',    role: 'Guard',            status: 'Suspended', contact: 'a.nyarko@afwest.com.gh',   site: 'Tema Industrial' },
    { id: 'GD005', name: 'Yoofi Entsie',   role: 'Guard',            status: 'Active',    contact: 'y.entsie@afwest.com.gh',   site: 'Cape Coast Post' },
    { id: 'GD006', name: 'Maame Serwaa',   role: 'Senior Guard',     status: 'Active',    contact: 'm.serwaa@afwest.com.gh',   site: 'Head Office – Accra' },
    { id: 'GD007', name: 'Nii Armah',      role: 'Guard',            status: 'Active',    contact: 'n.armah@afwest.com.gh',    site: 'Kumasi Branch' },
    { id: 'GD008', name: 'Akosua Agyare',  role: 'Guard Supervisor', status: 'Inactive',  contact: 'a.agyare@afwest.com.gh',   site: 'Takoradi Branch' },
    { id: 'GD009', name: 'Kofi Tawiah',    role: 'Guard',            status: 'Active',    contact: 'k.tawiah@afwest.com.gh',   site: 'Head Office – Accra' },
    { id: 'GD010', name: 'Abena Boampong', role: 'Senior Guard',     status: 'Active',    contact: 'a.boampong@afwest.com.gh', site: 'Tema Industrial' },
    { id: 'GD011', name: 'Ato Hagan',      role: 'Guard',            status: 'Active',    contact: 'a.hagan@afwest.com.gh',    site: 'Kumasi Branch' },
    { id: 'GD012', name: 'Ewuraba Piesie', role: 'Guard',            status: 'Active',    contact: 'e.piesie@afwest.com.gh',   site: 'Cape Coast Post' },
  ];

  filteredGuards: Guard[] = [];
  displayedGuards: Guard[] = [];

  ngOnInit(): void {
    this.isHrContext = this.router.url.startsWith('/hr/');
    this.guards = this.permissions.filterBySite(this.guards);
    this.applyFilters();
  }

  get guardStartIndex(): number { return (this.currentPage - 1) * this.pageSize; }
  get guardEndIndex(): number   { return Math.min(this.guardStartIndex + this.pageSize, this.filteredGuards.length); }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredGuards = this.guards.filter(g =>
      g.name.toLowerCase().includes(query) ||
      g.role.toLowerCase().includes(query) ||
      g.id.toLowerCase().includes(query) ||
      g.contact.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updateDisplayedData();
  }

  updateDisplayedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedGuards = this.filteredGuards.slice(start, start + this.pageSize);
  }

  onSearch(): void { this.applyFilters(); }
  toggleFilterPanel(): void { this.filterPanelOpen = !this.filterPanelOpen; }
  viewGuard(guard: Guard): void {
    if (this.isHrContext) {
      this.router.navigate(['/hr/guard-management/view-guard', guard.id]);
    }
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
    this.currentPage = (event as any).detail || (event as any).page || event;
    this.updateDisplayedData();
  }

  navigateToNewGuard(): void {
    this.router.navigate(['/hr/guard-management/new-guard']);
  }
}
