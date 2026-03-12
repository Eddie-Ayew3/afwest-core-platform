import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent, ButtonComponent, BadgeComponent, DataTableComponent, TolleCellDirective, TableColumn, ModalService, AlertDialogService, BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent, InputComponent } from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../core/services/permissions.service';

interface Guard {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'assigned' | 'pending-approval' | 'rejected' | 'suspended' | 'inactive';
  contact: string;
  site?: string;
  client?: string;
  zone?: string;
}

interface Site {
  id: string;
  name: string;
  client: string;
  zone: string;
  requiredGuards: number;
  assignedGuards: Guard[];
  status: 'active' | 'inactive';
}

interface Assignment {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  clientId: string;
  clientName: string;
  zone: string;
  dateAssigned: Date;
  assignedBy: string;
  status: 'active' | 'ended';
}

@Component({
  selector: 'app-guard-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    DataTableComponent,
    TolleCellDirective,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    InputComponent
],
  templateUrl: './guard-assignment.component.html',
  styleUrls: ['./guard-assignment.component.css']
})
export class GuardAssignmentComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);

  // Check if user can assign guards (Zonal Officer role)
  get canAssignGuards(): boolean {
    return this.permissions.role === 'ZonalCommander' || 
           this.permissions.role === 'OperationsDirector' ||
           this.permissions.role === 'Admin';
  }

  // Current context
  currentSiteId: string | null = null;
  currentClientId: string | null = null;
  
  // Assignment state
  selectedGuards: string[] = [];
  availableGuards: Guard[] = [];
  siteDetails: Site | null = null;
  currentAssignments: Assignment[] = [];

  // Data tables
  guardColumns: TableColumn[] = [
    { key: 'guardInfo', label: 'Guard Information' },
    { key: 'status', label: 'Status' },
    { key: 'contact', label: 'Contact' },
    { key: 'actions', label: 'Actions' }
  ];

  assignmentColumns: TableColumn[] = [
    { key: 'guardName', label: 'Guard Name' },
    { key: 'siteName', label: 'Site' },
    { key: 'clientName', label: 'Client' },
    { key: 'dateAssigned', label: 'Date Assigned' },
    { key: 'assignedBy', label: 'Assigned By' },
    { key: 'status', label: 'Status' }
  ];

  // Mock data
  sites: Site[] = [
    {
      id: 'ST001',
      name: 'Ecobank Airport Branch',
      client: 'Ecobank Ghana',
      zone: 'Greater Accra',
      requiredGuards: 4,
      assignedGuards: [],
      status: 'active'
    },
    {
      id: 'ST002',
      name: 'Ecobank Osu Branch',
      client: 'Ecobank Ghana',
      zone: 'Greater Accra',
      requiredGuards: 3,
      assignedGuards: [],
      status: 'active'
    },
    {
      id: 'ST003',
      name: 'Ecobank Kumasi Main',
      client: 'Ecobank Ghana',
      zone: 'Ashanti',
      requiredGuards: 5,
      assignedGuards: [],
      status: 'active'
    }
  ];

  guards: Guard[] = [
    { id: 'GD001', name: 'Kwesi Owusu', role: 'Senior Guard', status: 'available', contact: 'k.owusu@afwest.com.gh' },
    { id: 'GD002', name: 'Esi Mensah', role: 'Guard Supervisor', status: 'available', contact: 'e.mensah@afwest.com.gh' },
    { id: 'GD003', name: 'Fiifi Aidoo', role: 'Guard', status: 'available', contact: 'f.aidoo@afwest.com.gh' },
    { id: 'GD004', name: 'Afia Nyarko', role: 'Guard', status: 'assigned', contact: 'a.nyarko@afwest.com.gh', site: 'ST001', client: 'Ecobank Ghana', zone: 'Greater Accra' },
    { id: 'GD005', name: 'Yoofi Entsie', role: 'Guard', status: 'available', contact: 'y.entsie@afwest.com.gh' },
    { id: 'GD006', name: 'Maame Serwaa', role: 'Senior Guard', status: 'available', contact: 'm.serwaa@afwest.com.gh' },
    { id: 'GD007', name: 'Nii Armah', role: 'Guard', status: 'assigned', contact: 'n.armah@afwest.com.gh', site: 'ST002', client: 'Ecobank Ghana', zone: 'Greater Accra' },
    { id: 'GD008', name: 'Akosua Agyare', role: 'Guard Supervisor', status: 'available', contact: 'a.agyare@afwest.com.gh' }
  ];

  assignments: Assignment[] = [
    {
      id: 'ASG001',
      guardId: 'GD004',
      guardName: 'Afia Nyarko',
      siteId: 'ST001',
      siteName: 'Ecobank Airport Branch',
      clientId: 'CLT001',
      clientName: 'Ecobank Ghana',
      zone: 'Greater Accra',
      dateAssigned: new Date('2024-03-01'),
      assignedBy: 'Zonal Commander - Accra',
      status: 'active'
    },
    {
      id: 'ASG002',
      guardId: 'GD007',
      guardName: 'Nii Armah',
      siteId: 'ST002',
      siteName: 'Ecobank Osu Branch',
      clientId: 'CLT001',
      clientName: 'Ecobank Ghana',
      zone: 'Greater Accra',
      dateAssigned: new Date('2024-03-05'),
      assignedBy: 'Zonal Commander - Accra',
      status: 'active'
    }
  ];

  ngOnInit(): void {
    // Get site ID from route parameters
    this.route.paramMap.subscribe(params => {
      this.currentSiteId = params.get('siteId');
      this.currentClientId = params.get('clientId');
      
      if (this.currentSiteId) {
        this.loadSiteDetails(this.currentSiteId);
      }
    });

    this.loadAvailableGuards();
    this.loadAssignments();
  }

  loadSiteDetails(siteId: string): void {
    this.siteDetails = this.sites.find(site => site.id === siteId) || null;
    
    if (this.siteDetails) {
      // Filter data by user's zone permissions
      if (!this.permissions.isGlobal() && this.siteDetails.zone !== this.permissions.region) {
        this.router.navigate(['/dashboard']);
        return;
      }
    }
  }

  loadAvailableGuards(): void {
    // Filter guards by user's zone and availability
    this.availableGuards = this.guards.filter(guard => {
      const isAvailable = guard.status === 'available';
      const isInZone = this.permissions.isGlobal() || 
                      !guard.zone || 
                      guard.zone === this.permissions.region;
      return isAvailable && isInZone;
    });
  }

  loadAssignments(): void {
    // Filter assignments by user's zone permissions
    this.currentAssignments = this.assignments.filter(assignment => {
      return this.permissions.isGlobal() || 
             assignment.zone === this.permissions.region;
    });
  }

  toggleGuardSelection(guardId: string): void {
    const index = this.selectedGuards.indexOf(guardId);
    if (index > -1) {
      this.selectedGuards.splice(index, 1);
    } else {
      this.selectedGuards.push(guardId);
    }
  }

  isGuardSelected(guardId: string): boolean {
    return this.selectedGuards.includes(guardId);
  }

  assignSelectedGuards(): void {
    if (!this.siteDetails || this.selectedGuards.length === 0) return;

    const dialogRef = this.alertDialog.open({
      title: 'Assign Guards',
      description: `Assign ${this.selectedGuards.length} guard(s) to ${this.siteDetails.name}?`,
      actionText: 'Assign Guards',
      variant: 'default'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.performAssignment();
      }
    });
  }

  private performAssignment(): void {
    if (!this.siteDetails) return;
    
    const siteDetails = this.siteDetails!; // Non-null assertion after check

    this.selectedGuards.forEach(guardId => {
      const guard = this.guards.find(g => g.id === guardId);
      if (guard) {
        // Update guard status
        guard.status = 'assigned';
        guard.site = siteDetails.id;
        guard.client = siteDetails.client;
        guard.zone = siteDetails.zone;

        // Create assignment record
        const assignment: Assignment = {
          id: `ASG${Date.now()}`,
          guardId: guard.id,
          guardName: guard.name,
          siteId: siteDetails.id,
          siteName: siteDetails.name,
          clientId: this.getClientIdByName(siteDetails.client),
          clientName: siteDetails.client,
          zone: siteDetails.zone,
          dateAssigned: new Date(),
          assignedBy: this.permissions.displayName,
          status: 'active'
        };

        this.currentAssignments.push(assignment);
        siteDetails.assignedGuards.push(guard);
      }
    });

    // Clear selection and refresh data
    this.selectedGuards = [];
    this.loadAvailableGuards();
    
    console.log('Guards assigned successfully');
  }

  private getClientIdByName(clientName: string): string {
    // In a real app, this would be a proper lookup
    return 'CLT001'; // Placeholder
  }

  removeAssignment(assignment: Assignment): void {
    const dialogRef = this.alertDialog.open({
      title: 'Remove Assignment',
      description: `Remove ${assignment.guardName} from ${assignment.siteName}?`,
      actionText: 'Remove',
      variant: 'destructive'
    });

    dialogRef.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.performRemoval(assignment);
      }
    });
  }

  private performRemoval(assignment: Assignment): void {
    // Update guard status back to available
    const guard = this.guards.find(g => g.id === assignment.guardId);
    if (guard) {
      guard.status = 'available';
      guard.site = undefined;
      guard.client = undefined;
      guard.zone = undefined;
    }

    // Remove assignment record
    const index = this.currentAssignments.findIndex(a => a.id === assignment.id);
    if (index > -1) {
      this.currentAssignments.splice(index, 1);
    }

    // Update site assigned guards
    if (this.siteDetails) {
      const siteGuardIndex = this.siteDetails.assignedGuards.findIndex(g => g.id === assignment.guardId);
      if (siteGuardIndex > -1) {
        this.siteDetails.assignedGuards.splice(siteGuardIndex, 1);
      }
    }

    this.loadAvailableGuards();
    console.log('Assignment removed successfully');
  }

  getStatusColor(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
    const colorMap: { [key: string]: 'default' | 'destructive' | 'outline' | 'secondary' } = {
      'available': 'default',
      'assigned': 'outline',
      'pending-approval': 'secondary',
      'rejected': 'destructive',
      'suspended': 'secondary',
      'inactive': 'secondary',
      'active': 'default',
      'ended': 'secondary'
    };
    return colorMap[status] || 'secondary';
  }

  getStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      'available': 'Available',
      'assigned': 'Assigned',
      'pending-approval': 'Pending Approval',
      'rejected': 'Rejected',
      'suspended': 'Suspended',
      'inactive': 'Inactive',
      'active': 'Active',
      'ended': 'Ended'
    };
    return textMap[status] || status;
  }

  getAssignmentProgress(): number {
    if (!this.siteDetails) return 0;
    return (this.siteDetails.assignedGuards.length / this.siteDetails.requiredGuards) * 100;
  }

  getGuardsNeeded(): number {
    if (!this.siteDetails) return 0;
    return Math.max(0, this.siteDetails.requiredGuards - this.siteDetails.assignedGuards.length);
  }

  navigateToClientDashboard(): void {
    if (this.currentClientId) {
      this.router.navigate(['/client-management', this.currentClientId]);
    }
  }

  navigateToSiteManagement(): void {
    if (this.currentClientId) {
      this.router.navigate(['/client-management', this.currentClientId, 'sites']);
    }
  }
}
