import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CardComponent,

  CardContentComponent,
  ButtonComponent,
  InputComponent,
  TextareaComponent,
  BadgeComponent,
  SelectComponent,
  SelectItemComponent,
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

export interface Site {
  id: string;
  name: string;
  code: string;
  type: 'headquarters' | 'branch' | 'sub-branch' | 'atm' | 'agency';
  region: string;
  district: string;
  city: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contact: {
    phone: string;
    email: string;
    manager: string;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'under-construction';
  staffCount: number;
  guardCount: number;
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
  services: string[];
  establishedDate: Date;
  lastInspectionDate?: Date;
  zonalCommander?: string;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface Region {
  id: string;
  name: string;
  code: string;
  capital: string;
  siteCount: number;
  activeGuards: number;
  zonalCommander: string;
}

@Component({
  selector: 'app-site-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    CardContentComponent,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
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
    LabelComponent,
  ],
  templateUrl: './site-management.component.html',
  styleUrls: ['./site-management.component.css']
})
export class SiteManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('newSiteModal') newSiteModal!: TemplateRef<any>;

  // Mock data for Ecobank branches across Ghana regions
  regions: Region[] = [
    { id: 'ASH', name: 'Ashanti Region', code: 'ASH', capital: 'Kumasi', siteCount: 8, activeGuards: 45, zonalCommander: 'Commander Kwame Asante' },
    { id: 'GAA', name: 'Greater Accra', code: 'GAA', capital: 'Accra', siteCount: 12, activeGuards: 68, zonalCommander: 'Commander Ama Mensah' },
    { id: 'BAH', name: 'Brong-Ahafo', code: 'BAH', capital: 'Sunyani', siteCount: 5, activeGuards: 28, zonalCommander: 'Commander Kofi Yeboah' },
    { id: 'CEN', name: 'Central Region', code: 'CEN', capital: 'Cape Coast', siteCount: 6, activeGuards: 32, zonalCommander: 'Commander Yaw Osei' },
    { id: 'EAS', name: 'Eastern Region', code: 'EAS', capital: 'Koforidua', siteCount: 7, activeGuards: 38, zonalCommander: 'Commander Kwabena Agyei' },
    { id: 'VOL', name: 'Volta Region', code: 'VOL', capital: 'Ho', siteCount: 4, activeGuards: 22, zonalCommander: 'Commander Komla Gbekor' },
    { id: 'WES', name: 'Western Region', code: 'WES', capital: 'Takoradi', siteCount: 6, activeGuards: 34, zonalCommander: 'Commander Joana Brown' },
    { id: 'UPE', name: 'Upper East', code: 'UPE', capital: 'Bolgatanga', siteCount: 3, activeGuards: 16, zonalCommander: 'Commander Abugri Thomas' },
    { id: 'UPW', name: 'Upper West', code: 'UPW', capital: 'Wa', siteCount: 2, activeGuards: 12, zonalCommander: 'Commander Iddrisu Mohammed' },
    { id: 'NOR', name: 'Northern Region', code: 'NOR', capital: 'Tamale', siteCount: 5, activeGuards: 26, zonalCommander: 'Commander Abdul Karim' }
  ];

  sites: Site[] = [
    // Greater Accra Region
    {
      id: 'ECB-HQ-001',
      name: 'Ecobank Ghana Headquarters',
      code: 'HQ',
      type: 'headquarters',
      region: 'Greater Accra',
      district: 'Accra',
      city: 'Accra',
      address: '23 Independence Avenue, Accra',
      coordinates: { latitude: 5.6037, longitude: -0.1870 },
      contact: {
        phone: '+233-302-660-000',
        email: 'hq@ecobank.com.gh',
        manager: 'Mr. Daniel Sackey'
      },
      status: 'active',
      staffCount: 450,
      guardCount: 25,
      operatingHours: {
        weekdays: '8:00 AM - 4:00 PM',
        weekends: '9:00 AM - 1:00 PM'
      },
      services: ['Corporate Banking', 'Retail Banking', 'Treasury', 'Trade Finance'],
      establishedDate: new Date('1990-03-15'),
      lastInspectionDate: new Date('2024-02-10'),
      securityLevel: 'critical'
    },
    {
      id: 'ECB-ACC-002',
      name: 'Ecobank Accra Central',
      code: 'ACC-001',
      type: 'branch',
      region: 'Greater Accra',
      district: 'Accra',
      city: 'Accra',
      address: 'High Street, Accra Central',
      contact: {
        phone: '+233-302-665-100',
        email: 'accra.central@ecobank.com.gh',
        manager: 'Mrs. Grace Ansah'
      },
      status: 'active',
      staffCount: 28,
      guardCount: 8,
      operatingHours: {
        weekdays: '8:30 AM - 4:30 PM',
        weekends: 'Closed'
      },
      services: ['Retail Banking', 'ATM Services'],
      establishedDate: new Date('1995-06-20'),
      securityLevel: 'high'
    },
    // Ashanti Region
    {
      id: 'ECB-KUM-001',
      name: 'Ecobank Kumasi Main',
      code: 'KUM-001',
      type: 'branch',
      region: 'Ashanti',
      district: 'Kumasi',
      city: 'Kumasi',
      address: 'Adum Kumasi, Near Kejetia Market',
      coordinates: { latitude: 6.6881, longitude: -1.6244 },
      contact: {
        phone: '+233-322-202-400',
        email: 'kumasi.main@ecobank.com.gh',
        manager: 'Mr. Yaw Owusu'
      },
      status: 'active',
      staffCount: 35,
      guardCount: 12,
      operatingHours: {
        weekdays: '8:00 AM - 4:00 PM',
        weekends: '9:00 AM - 1:00 PM'
      },
      services: ['Retail Banking', 'Business Banking', 'ATM Services'],
      establishedDate: new Date('1992-11-10'),
      lastInspectionDate: new Date('2024-01-15'),
      securityLevel: 'high',
      zonalCommander: 'Commander Kwame Asante'
    },
    {
      id: 'ECB-KUM-002',
      name: 'Ecobank Asokwa',
      code: 'KUM-002',
      type: 'sub-branch',
      region: 'Ashanti',
      district: 'Kumasi',
      city: 'Kumasi',
      address: 'Asokwa New Road, Kumasi',
      contact: {
        phone: '+233-322-202-401',
        email: 'asokwa@ecobank.com.gh',
        manager: 'Mrs. Akua Mensah'
      },
      status: 'active',
      staffCount: 15,
      guardCount: 6,
      operatingHours: {
        weekdays: '8:30 AM - 4:30 PM',
        weekends: 'Closed'
      },
      services: ['Retail Banking', 'ATM Services'],
      establishedDate: new Date('2005-03-22'),
      securityLevel: 'medium',
      zonalCommander: 'Commander Kwame Asante'
    },
    // Central Region
    {
      id: 'ECB-CAPE-001',
      name: 'Ecobank Cape Coast',
      code: 'CAPE-001',
      type: 'branch',
      region: 'Central',
      district: 'Cape Coast',
      city: 'Cape Coast',
      address: 'Main Market Area, Cape Coast',
      coordinates: { latitude: 5.1451, longitude: -1.2591 },
      contact: {
        phone: '+233-332-132-000',
        email: 'cape.coast@ecobank.com.gh',
        manager: 'Mr. Kweku Annan'
      },
      status: 'active',
      staffCount: 22,
      guardCount: 8,
      operatingHours: {
        weekdays: '8:00 AM - 4:00 PM',
        weekends: '9:00 AM - 1:00 PM'
      },
      services: ['Retail Banking', 'ATM Services'],
      establishedDate: new Date('1998-08-15'),
      lastInspectionDate: new Date('2024-02-05'),
      securityLevel: 'medium',
      zonalCommander: 'Commander Yaw Osei'
    }
  ];

  filteredSites: Site[] = [];
  displayedSites: Site[] = [];
  currentUserRole: 'head-office' | 'zonal-commander' = 'head-office'; // This would come from auth service
  currentUserRegion?: string; // Would be set based on logged-in user

  searchQuery: string = '';
  showFilterPanel: boolean = false;
  activeFilterCount: number = 0;

  // Filters
  selectedRegion: string = 'all';
  selectedStatus: string = 'all';
  selectedType: string = 'all';
  selectedSecurityLevel: string = 'all';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  constructor() {
    // Simulate setting user region (in real app, this would come from auth service)
    this.currentUserRegion = 'Ashanti'; // Simulating zonal commander for Ashanti
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.filteredSites.length);
  }

  applyFilters(): void {
    let result = [...this.sites];

    // Apply region filter based on user role
    if (this.currentUserRole === 'zonal-commander' && this.currentUserRegion) {
      result = result.filter(site => site.region === this.currentUserRegion);
    } else if (this.selectedRegion !== 'all') {
      result = result.filter(site => site.region === this.selectedRegion);
    }

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(site =>
        site.name.toLowerCase().includes(query) ||
        site.code.toLowerCase().includes(query) ||
        site.city.toLowerCase().includes(query) ||
        site.address.toLowerCase().includes(query) ||
        site.contact.manager.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(site => site.status === this.selectedStatus);
    }

    // Type filter
    if (this.selectedType !== 'all') {
      result = result.filter(site => site.type === this.selectedType);
    }

    // Security level filter
    if (this.selectedSecurityLevel !== 'all') {
      result = result.filter(site => site.securityLevel === this.selectedSecurityLevel);
    }

    this.filteredSites = result;
    this.updateActiveFilterCount();
    this.currentPage = 1;
    this.updateDisplayedSites();
  }

  updateDisplayedSites(): void {
    this.displayedSites = this.filteredSites.slice(this.startIndex, this.endIndex);
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedRegion !== 'all') count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.selectedType !== 'all') count++;
    if (this.selectedSecurityLevel !== 'all') count++;
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
    this.selectedRegion = 'all';
    this.selectedStatus = 'all';
    this.selectedType = 'all';
    this.selectedSecurityLevel = 'all';
    this.applyFilters();
  }

  getSiteTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'headquarters': 'ri-building-line',
      'branch': 'ri-bank-line',
      'sub-branch': 'ri-store-line',
      'atm': 'ri-bank-card-line',
      'agency': 'ri-briefcase-line'
    };
    return iconMap[type] || 'ri-building-line';
  }

  getSecurityLevelColor(level: string): string {
    const colorMap: { [key: string]: string } = {
      'low': 'secondary',
      'medium': 'default',
      'high': 'secondary',
      'critical': 'destructive'
    };
    return colorMap[level] || 'default';
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'active': 'default',
      'inactive': 'secondary',
      'maintenance': 'secondary',
      'under-construction': 'destructive'
    };
    return colorMap[status] || 'default';
  }

  getRegionById(regionId: string): Region | undefined {
    return this.regions.find(region => region.id === regionId);
  }

  viewSiteDetails(site: Site): void {
    console.log('View site details:', site);
  }

  editSite(site: Site): void {
    console.log('Edit site:', site);
  }

  viewSiteOnMap(site: Site): void {
    if (site.coordinates) {
      console.log('View on map:', site.coordinates);
      // In real app, this would open a map view
    }
  }

  openNewSiteDialog(){
    const modalRef = this.modalService.open({
      title: 'Add New Site',
      content: this.newSiteModal,
      size: 'lg',
      showCloseButton: true,
      backdropClose: true,

    });

    modalRef.afterClosed$.subscribe((result: any) => {
      if (result?.success) {
        console.log('New site added successfully');
      }
    });
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.updateDisplayedSites();
  }

  onPageChange(event: any): void {
    this.currentPage = event;
    this.updateDisplayedSites();
  }

  switchUserRole(): void {
    // For testing purposes - switch between head-office and zonal-commander
    this.currentUserRole = this.currentUserRole === 'head-office' ? 'zonal-commander' : 'head-office';
    this.applyFilters();
  }
}
