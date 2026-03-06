import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService, AlertComponent, AlertDialogService,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';
import { InputComponent } from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../core/services/permissions.service';

interface Shipment {
  id: number;
  trackingNo: string;
  description: string;
  origin: string;
  destination: string;
  carrier: string;
  driver: string;
  driverPhone: string;
  status: 'In Transit' | 'Delivered' | 'Pending' | 'Delayed' | 'Cancelled';
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
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    LabelComponent, AlertComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './logistics-management.component.html',
  styleUrl: './logistics-management.component.css'
})
export class LogisticsManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  @ViewChild('shipmentModal') shipmentModal!: TemplateRef<any>;
  @ViewChild('createShipmentModal') createShipmentModal!: TemplateRef<any>;
  private permissions = inject(PermissionsService);
  private modalRef: any;

  columns: TableColumn[] = [
    { key: 'tracking', label: 'Tracking' },
    { key: 'description', label: 'Description' },
    { key: 'route', label: 'Route' },
    { key: 'driver', label: 'Driver' },
    { key: 'eta', label: 'ETA' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  shipments: Shipment[] = [
    { id: 1,  trackingNo: 'TRK-2025-001', description: 'Uniform Consignment (Batch A)',       origin: 'Accra Warehouse',     destination: 'Kumasi Branch',       carrier: 'GhanaExpress',   driver: 'Samuel Agyei',     driverPhone: '024-244-1100', status: 'In Transit',  priority: 'Normal', dispatchDate: '2025-02-28', eta: '2025-03-01', items: 150, weight: '320 kg' },
    { id: 2,  trackingNo: 'TRK-2025-002', description: 'Radio Equipment – Motorola Units',    origin: 'Accra Warehouse',     destination: 'Takoradi Branch',     carrier: 'SwiftCargo',     driver: 'James Boateng',    driverPhone: '020-245-8800', status: 'In Transit',  priority: 'Urgent', dispatchDate: '2025-02-27', eta: '2025-02-28', items: 20,  weight: '85 kg' },
    { id: 3,  trackingNo: 'TRK-2025-003', description: 'Stationery & Office Supplies',        origin: 'Kumasi Depot',        destination: 'Head Office – Accra', carrier: 'QuickMove GH',   driver: 'Kwesi Owusu',      driverPhone: '032-246-2200', status: 'Delivered',   priority: 'Normal', dispatchDate: '2025-02-25', eta: '2025-02-26', items: 40,  weight: '120 kg' },
    { id: 4,  trackingNo: 'TRK-2025-004', description: 'Baton & Pepper Spray – Security Kit', origin: 'Accra Warehouse',     destination: 'Cape Coast Post',     carrier: 'GhanaExpress',   driver: 'Ato Mensah',        driverPhone: '024-247-5500', status: 'Delivered',   priority: 'Normal', dispatchDate: '2025-02-24', eta: '2025-02-25', items: 60,  weight: '95 kg' },
    { id: 5,  trackingNo: 'TRK-2025-005', description: 'First Aid Kits & Medical Supplies',   origin: 'Cape Coast Medicals', destination: 'Tema Industrial',     carrier: 'SwiftCargo',     driver: 'Yaw Amoah',         driverPhone: '020-248-3300', status: 'Pending',     priority: 'Normal', dispatchDate: '2025-03-02', eta: '2025-03-03', items: 30,  weight: '60 kg' },
    { id: 6,  trackingNo: 'TRK-2025-006', description: 'Vehicle Spare Parts – Fleet Maint.',  origin: 'Accra Auto Parts',    destination: 'Kumasi Branch',       carrier: 'NorthCarriers',  driver: 'Kwabena Frimpong',  driverPhone: '024-243-7700', status: 'Delayed',     priority: 'Urgent', dispatchDate: '2025-02-26', eta: '2025-02-28', items: 8,   weight: '200 kg' },
    { id: 7,  trackingNo: 'TRK-2025-007', description: 'IT Equipment – Laptop Batch',         origin: 'Accra Warehouse',     destination: 'Head Office – Accra', carrier: 'QuickMove GH',   driver: 'Kofi Amponsah',     driverPhone: '032-244-9900', status: 'Delivered',   priority: 'Normal', dispatchDate: '2025-02-22', eta: '2025-02-23', items: 10,  weight: '35 kg' },
    { id: 8,  trackingNo: 'TRK-2025-008', description: 'Fuel Drums – Remote Site Supply',     origin: 'Western Fuel Depot',  destination: 'Volta Guard Post',    carrier: 'NorthCarriers',  driver: 'Dela Agbemafle',    driverPhone: '036-245-6600', status: 'In Transit',  priority: 'Urgent', dispatchDate: '2025-02-28', eta: '2025-03-01', items: 6,   weight: '900 kg' },
    { id: 9,  trackingNo: 'TRK-2025-009', description: 'Printed Signage & ID Cards',          origin: 'PanAfrican Print',    destination: 'Multiple Sites',      carrier: 'GhanaExpress',   driver: 'Akwasi Boateng',    driverPhone: '024-246-8800', status: 'Pending',     priority: 'Normal', dispatchDate: '2025-03-03', eta: '2025-03-05', items: 500, weight: '15 kg' },
    { id: 10, trackingNo: 'TRK-2025-010', description: 'Flashlights & Torch Batteries',       origin: 'SecureEquip Kumasi',  destination: 'Northern Posts',      carrier: 'SwiftCargo',     driver: 'Issah Alhassan',    driverPhone: '037-244-1200', status: 'Delayed',     priority: 'Normal', dispatchDate: '2025-02-25', eta: '2025-02-27', items: 100, weight: '40 kg' },
  ];

  filteredShipments: Shipment[] = [];
  showFilterPanel = false;
  creating = false;
  showSuccessAlert = false;
  alertTitle = '';
  alertMessage = '';
  alertVariant: 'success' | 'destructive' = 'success';

  filterStatus: 'All' | 'In Transit' | 'Delivered' | 'Pending' | 'Delayed' = 'All';
  filterPriority: 'All' | 'Normal' | 'Urgent' = 'All';

  newShipment = { description: '', origin: '', destination: '', carrier: '', priority: 'Normal' };

  get inTransitCount() { return this.shipments.filter(s => s.status === 'In Transit').length; }
  get deliveredCount() { return this.shipments.filter(s => s.status === 'Delivered').length; }
  get pendingCount()   { return this.shipments.filter(s => s.status === 'Pending').length; }
  get delayedCount()   { return this.shipments.filter(s => s.status === 'Delayed').length; }
  get isApprover(): boolean { return this.permissions.isGlobal(); }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filterStatus !== 'All') count++;
    if (this.filterPriority !== 'All') count++;
    return count;
  }

  ngOnInit() {
    if (!this.permissions.isGlobal()) {
      const allowed = this.permissions.getAllowedSites();
      this.shipments = this.shipments.filter(s => allowed.some(site => s.destination.includes(site)));
    }
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.shipments];
    if (this.filterStatus !== 'All') result = result.filter(s => s.status === this.filterStatus);
    if (this.filterPriority !== 'All') result = result.filter(s => s.priority === this.filterPriority);
    this.filteredShipments = result;
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.filterPriority = 'All';
    this.applyFilter();
  }

  approveShipment(shipment: Shipment) {
    const ref = this.alertDialog.open({
      title: 'Approve & Dispatch?',
      description: `Approve ${shipment.trackingNo} from ${shipment.origin} to ${shipment.destination}? Status will change to In Transit.`,
      actionText: 'Approve & Dispatch'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      shipment.status = 'In Transit';
      this.applyFilter();
      this.showAlert('success', 'Shipment Approved', `${shipment.trackingNo} has been approved and dispatched.`);
    });
  }

  rejectShipment(shipment: Shipment) {
    const ref = this.alertDialog.open({
      title: 'Reject & Cancel Shipment?',
      description: `Cancel ${shipment.trackingNo}? This will permanently cancel the shipment request.`,
      actionText: 'Reject & Cancel',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      shipment.status = 'Cancelled';
      this.applyFilter();
      this.showAlert('destructive', 'Shipment Cancelled', `${shipment.trackingNo} has been rejected and cancelled.`);
    });
  }

  private showAlert(variant: 'success' | 'destructive', title: string, message: string) {
    this.alertVariant = variant;
    this.alertTitle = title;
    this.alertMessage = message;
    this.showSuccessAlert = true;
    setTimeout(() => this.showSuccessAlert = false, 5000);
  }

  openCreateSheet() {
    this.newShipment = { description: '', origin: '', destination: '', carrier: '', priority: 'Normal' };
    this.modalRef = this.modalService.open({
      title: 'New Shipment Request',
      backdropClose: true,
      size: 'lg',
      showCloseButton: true,
      content: this.createShipmentModal
    });
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
      this.applyFilter();
      this.creating = false;
      if (this.modalRef) { this.modalRef.close(); }
      this.showAlert('success', 'Shipment Created', 'The shipment request has been created and is pending approval.');
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
      'Delayed':    'rgba(244, 67, 54, 0.15)',
      'Cancelled':  'rgba(120, 120, 120, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'In Transit': '#2196F3',
      'Delivered':  '#4CAF50',
      'Pending':    '#FF9800',
      'Delayed':    '#F44336',
      'Cancelled':  '#757575'
    };
    return map[status] ?? '';
  }

  getStatusIcon(status: string): string {
    const map: Record<string, string> = {
      'In Transit': 'ri-truck-line',
      'Delivered':  'ri-checkbox-circle-line',
      'Pending':    'ri-time-line',
      'Delayed':    'ri-alert-line',
      'Cancelled':  'ri-close-circle-line'
    };
    return map[status] ?? 'ri-question-line';
  }
}
