import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent, PaginationComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  CardComponent, CardContentComponent, EmptyStateComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  SheetComponent, SheetContentComponent, LabelComponent, ModalService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../core/services/permissions.service';

interface Shipment {
  id: number;
  trackingNo: string;
  description: string;
  origin: string;
  destination: string;
  carrier: string;
  driver: string;
  driverPhone: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Delayed';
  priority: 'Normal' | 'Urgent';
  dispatchDate: string;
  eta: string;
  items: number;
  weight: string;
}

@Component({
  selector: 'app-logistics-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent, PaginationComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    CardComponent, CardContentComponent, EmptyStateComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    SheetComponent, SheetContentComponent, LabelComponent
  ],
  templateUrl: './logistics-management.component.html',
  styleUrl: './logistics-management.component.css'
})
export class LogisticsManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('shipmentModal') shipmentModal!: TemplateRef<any>;
  private permissions = inject(PermissionsService);

  shipments: Shipment[] = [
    { id: 1,  trackingNo: 'TRK-2025-001', description: 'Uniform Consignment (Batch A)',       origin: 'Accra Warehouse',    destination: 'Kumasi Branch',       carrier: 'GhanaExpress',    driver: 'Samuel Agyei',    driverPhone: '024-244-1100', status: 'In Transit',  priority: 'Normal', dispatchDate: '2025-02-28', eta: '2025-03-01', items: 150, weight: '320 kg' },
    { id: 2,  trackingNo: 'TRK-2025-002', description: 'Radio Equipment – Motorola Units',    origin: 'Accra Warehouse',    destination: 'Takoradi Branch',     carrier: 'SwiftCargo',      driver: 'James Boateng',   driverPhone: '020-245-8800', status: 'In Transit',  priority: 'Urgent', dispatchDate: '2025-02-27', eta: '2025-02-28', items: 20,  weight: '85 kg' },
    { id: 3,  trackingNo: 'TRK-2025-003', description: 'Stationery & Office Supplies',        origin: 'Kumasi Depot',       destination: 'Head Office – Accra', carrier: 'QuickMove GH',    driver: 'Kwesi Owusu',     driverPhone: '032-246-2200', status: 'Delivered',   priority: 'Normal', dispatchDate: '2025-02-25', eta: '2025-02-26', items: 40,  weight: '120 kg' },
    { id: 4,  trackingNo: 'TRK-2025-004', description: 'Baton & Pepper Spray – Security Kit', origin: 'Accra Warehouse',    destination: 'Cape Coast Post',     carrier: 'GhanaExpress',    driver: 'Ato Mensah',      driverPhone: '024-247-5500', status: 'Delivered',   priority: 'Normal', dispatchDate: '2025-02-24', eta: '2025-02-25', items: 60,  weight: '95 kg' },
    { id: 5,  trackingNo: 'TRK-2025-005', description: 'First Aid Kits & Medical Supplies',   origin: 'Cape Coast Medicals',destination: 'Tema Industrial',     carrier: 'SwiftCargo',      driver: 'Yaw Amoah',       driverPhone: '020-248-3300', status: 'Pending',     priority: 'Normal', dispatchDate: '2025-03-02', eta: '2025-03-03', items: 30,  weight: '60 kg' },
    { id: 6,  trackingNo: 'TRK-2025-006', description: 'Vehicle Spare Parts – Fleet Maint.',  origin: 'Accra Auto Parts',   destination: 'Kumasi Branch',       carrier: 'NorthCarriers',   driver: 'Kwabena Frimpong',driverPhone: '024-243-7700', status: 'Delayed',     priority: 'Urgent', dispatchDate: '2025-02-26', eta: '2025-02-28', items: 8,   weight: '200 kg' },
    { id: 7,  trackingNo: 'TRK-2025-007', description: 'IT Equipment – Laptop Batch',         origin: 'Accra Warehouse',    destination: 'Head Office – Accra', carrier: 'QuickMove GH',    driver: 'Kofi Amponsah',   driverPhone: '032-244-9900', status: 'Delivered',   priority: 'Normal', dispatchDate: '2025-02-22', eta: '2025-02-23', items: 10,  weight: '35 kg' },
    { id: 8,  trackingNo: 'TRK-2025-008', description: 'Fuel Drums – Remote Site Supply',     origin: 'Western Fuel Depot', destination: 'Volta Guard Post',    carrier: 'NorthCarriers',   driver: 'Dela Agbemafle',  driverPhone: '036-245-6600', status: 'In Transit',  priority: 'Urgent', dispatchDate: '2025-02-28', eta: '2025-03-01', items: 6,   weight: '900 kg' },
    { id: 9,  trackingNo: 'TRK-2025-009', description: 'Printed Signage & ID Cards',          origin: 'PanAfrican Print',   destination: 'Multiple Sites',      carrier: 'GhanaExpress',    driver: 'Akwasi Boateng',  driverPhone: '024-246-8800', status: 'Pending',     priority: 'Normal', dispatchDate: '2025-03-03', eta: '2025-03-05', items: 500, weight: '15 kg' },
    { id: 10, trackingNo: 'TRK-2025-010', description: 'Flashlights & Torch Batteries',       origin: 'SecureEquip Kumasi', destination: 'Northern Posts',      carrier: 'SwiftCargo',      driver: 'Issah Alhassan',  driverPhone: '037-244-1200', status: 'Delayed',     priority: 'Normal', dispatchDate: '2025-02-25', eta: '2025-02-27', items: 100, weight: '40 kg' },
  ];

  filteredShipments: Shipment[] = [];
  displayedShipments: Shipment[] = [];

  searchQuery = '';
  searchTimeout: any;
  filterStatus: 'All' | 'In Transit' | 'Delivered' | 'Pending' | 'Delayed' = 'All';
  filterPriority: 'All' | 'Normal' | 'Urgent' = 'All';
  showFilterPanel = false;
  showCreateSheet = false;
  creating = false;

  newShipment = {
    description: '',
    origin: '',
    destination: '',
    carrier: '',
    priority: 'Normal'
  };

  currentPage = 1;
  pageSize = 10;
  startIndex = 0;
  endIndex = 0;

  get inTransitCount() { return this.shipments.filter(s => s.status === 'In Transit').length; }
  get deliveredCount() { return this.shipments.filter(s => s.status === 'Delivered').length; }
  get pendingCount()   { return this.shipments.filter(s => s.status === 'Pending').length; }
  get delayedCount()   { return this.shipments.filter(s => s.status === 'Delayed').length; }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.filterStatus !== 'All') count++;
    if (this.filterPriority !== 'All') count++;
    return count;
  }

  ngOnInit() {
    if (!this.permissions.isGlobal()) {
      const allowed = this.permissions.getAllowedSites();
      this.shipments = this.shipments.filter(s => allowed.some(site => s.destination.includes(site)));
    }
    this.applyFiltersAndPagination();
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFiltersAndPagination(), 300);
  }

  applyFiltersAndPagination() {
    let result = [...this.shipments];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(s =>
        s.trackingNo.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.driver.toLowerCase().includes(q) ||
        s.carrier.toLowerCase().includes(q)
      );
    }

    if (this.filterStatus !== 'All') result = result.filter(s => s.status === this.filterStatus);
    if (this.filterPriority !== 'All') result = result.filter(s => s.priority === this.filterPriority);

    this.filteredShipments = result;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredShipments.length);
    this.displayedShipments = this.filteredShipments.slice(this.startIndex, this.endIndex);
  }

  onPageChange(event: Event | number) {
    const page = typeof event === 'number' ? event : (event as any).detail || (event as any).page || 1;
    this.currentPage = page;
    this.applyFiltersAndPagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'All';
    this.filterPriority = 'All';
    this.applyFiltersAndPagination();
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  openCreateSheet() {
    this.newShipment = { description: '', origin: '', destination: '', carrier: '', priority: 'Normal' };
    this.showCreateSheet = true;
  }

  submitShipment() {
    this.creating = true;
    setTimeout(() => {
      this.shipments.unshift({
        id: Date.now(),
        trackingNo: `TRK-2025-${String(this.shipments.length + 1).padStart(3, '0')}`,
        description: this.newShipment.description || 'New Shipment',
        origin: this.newShipment.origin || 'Accra Warehouse',
        destination: this.newShipment.destination || 'TBD',
        carrier: this.newShipment.carrier || 'GhanaExpress',
        driver: 'TBD',
        driverPhone: '—',
        status: 'Pending',
        priority: this.newShipment.priority as 'Normal' | 'Urgent',
        dispatchDate: new Date().toISOString().split('T')[0],
        eta: '—',
        items: 0,
        weight: '—'
      });
      this.applyFiltersAndPagination();
      this.showCreateSheet = false;
      this.creating = false;
    }, 600);
  }

  viewShipment(shipment: Shipment) {
    this.modalService.open({
      title: `Shipment – ${shipment.trackingNo}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.shipmentModal,
      context: { shipment }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'In Transit': 'rgba(33, 150, 243, 0.15)',
      'Delivered':  'rgba(76, 175, 80, 0.15)',
      'Pending':    'rgba(255, 152, 0, 0.15)',
      'Delayed':    'rgba(244, 67, 54, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'In Transit': '#2196F3',
      'Delivered':  '#4CAF50',
      'Pending':    '#FF9800',
      'Delayed':    '#F44336'
    };
    return map[status] ?? '';
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      'In Transit': 'ri-truck-line',
      'Delivered':  'ri-checkbox-circle-line',
      'Pending':    'ri-time-line',
      'Delayed':    'ri-alert-line'
    };
    return map[status] ?? 'ri-question-line';
  }
}
