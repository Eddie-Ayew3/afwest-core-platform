import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, TextareaComponent, ModalService, AlertDialogService, ToastService,
  DataTableComponent, TolleCellDirective, TableColumn
} from '@tolle_/tolle-ui';
import { InputComponent } from '@tolle_/tolle-ui';
import { PermissionsService } from '../../../../../core/services/permissions.service';


interface Transaction {
  id: number;
  reference: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'Expense' | 'Replenishment';
  submittedBy: string;
  approvedBy: string | null;
  status: 'Approved' | 'Pending' | 'Rejected';
  receipted: boolean;
  site: string;
}

@Component({
  selector: 'app-petty-cash-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    LabelComponent, TextareaComponent,
    DataTableComponent, TolleCellDirective, 
  ],
  templateUrl: './petty-cash-management.component.html',
  styleUrl: './petty-cash-management.component.css'
})
export class PettyCashManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('transactionModal') transactionModal!: TemplateRef<any>;
  @ViewChild('newExpenseModal') newExpenseModal!: TemplateRef<any>;
  private modalRef: any;
  private permissions = inject(PermissionsService);

  columns: TableColumn[] = [
    { key: 'reference', label: 'Reference' },
    { key: 'description', label: 'Description' },
    { key: 'category', label: 'Category' },
    { key: 'site', label: 'Site' },
    { key: 'submittedBy', label: 'Submitted By' },
    { key: 'amount', label: 'Amount' },
    { key: 'receipt', label: 'Receipt' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  transactions: Transaction[] = [
    { id: 1,  reference: 'PC-2025-001', date: '2025-02-28', description: 'Fuel for patrol vehicle',            category: 'Transport',     amount: 450,  type: 'Expense',       submittedBy: 'Kofi Asante',     approvedBy: 'James Darko',  status: 'Approved', receipted: true,  site: 'Head Office – Accra' },
    { id: 2,  reference: 'PC-2025-002', date: '2025-02-27', description: 'Office stationery purchase',         category: 'Stationery',    amount: 185,  type: 'Expense',       submittedBy: 'Adwoa Kyei',      approvedBy: 'James Darko',  status: 'Approved', receipted: true,  site: 'Kumasi Branch' },
    { id: 3,  reference: 'PC-2025-003', date: '2025-02-26', description: 'Monthly replenishment – Q1',        category: 'Replenishment', amount: 3000, type: 'Replenishment', submittedBy: 'Finance Dept.',   approvedBy: 'Abena Asare',  status: 'Approved', receipted: true,  site: 'Head Office – Accra' },
    { id: 4,  reference: 'PC-2025-004', date: '2025-02-25', description: 'Guard meal allowance – Night shift', category: 'Allowances',    amount: 360,  type: 'Expense',       submittedBy: 'Kweku Baffoe',    approvedBy: 'James Darko',  status: 'Approved', receipted: false, site: 'Tema Industrial' },
    { id: 5,  reference: 'PC-2025-005', date: '2025-02-24', description: 'Printer cartridge replacement',     category: 'Stationery',    amount: 220,  type: 'Expense',       submittedBy: 'Nana Acheampong', approvedBy: null,           status: 'Pending',  receipted: false, site: 'Cape Coast Post' },
    { id: 6,  reference: 'PC-2025-006', date: '2025-02-23', description: 'First aid kit restock',             category: 'Medical',       amount: 310,  type: 'Expense',       submittedBy: 'Akua Tetteh',     approvedBy: 'Abena Asare',  status: 'Approved', receipted: true,  site: 'Takoradi Branch' },
    { id: 7,  reference: 'PC-2025-007', date: '2025-02-22', description: 'Taxi fare – client meeting',        category: 'Transport',     amount: 80,   type: 'Expense',       submittedBy: 'Ama Boateng',     approvedBy: null,           status: 'Pending',  receipted: false, site: 'Head Office – Accra' },
    { id: 8,  reference: 'PC-2025-008', date: '2025-02-20', description: 'Cleaning supplies – branch',        category: 'Maintenance',   amount: 140,  type: 'Expense',       submittedBy: 'Yaw Darko',       approvedBy: 'James Darko',  status: 'Approved', receipted: true,  site: 'Kumasi Branch' },
    { id: 9,  reference: 'PC-2025-009', date: '2025-02-18', description: 'Torch batteries – night patrol',    category: 'Equipment',     amount: 95,   type: 'Expense',       submittedBy: 'Kojo Agyemang',   approvedBy: null,           status: 'Rejected', receipted: false, site: 'Tema Industrial' },
    { id: 10, reference: 'PC-2025-010', date: '2025-02-15', description: 'Emergency replenishment – Takoradi',category: 'Replenishment', amount: 1500, type: 'Replenishment', submittedBy: 'Finance Dept.',   approvedBy: 'Abena Asare',  status: 'Approved', receipted: true,  site: 'Takoradi Branch' },
    { id: 11, reference: 'PC-2025-011', date: '2025-02-12', description: 'Refreshments – staff briefing',     category: 'Miscellaneous', amount: 250,  type: 'Expense',       submittedBy: 'Kwame Mensah',    approvedBy: null,           status: 'Pending',  receipted: false, site: 'Head Office – Accra' },
    { id: 12, reference: 'PC-2025-012', date: '2025-02-10', description: 'Postage and courier fees',          category: 'Postage',       amount: 55,   type: 'Expense',       submittedBy: 'Efua Asante',     approvedBy: 'James Darko',  status: 'Approved', receipted: true,  site: 'Cape Coast Post' },
  ];

  filteredTransactions: Transaction[] = [];
  showFilterPanel = false;
  submitting = false;

  filterStatus: 'All' | 'Approved' | 'Pending' | 'Rejected' = 'All';
  filterType: 'All' | 'Expense' | 'Replenishment' = 'All';
  filterCategory = 'All';

  readonly CATEGORY_LIMITS: Record<string, number> = {
    Transport: 500, Stationery: 300, Allowances: 400, Medical: 600,
    Maintenance: 400, Equipment: 800, Postage: 100, Miscellaneous: 250
  };

  newExpense = { description: '', category: '', amount: 0, site: '', notes: '' };

  get currentBalance(): number {
    return this.transactions.filter(t => t.status === 'Approved')
      .reduce((acc, t) => t.type === 'Replenishment' ? acc + t.amount : acc - t.amount, 0);
  }
  get monthlyExpenses(): number {
    return this.transactions.filter(t => t.type === 'Expense' && t.status === 'Approved')
      .reduce((acc, t) => acc + t.amount, 0);
  }
  get monthlyReplenishment(): number {
    return this.transactions.filter(t => t.type === 'Replenishment' && t.status === 'Approved')
      .reduce((acc, t) => acc + t.amount, 0);
  }
  get pendingCount(): number { return this.transactions.filter(t => t.status === 'Pending').length; }
  get categories(): string[] { return [...new Set(this.transactions.map(t => t.category))].sort(); }
  get isApprover(): boolean { return this.permissions.isGlobal(); }
  get categoryLimitExceeded(): boolean {
    const limit = this.CATEGORY_LIMITS[this.newExpense.category];
    return limit !== undefined && +this.newExpense.amount > limit;
  }
  getCategoryLimit(): number | null { return this.CATEGORY_LIMITS[this.newExpense.category] ?? null; }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filterStatus !== 'All') count++;
    if (this.filterType !== 'All') count++;
    if (this.filterCategory !== 'All') count++;
    return count;
  }

  ngOnInit() {
    this.transactions = this.permissions.filterBySite(this.transactions);
    this.applyFilter();
  }

  applyFilter() {
    let result = [...this.transactions];
    
    // Apply status filter
    if (this.filterStatus !== 'All') result = result.filter(t => t.status === this.filterStatus);
    
    // Apply type filter
    if (this.filterType !== 'All') result = result.filter(t => t.type === this.filterType);
    
    // Apply category filter
    if (this.filterCategory !== 'All') result = result.filter(t => t.category === this.filterCategory);
    
    this.filteredTransactions = result;
  }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.filterStatus = 'All';
    this.filterType = 'All';
    this.filterCategory = 'All';
    this.applyFilter();
  }

  approveTransaction(t: Transaction) {
    const ref = this.alertDialog.open({
      title: 'Approve Expense?',
      description: `Approve ${t.reference} for ${this.formatGhs(t.amount)}? This will mark it as approved.`,
      actionText: 'Approve'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      t.status = 'Approved';
      t.approvedBy = this.permissions.displayName;
      this.applyFilter();
      this.toast.show({ title: 'Expense Approved', description: `${t.reference} has been approved.`, variant: 'success' });
    });
  }

  rejectTransaction(t: Transaction) {
    const ref = this.alertDialog.open({
      title: 'Reject Expense?',
      description: `Reject ${t.reference} for ${this.formatGhs(t.amount)}? This action cannot be undone.`,
      actionText: 'Reject',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      t.status = 'Rejected';
      this.applyFilter();
      this.toast.show({ title: 'Expense Rejected', description: `${t.reference} has been rejected.`, variant: 'destructive' });
    });
  }

  openExpenseSheet() {
    this.newExpense = { description: '', category: '', amount: 0, site: '', notes: '' };
    this.modalRef = this.modalService.open({
      title: 'New Expense Claim',
      backdropClose: true,
      size: 'lg',
      showCloseButton: true,
      content: this.newExpenseModal
    });
  }

  submitExpense() {
    this.submitting = true;
    setTimeout(() => {
      this.transactions.unshift({
        id: Date.now(),
        reference: `PC-2025-${String(this.transactions.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        description: this.newExpense.description || 'New Expense',
        category: this.newExpense.category || 'Miscellaneous',
        amount: this.newExpense.amount,
        type: 'Expense',
        submittedBy: 'You',
        approvedBy: null,
        status: 'Pending',
        receipted: false,
        site: this.newExpense.site || 'Head Office – Accra'
      });
      this.applyFilter();
      this.submitting = false;
      if (this.modalRef) { this.modalRef.close(); }
      this.toast.show({ title: 'Expense Submitted', description: 'Your expense claim has been submitted and is pending approval.', variant: 'success' });
    }, 600);
  }

  viewTransaction(t: Transaction) {
    this.modalService.open({
      title: `Transaction – ${t.reference}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.transactionModal,
      context: { t }
    });
  }

  formatGhs(amount: number): string { return `₵${amount.toLocaleString()}`; }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Approved': 'rgba(76, 175, 80, 0.15)',
      'Pending':  'rgba(255, 152, 0, 0.15)',
      'Rejected': 'rgba(244, 67, 54, 0.15)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Approved': '#4CAF50',
      'Pending':  '#FF9800',
      'Rejected': '#F44336'
    };
    return map[status] ?? '';
  }
}
