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
  TableColumn,
  ModalService,
  AlertDialogService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { GhanaSite } from '../../../../../core/models/rbac.models';

interface Guard {
  id: string;
  name: string;
  role: string;
  status: 'pending-approval' | 'available' | 'rejected' | 'suspended' | 'inactive';
  contact: string;
  site: GhanaSite;
  dateRegistered?: Date;
  dateApproved?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  registeredBy?: string;
}

@Component({
  selector: 'app-guard-management',
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
  templateUrl: './guard-management.component.html',
  styleUrls: ['./guard-management.component.css']
})
export class GuardManagementComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);

  isHrContext = false;

  // Check if current user can approve guards (Operations role)
  get canApproveGuards(): boolean {
    return this.permissions.role === 'OperationsDirector' || 
           this.permissions.role === 'ZonalCommander' ||
           this.permissions.role === 'Admin';
  }

  // Check if current user can register guards (HR role)
  get canRegisterGuards(): boolean {
    return this.permissions.role === 'HRManager' || 
           this.permissions.role === 'Admin';
  }

  columns: TableColumn[] = [
    { key: 'name', label: 'Guard Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
    { key: 'contact', label: 'Contact' },
    { key: 'actions', label: '' },
  ];

  guards: Guard[] = [
    { 
      id: 'GD001', name: 'Kwesi Owusu', role: 'Senior Guard', status: 'available', 
      contact: 'k.owusu@afwest.com.gh', site: 'Head Office – Accra',
      dateRegistered: new Date('2024-01-15'), dateApproved: new Date('2024-01-20'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD002', name: 'Esi Mensah', role: 'Guard Supervisor', status: 'available', 
      contact: 'e.mensah@afwest.com.gh', site: 'Kumasi Branch',
      dateRegistered: new Date('2024-01-10'), dateApproved: new Date('2024-01-15'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD003', name: 'Fiifi Aidoo', role: 'Guard', status: 'pending-approval', 
      contact: 'f.aidoo@afwest.com.gh', site: 'Head Office – Accra',
      dateRegistered: new Date('2024-03-01'), registeredBy: 'HR Manager'
    },
    { 
      id: 'GD004', name: 'Afia Nyarko', role: 'Guard', status: 'suspended', 
      contact: 'a.nyarko@afwest.com.gh', site: 'Tema Industrial',
      dateRegistered: new Date('2023-12-01'), dateApproved: new Date('2023-12-05'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD005', name: 'Yoofi Entsie', role: 'Guard', status: 'available', 
      contact: 'y.entsie@afwest.com.gh', site: 'Cape Coast Post',
      dateRegistered: new Date('2024-02-01'), dateApproved: new Date('2024-02-05'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD006', name: 'Maame Serwaa', role: 'Senior Guard', status: 'available', 
      contact: 'm.serwaa@afwest.com.gh', site: 'Head Office – Accra',
      dateRegistered: new Date('2024-01-20'), dateApproved: new Date('2024-01-25'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD007', name: 'Nii Armah', role: 'Guard', status: 'rejected', 
      contact: 'n.armah@afwest.com.gh', site: 'Kumasi Branch',
      dateRegistered: new Date('2024-02-15'), registeredBy: 'HR Manager',
      rejectionReason: 'Failed background check'
    },
    { 
      id: 'GD008', name: 'Akosua Agyare', role: 'Guard Supervisor', status: 'inactive', 
      contact: 'a.agyare@afwest.com.gh', site: 'Takoradi Branch',
      dateRegistered: new Date('2023-11-01'), dateApproved: new Date('2023-11-05'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD009', name: 'Kofi Tawiah', role: 'Guard', status: 'pending-approval', 
      contact: 'k.tawiah@afwest.com.gh', site: 'Head Office – Accra',
      dateRegistered: new Date('2024-03-05'), registeredBy: 'HR Manager'
    },
    { 
      id: 'GD010', name: 'Abena Boampong', role: 'Senior Guard', status: 'available', 
      contact: 'a.boampong@afwest.com.gh', site: 'Tema Industrial',
      dateRegistered: new Date('2024-01-25'), dateApproved: new Date('2024-01-30'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD011', name: 'Ato Hagan', role: 'Guard', status: 'available', 
      contact: 'a.hagan@afwest.com.gh', site: 'Kumasi Branch',
      dateRegistered: new Date('2024-02-10'), dateApproved: new Date('2024-02-15'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    },
    { 
      id: 'GD012', name: 'Ewuraba Piesie', role: 'Guard', status: 'available', 
      contact: 'e.piesie@afwest.com.gh', site: 'Cape Coast Post',
      dateRegistered: new Date('2024-02-20'), dateApproved: new Date('2024-02-25'),
      approvedBy: 'Operations Officer', registeredBy: 'HR Manager'
    }
  ];

  ngOnInit(): void {
    this.isHrContext = this.router.url.startsWith('/hr/');
    this.guards = this.permissions.filterBySite(this.guards);
  }

  viewGuard(guard: Guard): void {
    if (this.isHrContext) {
      this.router.navigate(['/hr/guard-management/view-guard', guard.id]);
    }
  }

  navigateToNewGuard(): void {
    this.router.navigate(['/hr/guard-management/new-guard']);
  }

  approveGuard(guard: Guard): void {
    const dialogRef = this.alertDialog.open({
      title: 'Approve Guard',
      description: `Are you sure you want to approve ${guard.name} (${guard.id}) for deployment?`,
      actionText: 'Approve',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        // Update guard status to available
        guard.status = 'available';
        guard.dateApproved = new Date();
        guard.approvedBy = this.permissions.displayName;
        
        console.log('Guard approved:', guard);
        // In a real app, this would make an API call
      }
    });
  }

  rejectGuard(guard: Guard): void {
    const dialogRef = this.alertDialog.open({
      title: 'Reject Guard',
      description: `Are you sure you want to reject ${guard.name} (${guard.id})?`,
      actionText: 'Reject',
      variant: 'destructive'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        // Update guard status to rejected
        guard.status = 'rejected';
        guard.rejectionReason = 'Rejected by Operations Officer';
        
        console.log('Guard rejected:', guard);
        // In a real app, this would make an API call
      }
    });
  }

  getStatusColor(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
    const colorMap: { [key: string]: 'default' | 'destructive' | 'outline' | 'secondary' } = {
      'pending-approval': 'outline',
      'available': 'default',
      'rejected': 'destructive',
      'suspended': 'secondary',
      'inactive': 'secondary'
    };
    return colorMap[status] || 'secondary';
  }

  getStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      'pending-approval': 'Pending Approval',
      'available': 'Available',
      'rejected': 'Rejected',
      'suspended': 'Suspended',
      'inactive': 'Inactive'
    };
    return textMap[status] || status;
  }
}
