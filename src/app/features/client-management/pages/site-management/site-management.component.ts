import { Component, OnInit, inject, ViewChild, TemplateRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  InputComponent,
  TextareaComponent,
  BadgeComponent,
  SelectComponent,
  SelectItemComponent,
  TooltipDirective,
  DropdownTriggerDirective,
  LabelComponent,
  DropdownMenuComponent,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbLinkComponent,
  BreadcrumbSeparatorComponent,
  ModalService,
  DataTableComponent,
  TolleCellDirective,
  TableColumn,
  SheetComponent,
  SheetContentComponent,
  AlertDialogService,
  ToastService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../core/services/permissions.service';
//import { MapComponent } from './map/map.component';

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
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    SelectComponent,
    SelectItemComponent,
    TooltipDirective,
    DropdownTriggerDirective,
    DropdownMenuComponent,
    BreadcrumbComponent,
    BreadcrumbItemComponent,
    BreadcrumbLinkComponent,
    BreadcrumbSeparatorComponent,
    LabelComponent,
    DataTableComponent,
    TolleCellDirective,
    SheetComponent,
    SheetContentComponent,
  ],
  templateUrl: './site-management.component.html',
  styleUrls: ['./site-management.component.css']
})
export class SiteManagementComponent implements OnInit {
  modalService = inject(ModalService);
  private permissions = inject(PermissionsService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('newSiteModal') newSiteModal!: TemplateRef<any>;

  // User's assigned zone for site creation permissions
  get userZone(): string {
    return this.permissions.site || '';
  }

  get userRegion(): string {
    return this.permissions.region || '';
  }

  // Check if user can create sites in a specific region
  canCreateSiteInRegion(region: string): boolean {
    if (this.permissions.role === 'Admin' || this.permissions.role === 'GeneralManager') {
      return true; // Admin and GM can create sites anywhere
    }
    
    // Zonal officers can only create sites in their assigned zone
    return this.permissions.isGlobal() || this.permissions.region === region;
  }

  // Filter sites based on user's zone/region permissions
  get allowedSites(): Site[] {
    if (this.permissions.role === 'Admin' || this.permissions.role === 'GeneralManager') {
      return this.sites; // Admin and GM see all sites
    }
    
    // Filter sites by user's region/zone
    return this.sites.filter(site => site.region === this.permissions.region);
  }

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
      coordinates: { latitude: 5.5487, longitude: -0.2019 },
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
      coordinates: { latitude: 6.6701, longitude: -1.6100 },
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
  currentUserRole: 'head-office' | 'zonal-commander' = 'head-office'; // This would come from auth service
  currentUserRegion?: string; // Would be set based on logged-in user

  // Filter properties
  selectedType = 'all';
  selectedSecurityLevel = 'all';
  selectedRegion = 'all';
  selectedStatus = 'all';
  searchQuery = '';
  showFilterPanel = false;
  activeFilterCount = 0;

  columns: TableColumn[] = [
    { key: 'siteInfo', label: 'Site Info' },
    { key: 'location', label: 'Location' },
    { key: 'contact', label: 'Contact' },
    { key: 'staff', label: 'Staff' },
    { key: 'security', label: 'Security' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' }
  ];

  

  // Map sheet
  showMapSheet = false;
  selectedSite: Site | null = null;

  // New site form state
  newSiteForm: { name: string; code: string; type: Site['type'] | ''; region: string; city: string; address: string; securityLevel: Site['securityLevel'] | '' } = {
    name: '', code: '', type: '', region: '', city: '', address: '', securityLevel: ''
  };



  constructor() {
    // Simulate setting user region (in real app, this would come from auth service)
    this.currentUserRegion = 'Ashanti'; // Simulating zonal commander for Ashanti
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.sites];

    // Apply region filter based on user role
    if (this.currentUserRole === 'zonal-commander' && this.currentUserRegion) {
      result = result.filter(site => site.region === this.currentUserRegion);
    } else if (this.selectedRegion !== 'all') {
      result = result.filter(site => site.region === this.selectedRegion);
    }

    // Apply additional filters
    if (this.selectedType !== 'all') {
      result = result.filter(site => site.type === this.selectedType);
    }

    if (this.selectedSecurityLevel !== 'all') {
      result = result.filter(site => site.securityLevel === this.selectedSecurityLevel);
    }

    if (this.selectedStatus !== 'all') {
      result = result.filter(site => site.status === this.selectedStatus);
    }

    // Search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(site => 
        site.name.toLowerCase().includes(query) ||
        site.code.toLowerCase().includes(query) ||
        site.city.toLowerCase().includes(query) ||
        site.address.toLowerCase().includes(query)
      );
    }

    this.filteredSites = result;
    this.updateActiveFilterCount();
  }

  updateActiveFilterCount(): void {
    let count = 0;
    if (this.selectedType !== 'all') count++;
    if (this.selectedSecurityLevel !== 'all') count++;
    if (this.selectedStatus !== 'all') count++;
    if (this.searchQuery.trim()) count++;
    this.activeFilterCount = count;
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
    this.selectedSite = site;
    this.showMapSheet = true;
  }

  // Create new site with zone-based validation
  createSite(siteData: any): void {
    // Check if user can create site in the specified region
    if (!this.canCreateSiteInRegion(siteData.region)) {
      this.toast.show({ title: 'Permission Denied', description: `You can only create sites in ${this.userRegion || 'your assigned region'}.`, variant: 'destructive' });
      return;
    }

    // Create new site object
    const newSite: Site = {
      id: `SITE-${Date.now()}`,
      name: siteData.name,
      code: siteData.code,
      type: siteData.type,
      region: siteData.region,
      district: siteData.district,
      city: siteData.city,
      address: siteData.address,
      coordinates: siteData.coordinates,
      contact: siteData.contact,
      status: 'active', // New sites are automatically active
      staffCount: 0,
      guardCount: 0,
      operatingHours: siteData.operatingHours || {
        weekdays: '8:00 AM - 5:00 PM',
        weekends: 'Closed'
      },
      services: siteData.services || [],
      establishedDate: new Date(),
      securityLevel: siteData.securityLevel || 'medium',
      zonalCommander: this.permissions.displayName
    };

    // Add to sites array
    this.sites.push(newSite);

    // Update display
    this.applyFilters();

    // Close modal and show success alert
    this.modalService.closeAll();
    this.toast.show({ title: 'Site Created', description: `"${newSite.name}" has been created and is now active for guard deployment.`, variant: 'success' });
  }

  switchUserRole(): void {
    // For testing purposes - switch between head-office and zonal-commander
    this.currentUserRole = this.currentUserRole === 'head-office' ? 'zonal-commander' : 'head-office';
    this.applyFilters();
  }

  openNewSiteDialog(): void {
    this.newSiteForm = { name: '', code: '', type: '', region: '', city: '', address: '', securityLevel: '' };
    this.modalService.open({
      title: 'Create New Site',
      content: this.newSiteModal,
      size: 'lg',
      backdropClose: true,
      showCloseButton: true
    });
  }

  submitNewSite(): void {
    if (!this.newSiteForm.name || !this.newSiteForm.code || !this.newSiteForm.type || !this.newSiteForm.region) return;
    this.createSite({
      name: this.newSiteForm.name,
      code: this.newSiteForm.code,
      type: this.newSiteForm.type,
      region: this.newSiteForm.region,
      district: this.newSiteForm.city,
      city: this.newSiteForm.city,
      address: this.newSiteForm.address,
      securityLevel: this.newSiteForm.securityLevel || 'medium',
      contact: { phone: '', email: '', manager: '' },
      services: []
    });
  }

  clearFilters(): void {
    this.selectedType = 'all';
    this.selectedSecurityLevel = 'all';
    this.selectedRegion = 'all';
    this.selectedStatus = 'all';
    this.searchQuery = '';
    this.applyFilters();
  }

  toggleFilterPanel(): void {
    this.showFilterPanel = !this.showFilterPanel;
  }

  onSearch(): void {
    this.applyFilters();
  }

  deleteSite(site: Site) {
    const ref = this.alertDialog.open({
      title: 'Delete Site?',
      description: `Delete "${site.name}"? All associated data will be removed.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.sites = this.sites.filter(s => s.id !== site.id);
      this.applyFilters();
      this.toast.show({ title: 'Site Deleted', description: `"${site.name}" has been deleted.`, variant: 'destructive' });
    });
  }
}
