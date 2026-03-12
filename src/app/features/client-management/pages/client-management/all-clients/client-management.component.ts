import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { GhanaRegion } from '../../../../../core/models/rbac.models';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  MultiSelectComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn,
  ModalService
} from '@tolle_/tolle-ui';

interface Client {
  id: string;
  name: string;
  contactPerson: string;
  contactEmail: string;
  status: 'Active' | 'Suspended' | 'Pending Approval' | 'Rejected';
  contractEnd: Date;
  region: GhanaRegion;
  assignedZones: GhanaRegion[];
  dateSubmitted?: Date;
  submittedBy?: string;
  dateApproved?: Date;
  approvedBy?: string;
  rejectionReason?: string;
}

@Component({
  selector: 'app-client-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    SelectComponent, SelectItemComponent,
    MultiSelectComponent,
    TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  readonly modalService = inject(ModalService);
  @ViewChild('assignZonesModal') assignZonesModal!: TemplateRef<any>;
  @ViewChild('approvalModal') approvalModal!: TemplateRef<any>;
  @ViewChild('rejectionModal') rejectionModal!: TemplateRef<any>;

  public isHrSection = false;

  // Approval workflow state
  approvingClient: Client | null = null;
  rejectingClient: Client | null = null;
  rejectionReason = '';

  // All available zones — must match GhanaRegion values
  readonly allZones: GhanaRegion[] = [
    'Greater Accra',
    'Ashanti',
    'Western',
    'Central',
    'Eastern',
    'Volta',
  ];

  // Zone assignment state
  assigningClient: Client | null = null;
  selectedZones: GhanaRegion[] = [];

  columns: TableColumn[] = [
    { key: 'name', label: 'Client Name' },
    { key: 'contact', label: 'Contact Person' },
    { key: 'status', label: 'Status' },
    { key: 'contractEnd', label: 'Contract End' },
    { key: 'region', label: 'Region' },
    { key: 'actions', label: '' },
  ];

  clients: Client[] = [
    { id: 'CLT001', name: 'GoldFields Ghana Ltd.',        contactPerson: 'Kwame Asante',   contactEmail: 'k.asante@goldfields.com.gh',   status: 'Active',    contractEnd: new Date('2025-12-31'), region: 'Greater Accra', assignedZones: ['Greater Accra'] },
    { id: 'CLT002', name: 'Accra Mall Management',        contactPerson: 'Ama Boateng',     contactEmail: 'a.boateng@accramall.com',       status: 'Active',    contractEnd: new Date('2026-06-30'), region: 'Greater Accra', assignedZones: ['Greater Accra', 'Ashanti'] },
    { id: 'CLT003', name: 'Kumasi Hive Ventures',         contactPerson: 'Kofi Acheampong', contactEmail: 'k.acheampong@khi.com.gh',       status: 'Active',    contractEnd: new Date('2025-09-15'), region: 'Ashanti',       assignedZones: ['Ashanti'] },
    { id: 'CLT004', name: 'KNUST Research Institute',     contactPerson: 'Abena Frimpong',  contactEmail: 'a.frimpong@knust.edu.gh',       status: 'Suspended', contractEnd: new Date('2025-03-01'), region: 'Ashanti',       assignedZones: [] },
    { id: 'CLT005', name: 'Takoradi Harbour Authority',   contactPerson: 'Yaw Entsie',      contactEmail: 'y.entsie@tha.gov.gh',           status: 'Active',    contractEnd: new Date('2026-01-31'), region: 'Western',       assignedZones: ['Western'] },
    { id: 'CLT006', name: 'Ahanta West Municipal',        contactPerson: 'Efua Mensah',     contactEmail: 'e.mensah@ahantawest.gov.gh',    status: 'Active',    contractEnd: new Date('2025-11-30'), region: 'Western',       assignedZones: [] },
    { id: 'CLT007', name: 'Cape Coast Teaching Hospital', contactPerson: 'Nana Arhin',      contactEmail: 'n.arhin@ccth.gov.gh',           status: 'Active',    contractEnd: new Date('2025-08-31'), region: 'Central',       assignedZones: ['Central'] },
    { id: 'CLT008', name: 'Volta River Authority',        contactPerson: 'Ekow Asante',     contactEmail: 'e.asante@vra.com.gh',           status: 'Active',    contractEnd: new Date('2026-03-31'), region: 'Volta',         assignedZones: ['Volta'] },
    // Pending approval clients
    { id: 'CLT009', name: 'Ghana Commercial Bank',        contactPerson: 'Kwame Osei',      contactEmail: 'k.osei@gcb.com.gh',             status: 'Pending Approval', contractEnd: new Date('2026-12-31'), region: 'Greater Accra', assignedZones: [], dateSubmitted: new Date('2025-03-15'), submittedBy: 'HR-001' },
    { id: 'CLT010', name: 'Tema Oil Refinery',            contactPerson: 'Ama Lawson',      contactEmail: 'a.lawson@tor.com.gh',            status: 'Pending Approval', contractEnd: new Date('2026-09-30'), region: 'Greater Accra', assignedZones: [], dateSubmitted: new Date('2025-03-20'), submittedBy: 'HR-001' },
    { id: 'CLT011', name: 'Kumasi City Mall',              contactPerson: 'Kofi Annan',      contactEmail: 'k.annan@kcm.com.gh',             status: 'Rejected', contractEnd: new Date('2026-06-30'), region: 'Ashanti', assignedZones: [], dateSubmitted: new Date('2025-03-10'), submittedBy: 'HR-001', rejectionReason: 'Incomplete business documentation provided' },
  ];

  filteredClients: Client[] = [];
  showFilterPanel = false;
  selectedStatus = 'all';
  selectedRegion = 'all';

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedRegion !== 'all') count++;
    return count;
  }

  ngOnInit(): void {
    this.isHrSection = this.router.url.startsWith('/hr/');
    
    // Load pending clients from localStorage
    this.loadPendingClients();
    
    this.clients = this.permissions.filterByRegion(this.clients);
    this.applyFilter();
  }

  private loadPendingClients(): void {
    try {
      const pendingClients = JSON.parse(localStorage.getItem('pendingClients') || '[]');
      
      // Convert localStorage data to Client interface format
      const formattedPendingClients = pendingClients.map((pc: any) => ({
        id: pc.id,
        name: pc.name,
        contactPerson: pc.contactPerson,
        contactEmail: pc.contactEmail,
        status: pc.status,
        contractEnd: new Date(pc.contractEnd),
        region: pc.region,
        assignedZones: pc.assignedZones || [],
        dateSubmitted: pc.dateSubmitted ? new Date(pc.dateSubmitted) : undefined,
        submittedBy: pc.submittedBy,
        dateApproved: pc.dateApproved ? new Date(pc.dateApproved) : undefined,
        approvedBy: pc.approvedBy,
        rejectionReason: pc.rejectionReason
      }));

      // Add to clients array, avoiding duplicates
      formattedPendingClients.forEach((pendingClient: Client) => {
        if (!this.clients.find(c => c.id === pendingClient.id)) {
          this.clients.push(pendingClient);
        }
      });
    } catch (error) {
      console.error('Error loading pending clients:', error);
    }
  }

  applyFilter(): void {
    let result = [...this.clients];
    if (this.selectedStatus !== 'all') result = result.filter(c => c.status === this.selectedStatus);
    if (this.selectedRegion !== 'all') result = result.filter(c => c.region === this.selectedRegion);
    this.filteredClients = result;
  }

  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.selectedRegion = 'all';
    this.applyFilter();
  }

  isContractEndingSoon(endDate: Date): boolean {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate >= today;
  }

  navigateToClient(client: Client): void {
    this.router.navigate(['/client/dashboard', client.id]);
  }

  navigateToViewClient(client: Client): void {
    this.router.navigate(['/hr/client-management/view-client', client.id]);
  }

  navigateToNewClient(): void {
    if (this.isHrSection) {
      this.router.navigate(['/hr/client-management/new-client']);
    }
  }

  editClient(client: Client): void {
    console.log('Edit client:', client);
  }

  openAssignZonesModal(client: Client): void {
    this.assigningClient = client;
    this.selectedZones = [...client.assignedZones];

    this.modalService.open({
      title: `Assign Zones — ${client.name}`,
      content: this.assignZonesModal,
      size: 'default',
      showCloseButton: true,
      backdropClose: true,
    });
  }

  saveZoneAssignment(): void {
    if (!this.assigningClient) return;
    this.assigningClient.assignedZones = [...this.selectedZones];
    this.assigningClient = null;
    this.modalService.closeAll();
  }

  // Approval workflow methods
  canApproveClients(): boolean {
    return this.permissions.role === 'Admin' || 
           this.permissions.role === 'GeneralManager' ||
           this.permissions.role === 'ManagingDirector' || 
           this.permissions.role === 'OperationsDirector';
  }

  openApprovalModal(client: Client): void {
    this.approvingClient = client;
    this.modalService.open({
      title: `Approve Client — ${client.name}`,
      content: this.approvalModal,
      size: 'default',
      showCloseButton: true,
      backdropClose: true,
    });
  }

  openRejectionModal(client: Client): void {
    this.rejectingClient = client;
    this.rejectionReason = '';
    this.modalService.open({
      title: `Reject Client — ${client.name}`,
      content: this.rejectionModal,
      size: 'default',
      showCloseButton: true,
      backdropClose: true,
    });
  }

  approveClient(): void {
    if (!this.approvingClient) return;
    
    const client = this.clients.find(c => c.id === this.approvingClient!.id);
    if (client) {
      client.status = 'Active';
      client.dateApproved = new Date();
      client.approvedBy = this.permissions.staffId;
      
      // Update localStorage
      this.updateClientInStorage(client);
      
      // Close approval modal
      this.approvingClient = null;
      this.modalService.closeAll();
      
      // Open zone assignment modal for newly approved client
      this.openAssignZonesModal(client);
    }
    
    this.applyFilter();
  }

  rejectClient(): void {
    if (!this.rejectingClient || !this.rejectionReason.trim()) return;
    
    const client = this.clients.find(c => c.id === this.rejectingClient!.id);
    if (client) {
      client.status = 'Rejected';
      client.rejectionReason = this.rejectionReason.trim();
      
      // Update localStorage
      this.updateClientInStorage(client);
    }
    
    this.rejectingClient = null;
    this.rejectionReason = '';
    this.modalService.closeAll();
    this.applyFilter();
  }

  private updateClientInStorage(client: Client): void {
    try {
      let pendingClients = JSON.parse(localStorage.getItem('pendingClients') || '[]');
      const index = pendingClients.findIndex((pc: any) => pc.id === client.id);
      
      if (index !== -1) {
        pendingClients[index] = {
          ...pendingClients[index],
          status: client.status,
          dateApproved: client.dateApproved,
          approvedBy: client.approvedBy,
          rejectionReason: client.rejectionReason
        };
        localStorage.setItem('pendingClients', JSON.stringify(pendingClients));
      }
    } catch (error) {
      console.error('Error updating client in storage:', error);
    }
  }

  getStatusColor(status: string): { bg: string; fg: string } {
    switch (status) {
      case 'Active':
        return { bg: 'rgba(34,197,94,0.15)', fg: '#16a34a' };
      case 'Pending Approval':
        return { bg: 'rgba(249,115,22,0.15)', fg: '#ea580c' };
      case 'Rejected':
        return { bg: 'rgba(239,68,68,0.15)', fg: '#dc2626' };
      case 'Suspended':
        return { bg: 'rgba(113,113,122,0.15)', fg: '#71717a' };
      default:
        return { bg: 'rgba(113,113,122,0.15)', fg: '#71717a' };
    }
  }

  isPendingApproval(client: Client): boolean {
    return client.status === 'Pending Approval';
  }

  canNavigateToClient(client: Client): boolean {
    // Only allow navigation to active clients
    return client.status === 'Active';
  }
}
