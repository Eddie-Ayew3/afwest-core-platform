import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ButtonComponent,
  BadgeComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  DataTableComponent,
  TolleCellDirective,
  TableColumn
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
    ButtonComponent,
    BadgeComponent,
    TooltipDirective,
    DropdownTriggerDirective,
    DropdownMenuComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    DataTableComponent,
    TolleCellDirective
  ],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.css']
})
export class StaffManagementComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);

  columns: TableColumn[] = [
    { key: 'name', label: 'Staff Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'contact', label: 'Contact' },
    { key: 'actions', label: '' },
  ];

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

  ngOnInit(): void {
    this.staff = this.permissions.filterBySite(this.staff);
  }

  viewPerson(person: StaffMember): void {
    this.router.navigate(['/hr/staff-management/view-staff', person.id]);
  }

  navigateToNewStaff(): void {
    this.router.navigate(['/hr/staff-management/new-staff']);
  }
}
