import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent, PaginationComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  CardComponent, CardContentComponent, EmptyStateComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService
} from '@tolle_/tolle-ui';
import { PermissionsService } from '../../core/services/permissions.service';

interface AttendanceRecord {
  id: number;
  staffId: string;
  name: string;
  role: string;
  site: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Left' | 'Late' | 'Absent';
  hoursWorked: string | null;
}

@Component({
  selector: 'app-check-in-out',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent, PaginationComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    CardComponent, CardContentComponent, EmptyStateComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent
  ],
  templateUrl: './check-in-out.component.html',
  styleUrl: './check-in-out.component.css'
})
export class CheckInOutComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('recordModal') recordModal!: TemplateRef<any>;
  private permissions = inject(PermissionsService);

  records: AttendanceRecord[] = [
    { id: 1,  staffId: 'GD-001', name: 'Kwame Mensah',     role: 'Senior Guard',   site: 'Head Office – Accra',  checkIn: '06:02', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 2,  staffId: 'GD-002', name: 'Ama Boateng',      role: 'Guard',          site: 'Kumasi Branch',        checkIn: '05:58', checkOut: '14:00', status: 'Left',    hoursWorked: '8h 02m' },
    { id: 3,  staffId: 'GD-003', name: 'Kofi Asante',      role: 'Supervisor',     site: 'Head Office – Accra',  checkIn: '06:41', checkOut: null,    status: 'Late',    hoursWorked: null },
    { id: 4,  staffId: 'GD-004', name: 'Abena Osei',       role: 'Guard',          site: 'Takoradi Branch',      checkIn: null,    checkOut: null,    status: 'Absent',  hoursWorked: null },
    { id: 5,  staffId: 'GD-005', name: 'Yaw Darko',        role: 'Guard',          site: 'Cape Coast Post',      checkIn: '05:55', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 6,  staffId: 'GD-006', name: 'Akosua Frimpong',  role: 'Senior Guard',   site: 'Kumasi Branch',        checkIn: '06:00', checkOut: '14:05', status: 'Left',    hoursWorked: '8h 05m' },
    { id: 7,  staffId: 'GD-007', name: 'Nana Acheampong',  role: 'Guard',          site: 'Head Office – Accra',  checkIn: '06:05', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 8,  staffId: 'GD-008', name: 'Efua Asante',      role: 'Guard',          site: 'Tema Industrial',      checkIn: null,    checkOut: null,    status: 'Absent',  hoursWorked: null },
    { id: 9,  staffId: 'GD-009', name: 'Kweku Baffoe',     role: 'Supervisor',     site: 'Takoradi Branch',      checkIn: '06:03', checkOut: null,    status: 'Present', hoursWorked: null },
    { id: 10, staffId: 'GD-010', name: 'Adwoa Kyei',       role: 'Guard',          site: 'Head Office – Accra',  checkIn: '06:52', checkOut: null,    status: 'Late',    hoursWorked: null },
    { id: 11, staffId: 'GD-011', name: 'Kojo Agyemang',    role: 'Guard',          site: 'Tema Industrial',      checkIn: '06:01', checkOut: '14:00', status: 'Left',    hoursWorked: '7h 59m' },
    { id: 12, staffId: 'GD-012', name: 'Akua Tetteh',      role: 'Senior Guard',   site: 'Cape Coast Post',      checkIn: '05:59', checkOut: null,    status: 'Present', hoursWorked: null },
  ];

  filteredRecords: AttendanceRecord[] = [];
  displayedRecords: AttendanceRecord[] = [];

  searchQuery = '';
  searchTimeout: any;
  filterStatus: 'All' | 'Present' | 'Left' | 'Late' | 'Absent' = 'All';
  showFilterPanel = false;

  currentPage = 1;
  pageSize = 10;
  startIndex = 0;
  endIndex = 0;

  get presentCount() { return this.records.filter(r => r.status === 'Present').length; }
  get leftCount()    { return this.records.filter(r => r.status === 'Left').length; }
  get lateCount()    { return this.records.filter(r => r.status === 'Late').length; }
  get absentCount()  { return this.records.filter(r => r.status === 'Absent').length; }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.filterStatus !== 'All') count++;
    return count;
  }

  ngOnInit() {
    this.records = this.permissions.filterBySite(this.records);
    this.applyFiltersAndPagination();
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFiltersAndPagination(), 300);
  }

  applyFiltersAndPagination() {
    let result = [...this.records];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.staffId.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.site.toLowerCase().includes(q)
      );
    }

    if (this.filterStatus !== 'All') {
      result = result.filter(r => r.status === this.filterStatus);
    }

    this.filteredRecords = result;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredRecords.length);
    this.displayedRecords = this.filteredRecords.slice(this.startIndex, this.endIndex);
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
    this.applyFiltersAndPagination();
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  viewRecord(record: AttendanceRecord) {
    this.modalService.open({
      title: `Attendance – ${record.name}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.recordModal,
      context: { record }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Present': 'rgba(76, 175, 80, 0.15)',
      'Left':    'rgba(33, 150, 243, 0.15)',
      'Late':    'rgba(255, 152, 0, 0.15)',
      'Absent':  'rgba(244, 67, 54, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Present': '#4CAF50',
      'Left':    '#2196F3',
      'Late':    '#FF9800',
      'Absent':  '#F44336'
    };
    return map[status] ?? '';
  }
}
