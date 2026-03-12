import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';

export interface Zone {
  id: string;
  name: string;
  code: string;
  region: string;
  commander: string;
  officerId: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface ZoneOfficer {
  id: string;
  name: string;
  phone: string;
  rank: string;
  region: string;
}

@Component({
  selector: 'app-zone-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent,
    InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    LabelComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './zone-management.component.html',
  styleUrls: ['./zone-management.component.css']
})
export class ZoneManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('zoneModal') zoneModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'zone',      label: 'Zone'            },
    { key: 'region',    label: 'Region'          },
    { key: 'commander', label: 'Zone Officer'    },
    { key: 'phone',     label: 'Contact Phone'   },
    { key: 'status',    label: 'Status'          },
    { key: 'actions',   label: ''                },
  ];

  zones: Zone[] = [
    { id: 'ZN-001', name: 'Greater Accra Zone', code: 'GAZ-01', region: 'Greater Accra', commander: 'Kofi Mensah',      officerId: 'ZO-001', phone: '+233-24-456-7890', status: 'active'   },
    { id: 'ZN-002', name: 'Ashanti Zone',        code: 'ASZ-01', region: 'Ashanti',       commander: 'Kwame Asante',     officerId: 'ZO-002', phone: '+233-20-345-6789', status: 'active'   },
    { id: 'ZN-003', name: 'Western Zone',        code: 'WEZ-01', region: 'Western',       commander: 'Yaw Darkwah',      officerId: 'ZO-003', phone: '+233-24-789-0123', status: 'active'   },
    { id: 'ZN-004', name: 'Central Zone',        code: 'CEZ-01', region: 'Central',       commander: 'Abena Owusu',      officerId: 'ZO-004', phone: '+233-20-890-1234', status: 'active'   },
    { id: 'ZN-005', name: 'Eastern Zone',        code: 'EAZ-01', region: 'Eastern',       commander: 'Nana Boateng',     officerId: 'ZO-005', phone: '+233-27-901-2345', status: 'active'   },
    { id: 'ZN-006', name: 'Volta Zone',          code: 'VOZ-01', region: 'Volta',         commander: 'Komla Gbekor',     officerId: 'ZO-006', phone: '+233-24-012-3456', status: 'active'   },
    { id: 'ZN-007', name: 'Northern Zone',       code: 'NOZ-01', region: 'Northern',      commander: 'Abdul Karim',      officerId: 'ZO-007', phone: '+233-20-123-4567', status: 'active'   },
    { id: 'ZN-008', name: 'Upper East Zone',     code: 'UEZ-01', region: 'Upper East',    commander: 'Akosua Frimpong',  officerId: 'ZO-008', phone: '+233-27-234-5678', status: 'inactive' },
    { id: 'ZN-009', name: 'Upper West Zone',     code: 'UWZ-01', region: 'Upper West',    commander: 'Iddrisu Alhassan', officerId: 'ZO-009', phone: '+233-20-567-8901', status: 'inactive' },
    { id: 'ZN-010', name: 'Brong-Ahafo Zone',   code: 'BAZ-01', region: 'Brong-Ahafo',  commander: 'Kofi Yeboah',      officerId: 'ZO-010', phone: '+233-24-678-9012', status: 'active'   },
  ];

  officers: ZoneOfficer[] = [
    { id: 'ZO-001', name: 'Kofi Mensah',       phone: '+233-24-456-7890', rank: 'Senior Zone Commander', region: 'Greater Accra' },
    { id: 'ZO-002', name: 'Kwame Asante',       phone: '+233-20-345-6789', rank: 'Zone Commander',        region: 'Ashanti'       },
    { id: 'ZO-003', name: 'Yaw Darkwah',        phone: '+233-24-789-0123', rank: 'Zone Commander',        region: 'Western'       },
    { id: 'ZO-004', name: 'Abena Owusu',        phone: '+233-20-890-1234', rank: 'Deputy Commander',      region: 'Central'       },
    { id: 'ZO-005', name: 'Nana Boateng',       phone: '+233-27-901-2345', rank: 'Zone Commander',        region: 'Eastern'       },
    { id: 'ZO-006', name: 'Komla Gbekor',       phone: '+233-24-012-3456', rank: 'Deputy Commander',      region: 'Volta'         },
    { id: 'ZO-007', name: 'Abdul Karim',        phone: '+233-20-123-4567', rank: 'Zone Commander',        region: 'Northern'      },
    { id: 'ZO-008', name: 'Akosua Frimpong',    phone: '+233-27-234-5678', rank: 'Deputy Commander',      region: 'Upper East'    },
    { id: 'ZO-009', name: 'Iddrisu Alhassan',   phone: '+233-20-567-8901', rank: 'Zone Commander',        region: 'Upper West'    },
    { id: 'ZO-010', name: 'Kofi Yeboah',        phone: '+233-24-678-9012', rank: 'Zone Commander',        region: 'Brong-Ahafo'   },
    { id: 'ZO-011', name: 'Ama Sarpong',        phone: '+233-20-234-5678', rank: 'Deputy Commander',      region: 'Greater Accra' },
    { id: 'ZO-012', name: 'Efua Ansah',         phone: '+233-27-345-6789', rank: 'Deputy Commander',      region: 'Ashanti'       },
  ];

  filteredZones: Zone[] = [];
  showFilterPanel = false;
  filterRegion = 'All';
  filterStatus = 'All';

  // Create modal state
  showCreateModal = false;
  createStep = 0;
  creating = false;
  step1Error = '';
  officerSearch = '';

  newZone = {
    name: '',
    code: '',
    region: '',
    status: 'active' as 'active' | 'inactive',
    officerId: '',
    officerName: '',
    officerPhone: ''
  };

  readonly regions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
    'Volta', 'Northern', 'Upper East', 'Upper West', 'Brong-Ahafo'
  ];

  get totalZones():    number { return this.zones.length; }
  get activeZones():   number { return this.zones.filter(z => z.status === 'active').length; }
  get inactiveZones(): number { return this.zones.filter(z => z.status === 'inactive').length; }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filterRegion !== 'All') count++;
    if (this.filterStatus !== 'All')  count++;
    return count;
  }

  get previewZoneId(): string {
    return `ZN-${String(this.zones.length + 1).padStart(3, '0')}`;
  }

  get filteredOfficers(): ZoneOfficer[] {
    const q = this.officerSearch.toLowerCase().trim();
    if (!q) return this.officers;
    return this.officers.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.rank.toLowerCase().includes(q) ||
      o.region.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.zones];
    if (this.filterRegion !== 'All') result = result.filter(z => z.region === this.filterRegion);
    if (this.filterStatus !== 'All')  result = result.filter(z => z.status === this.filterStatus);
    this.filteredZones = result;
  }

  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters(): void {
    this.filterRegion = 'All';
    this.filterStatus = 'All';
    this.applyFilter();
  }

  // ── Modal ────────────────────────────────────────────────────────────────

  openCreateModal(): void {
    this.createStep = 0;
    this.step1Error = '';
    this.officerSearch = '';
    this.newZone = { name: '', code: '', region: '', status: 'active', officerId: '', officerName: '', officerPhone: '' };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  nextCreateStep(): void {
    if (!this.newZone.name.trim()) {
      this.step1Error = 'Zone name is required.';
      return;
    }
    if (!this.newZone.region) {
      this.step1Error = 'Please select a region.';
      return;
    }
    this.step1Error = '';
    this.createStep = 1;
  }

  prevCreateStep(): void {
    this.createStep = 0;
  }

  selectOfficer(officer: ZoneOfficer): void {
    this.newZone.officerId   = officer.id;
    this.newZone.officerName = officer.name;
    this.newZone.officerPhone = officer.phone;
  }

  submitZone(): void {
    this.creating = true;
    setTimeout(() => {
      this.zones.unshift({
        id:        this.previewZoneId,
        name:      this.newZone.name,
        code:      this.newZone.code || this.previewZoneId.replace('ZN-', 'Z-'),
        region:    this.newZone.region,
        commander: this.newZone.officerName || 'Unassigned',
        officerId: this.newZone.officerId,
        phone:     this.newZone.officerPhone || '—',
        status:    this.newZone.status
      });
      this.applyFilter();
      this.showCreateModal = false;
      this.creating = false;
    }, 600);
  }

  // ── View ─────────────────────────────────────────────────────────────────

  viewZone(zone: Zone): void {
    this.modalService.open({
      title: `Zone Details — ${zone.id}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.zoneModal,
      context: { zone }
    });
  }

  getStatusBg(status: string): string {
    return status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(113,113,122,0.15)';
  }

  getStatusFg(status: string): string {
    return status === 'active' ? '#16a34a' : '#71717a';
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 1);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
