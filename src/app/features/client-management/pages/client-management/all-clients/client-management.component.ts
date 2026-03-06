import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../../core/services/permissions.service';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  DataTableComponent, TolleCellDirective, TableColumn
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
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    SelectComponent, SelectItemComponent,
    TooltipDirective, DropdownTriggerDirective, DropdownMenuComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
    RouterLink
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  private permissions = inject(PermissionsService);
  private router = inject(Router);

  public isHrSection = false;

  columns: TableColumn[] = [
    { key: 'name', label: 'Client Name' },
    { key: 'contact', label: 'Contact Person' },
    { key: 'status', label: 'Status' },
    { key: 'contractEnd', label: 'Contract End' },
    { key: 'region', label: 'Region' },
    { key: 'actions', label: '' },
  ];

  clients: Client[] = [
    { id: 'CLT001', name: 'GoldFields Ghana Ltd.',        contactPerson: 'Kwame Asante',   contactEmail: 'k.asante@goldfields.com.gh',   status: 'Active',    contractEnd: new Date('2025-12-31'), region: 'Greater Accra' },
    { id: 'CLT002', name: 'Accra Mall Management',        contactPerson: 'Ama Boateng',     contactEmail: 'a.boateng@accramall.com',       status: 'Active',    contractEnd: new Date('2026-06-30'), region: 'Greater Accra' },
    { id: 'CLT003', name: 'Kumasi Hive Ventures',         contactPerson: 'Kofi Acheampong', contactEmail: 'k.acheampong@khi.com.gh',       status: 'Active',    contractEnd: new Date('2025-09-15'), region: 'Ashanti' },
    { id: 'CLT004', name: 'KNUST Research Institute',     contactPerson: 'Abena Frimpong',  contactEmail: 'a.frimpong@knust.edu.gh',       status: 'Suspended', contractEnd: new Date('2025-03-01'), region: 'Ashanti' },
    { id: 'CLT005', name: 'Takoradi Harbour Authority',   contactPerson: 'Yaw Entsie',      contactEmail: 'y.entsie@tha.gov.gh',           status: 'Active',    contractEnd: new Date('2026-01-31'), region: 'Western' },
    { id: 'CLT006', name: 'Ahanta West Municipal',        contactPerson: 'Efua Mensah',     contactEmail: 'e.mensah@ahantawest.gov.gh',    status: 'Active',    contractEnd: new Date('2025-11-30'), region: 'Western' },
    { id: 'CLT007', name: 'Cape Coast Teaching Hospital', contactPerson: 'Nana Arhin',      contactEmail: 'n.arhin@ccth.gov.gh',           status: 'Active',    contractEnd: new Date('2025-08-31'), region: 'Central' },
    { id: 'CLT008', name: 'Volta River Authority',        contactPerson: 'Ekow Asante',     contactEmail: 'e.asante@vra.com.gh',           status: 'Active',    contractEnd: new Date('2026-03-31'), region: 'Volta' },
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
    this.clients = this.permissions.filterByRegion(this.clients);
    if (!this.isHrSection) {
      this.columns = this.columns.filter(c => c.key !== 'actions');
    }
    this.applyFilter();
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
}
