import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../../core/services/permissions.service';
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
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ModalService
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
    RouterLink
  ],
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css']
})
export class ClientManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private permissions = inject(PermissionsService);
  private router = inject(Router);
  @ViewChild('newClientModal') newClientModal!: TemplateRef<any>;

  public isHrSection: boolean = false;

  clients: Client[] = [
    { id: 'CLT001', name: 'GoldFields Ghana Ltd.',       contactPerson: 'Kwame Asante',    contactEmail: 'k.asante@goldfields.com.gh',    status: 'Active',    contractEnd: new Date('2025-12-31'), region: 'Greater Accra' },
    { id: 'CLT002', name: 'Accra Mall Management',       contactPerson: 'Ama Boateng',      contactEmail: 'a.boateng@accramall.com',        status: 'Active',    contractEnd: new Date('2026-06-30'), region: 'Greater Accra' },
    { id: 'CLT003', name: 'Kumasi Hive Ventures',        contactPerson: 'Kofi Acheampong',  contactEmail: 'k.acheampong@khi.com.gh',        status: 'Active',    contractEnd: new Date('2025-09-15'), region: 'Ashanti' },
    { id: 'CLT004', name: 'KNUST Research Institute',    contactPerson: 'Abena Frimpong',   contactEmail: 'a.frimpong@knust.edu.gh',        status: 'Suspended', contractEnd: new Date('2025-03-01'), region: 'Ashanti' },
    { id: 'CLT005', name: 'Takoradi Harbour Authority',  contactPerson: 'Yaw Entsie',       contactEmail: 'y.entsie@tha.gov.gh',            status: 'Active',    contractEnd: new Date('2026-01-31'), region: 'Western' },
    { id: 'CLT006', name: 'Ahanta West Municipal',       contactPerson: 'Efua Mensah',      contactEmail: 'e.mensah@ahantawest.gov.gh',     status: 'Active',    contractEnd: new Date('2025-11-30'), region: 'Western' },
    { id: 'CLT007', name: 'Cape Coast Teaching Hospital',contactPerson: 'Nana Arhin',       contactEmail: 'n.arhin@ccth.gov.gh',            status: 'Active',    contractEnd: new Date('2025-08-31'), region: 'Central' },
    { id: 'CLT008', name: 'Volta River Authority',       contactPerson: 'Ekow Asante',      contactEmail: 'e.asante@vra.com.gh',            status: 'Active',    contractEnd: new Date('2026-03-31'), region: 'Volta' },
  ];

  filteredClients: Client[] = [];
  displayedClients: Client[] = [];

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  // Filters
  selectedStatus: string = 'all';
  selectedRegion: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor() {}

  ngOnInit(): void {
    this.isHrSection = this.router.url.startsWith('/hr/');
    this.clients = this.permissions.filterByRegion(this.clients);
    this.applyFilters();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredClients.length);
  }

  applyFilters(): void {
    let result = [...this.clients];

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.contactPerson.toLowerCase().includes(query) ||
        client.region.toLowerCase().includes(query) ||
        client.contactEmail.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(client => client.status === this.selectedStatus);
    }

    // Region filter
    if (this.selectedRegion !== 'all') {
      result = result.filter(client => client.region === this.selectedRegion);
    }

    this.filteredClients = result;
    this.updateActiveFilterCount();
    this.currentPage = 1;
    this.updateDisplayedClients();
  }

  updateDisplayedClients(): void {
    this.displayedClients = this.filteredClients.slice(this.startIndex, this.endIndex);
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedRegion !== 'all') count++;
    this.activeFilterCount = count;
  }

  onSearch(): void {
    this.applyFilters();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'all';
    this.selectedRegion = 'all';
    this.applyFilters();
  }

  isContractEndingSoon(endDate: Date): boolean {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return endDate <= thirtyDaysFromNow && endDate >= today;
  }

  openNewClientDialog(): void {
    const modalRef = this.modalService.open({
      title: 'Add New Client',
      content: this.newClientModal,
      size: 'default'
    });

    modalRef.afterClosed$.subscribe((result: any) => {
      if (result?.success) {
        console.log('New client added successfully');
      }
    });
  }

  navigateToClient(client: Client): void {
    this.router.navigate(['/client/dashboard', client.id]);
  }

  editClient(client: Client): void {
    console.log('Edit client:', client);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedClients();
  }

  onPageChange(event: any): void {
    this.currentPage = event;
    this.updateDisplayedClients();
  }
}