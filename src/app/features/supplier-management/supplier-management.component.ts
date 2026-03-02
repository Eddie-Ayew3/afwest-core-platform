import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent, PaginationComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  CardComponent, CardContentComponent, EmptyStateComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  SheetComponent, SheetContentComponent, LabelComponent, TextareaComponent, ModalService
} from '@tolle_/tolle-ui';

interface Supplier {
  id: number;
  supplierCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending';
  tier: 'Standard' | 'Premium';
  activeContracts: number;
  rating: number;
  lastOrderDate: string;
  region: string;
}

@Component({
  selector: 'app-supplier-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent, PaginationComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    CardComponent, CardContentComponent, EmptyStateComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    SheetComponent, SheetContentComponent, LabelComponent, TextareaComponent
  ],
  templateUrl: './supplier-management.component.html',
  styleUrl: './supplier-management.component.css'
})
export class SupplierManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  @ViewChild('supplierModal') supplierModal!: TemplateRef<any>;

  suppliers: Supplier[] = [
    { id: 1, supplierCode: 'SUP-001', name: 'Ghana Uniform Co.',          contactPerson: 'Emmanuel Boateng', email: 'eboateng@guc.gh',       phone: '030-244-1100', category: 'Uniforms & Apparel',    status: 'Active',   tier: 'Premium',  activeContracts: 3, rating: 4.8, lastOrderDate: '2025-02-15', region: 'Greater Accra' },
    { id: 2, supplierCode: 'SUP-002', name: 'SecureEquip Ltd.',           contactPerson: 'Abena Mensah',     email: 'amensah@secequip.gh',   phone: '032-245-8800', category: 'Security Equipment',    status: 'Active',   tier: 'Premium',  activeContracts: 2, rating: 4.6, lastOrderDate: '2025-02-20', region: 'Ashanti' },
    { id: 3, supplierCode: 'SUP-003', name: 'Accra Auto Parts & Fleet',  contactPerson: 'Kwabena Asante',   email: 'k.asante@accrauto.gh',  phone: '030-243-7700', category: 'Fleet & Vehicles',      status: 'Active',   tier: 'Standard', activeContracts: 1, rating: 4.2, lastOrderDate: '2025-01-30', region: 'Greater Accra' },
    { id: 4, supplierCode: 'SUP-004', name: 'NorthComm Radio Systems',   contactPerson: 'Yaw Frimpong',     email: 'yfrimpong@northcomm.gh', phone: '037-244-5500', category: 'Communications',        status: 'Active',   tier: 'Standard', activeContracts: 2, rating: 4.4, lastOrderDate: '2025-02-10', region: 'Northern' },
    { id: 5, supplierCode: 'SUP-005', name: 'Western Fuel & Energy',     contactPerson: 'Adwoa Oppong',     email: 'aoppong@westernfuel.gh', phone: '031-245-2200', category: 'Fuel & Energy',         status: 'Active',   tier: 'Standard', activeContracts: 1, rating: 3.9, lastOrderDate: '2025-02-25', region: 'Western' },
    { id: 6, supplierCode: 'SUP-006', name: 'Kumasi Office Supplies',    contactPerson: 'Kofi Tetteh',      email: 'ktetteh@kumoffice.gh',  phone: '032-244-9900', category: 'Stationery & Office',   status: 'Active',   tier: 'Standard', activeContracts: 1, rating: 4.1, lastOrderDate: '2025-01-20', region: 'Ashanti' },
    { id: 7, supplierCode: 'SUP-007', name: 'AfricaLink ICT Solutions',  contactPerson: 'Nana Darkwa',      email: 'ndarkwa@africalink.gh', phone: '030-246-3300', category: 'IT & Technology',       status: 'Pending',  tier: 'Standard', activeContracts: 0, rating: 0,   lastOrderDate: '—',          region: 'Greater Accra' },
    { id: 8, supplierCode: 'SUP-008', name: 'Cape Coast Medicals',       contactPerson: 'Efua Acquah',      email: 'eacquah@ccmed.gh',      phone: '033-244-6600', category: 'First Aid & Medical',   status: 'Active',   tier: 'Standard', activeContracts: 1, rating: 4.5, lastOrderDate: '2025-02-05', region: 'Central' },
    { id: 9, supplierCode: 'SUP-009', name: 'Volta Guard Tech',          contactPerson: 'Dela Agbemafle',   email: 'dagbemafle@vgt.gh',     phone: '036-244-1200', category: 'Security Equipment',    status: 'Inactive', tier: 'Standard', activeContracts: 0, rating: 3.5, lastOrderDate: '2024-10-12', region: 'Volta' },
    { id: 10, supplierCode: 'SUP-010', name: 'PanAfrican Print & Brand', contactPerson: 'Kojo Ababio',      email: 'kababio@pab.gh',        phone: '030-247-8800', category: 'Print & Branding',      status: 'Active',   tier: 'Standard', activeContracts: 2, rating: 4.3, lastOrderDate: '2025-01-18', region: 'Greater Accra' },
  ];

  filteredSuppliers: Supplier[] = [];
  displayedSuppliers: Supplier[] = [];

  searchQuery = '';
  searchTimeout: any;
  filterStatus: 'All' | 'Active' | 'Inactive' | 'Pending' = 'All';
  filterCategory = 'All';
  filterTier: 'All' | 'Standard' | 'Premium' = 'All';
  showFilterPanel = false;
  showAddSheet = false;
  adding = false;

  newSupplier = {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    category: '',
    region: ''
  };

  currentPage = 1;
  pageSize = 10;
  startIndex = 0;
  endIndex = 0;

  get activeCount()   { return this.suppliers.filter(s => s.status === 'Active').length; }
  get contractCount() { return this.suppliers.reduce((acc, s) => acc + s.activeContracts, 0); }
  get pendingCount()  { return this.suppliers.filter(s => s.status === 'Pending').length; }
  get premiumCount()  { return this.suppliers.filter(s => s.tier === 'Premium').length; }

  get categories(): string[] {
    return [...new Set(this.suppliers.map(s => s.category))].sort();
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.filterStatus !== 'All') count++;
    if (this.filterCategory !== 'All') count++;
    if (this.filterTier !== 'All') count++;
    return count;
  }

  ngOnInit() {
    this.applyFiltersAndPagination();
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFiltersAndPagination(), 300);
  }

  applyFiltersAndPagination() {
    let result = [...this.suppliers];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.supplierCode.toLowerCase().includes(q) ||
        s.contactPerson.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q)
      );
    }

    if (this.filterStatus !== 'All') result = result.filter(s => s.status === this.filterStatus);
    if (this.filterCategory !== 'All') result = result.filter(s => s.category === this.filterCategory);
    if (this.filterTier !== 'All') result = result.filter(s => s.tier === this.filterTier);

    this.filteredSuppliers = result;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = Math.min(this.startIndex + this.pageSize, this.filteredSuppliers.length);
    this.displayedSuppliers = this.filteredSuppliers.slice(this.startIndex, this.endIndex);
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
    this.filterCategory = 'All';
    this.filterTier = 'All';
    this.applyFiltersAndPagination();
  }

  toggleFilterPanel() {
    this.showFilterPanel = !this.showFilterPanel;
  }

  openAddSheet() {
    this.newSupplier = { name: '', contactPerson: '', email: '', phone: '', category: '', region: '' };
    this.showAddSheet = true;
  }

  submitSupplier() {
    this.adding = true;
    setTimeout(() => {
      this.suppliers.unshift({
        id: Date.now(),
        supplierCode: `SUP-${String(this.suppliers.length + 1).padStart(3, '0')}`,
        name: this.newSupplier.name || 'New Supplier',
        contactPerson: this.newSupplier.contactPerson,
        email: this.newSupplier.email,
        phone: this.newSupplier.phone,
        category: this.newSupplier.category || 'General',
        status: 'Pending',
        tier: 'Standard',
        activeContracts: 0,
        rating: 0,
        lastOrderDate: '—',
        region: this.newSupplier.region || 'Greater Accra'
      });
      this.applyFiltersAndPagination();
      this.showAddSheet = false;
      this.adding = false;
    }, 600);
  }

  viewSupplier(supplier: Supplier) {
    this.modalService.open({
      title: `Supplier Profile – ${supplier.supplierCode}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.supplierModal,
      context: { supplier }
    });
  }

  getRatingStars(rating: number): string[] {
    if (rating === 0) return [];
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating) ? 'full' : 'empty');
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Active':   'rgba(76, 175, 80, 0.15)',
      'Inactive': 'rgba(120, 120, 120, 0.15)',
      'Pending':  'rgba(255, 152, 0, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Active':   '#4CAF50',
      'Inactive': '#757575',
      'Pending':  '#FF9800'
    };
    return map[status] ?? '';
  }
}
