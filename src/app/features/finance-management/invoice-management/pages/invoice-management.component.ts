import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  CardComponent, CardContentComponent, EmptyStateComponent, PaginationComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService, SheetComponent, SheetContentComponent
} from '@tolle_/tolle-ui';
import { InvoiceActions } from '../stores/invoice.actions';
import { selectInvoices, selectInvoiceLoading, selectInvoiceSaving } from '../stores/invoice.selectors';
import { InvoiceDto, CreateInvoiceDto, CreateInvoiceLineItemDto } from '../models/invoice.model';

interface NewInvoiceForm {
  clientName: string;
  clientId: string;
  clientContact: string;
  servicePeriod: string;
  issueDate: string;
  dueDate: string;
  taxRate: number;
  notes: string;
}

interface NewInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface PaymentForm {
  amount: number;
  method: string;
  paymentDate: string;
  bankRef: string;
  notes: string;
}

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    CardComponent, CardContentComponent, EmptyStateComponent, PaginationComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
    SheetComponent, SheetContentComponent,
  ],
  templateUrl: './invoice-management.component.html',
  styleUrl: './invoice-management.component.css'
})
export class InvoiceManagementComponent implements OnInit {
  private store = inject(Store);
  protected modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  @ViewChild('recordPaymentModal') recordPaymentModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'invoiceRef', label: 'Invoice' },
    { key: 'client',     label: 'Client' },
    { key: 'period',     label: 'Period' },
    { key: 'dueDate',    label: 'Due Date' },
    { key: 'amount',     label: 'Amount (₵)' },
    { key: 'balance',    label: 'Balance (₵)' },
    { key: 'status',     label: 'Status' },
    { key: 'actions',    label: '' },
  ];

  invoices: InvoiceDto[] = [];
  filteredInvoices: InvoiceDto[] = [];
  loading = false;
  saving = false;

  // Filter state
  showFilterPanel = false;
  searchQuery = '';
  filterStatus = 'all';
  filterClient = 'all';
  filterClientBanner: string | null = null;

  // Pagination
  pageSize = 10;
  currentPage = 1;

  get startIndex() { return (this.currentPage - 1) * this.pageSize; }
  get endIndex() { return Math.min(this.startIndex + this.pageSize, this.filteredInvoices.length); }
  get displayedInvoices() { return this.filteredInvoices.slice(this.startIndex, this.endIndex); }

  // Stat cards
  get totalInvoiced() { return this.invoices.reduce((s, i) => s + i.totalAmount, 0); }
  get totalCollected() { return this.invoices.filter(i => i.statusName === 'Paid').reduce((s, i) => s + i.totalAmount, 0); }
  get totalOutstanding() { return this.totalInvoiced - this.totalCollected; }
  get overdueCount() { return this.invoices.filter(i => i.statusName === 'Overdue').length; }

  get activeFilterCount(): number {
    let c = 0;
    if (this.filterStatus !== 'all') c++;
    if (this.filterClient !== 'all') c++;
    return c;
  }

  get uniqueClients(): { id: string; name: string }[] {
    const map = new Map<string, string>();
    this.invoices.forEach(i => map.set(i.clientId, i.clientName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  // New invoice sheet
  showNewInvoiceSheet = false;
  newInvoice: NewInvoiceForm = this.emptyInvoiceForm();
  newInvoiceLines: NewInvoiceLine[] = [{ description: '', quantity: 1, unitPrice: 0 }];

  get newInvoiceSubtotal() {
    return this.newInvoiceLines.reduce((s, l) => s + (l.quantity * l.unitPrice), 0);
  }
  get newInvoiceTax() {
    return Math.round(this.newInvoiceSubtotal * (this.newInvoice.taxRate / 100) * 100) / 100;
  }
  get newInvoiceTotal() { return this.newInvoiceSubtotal + this.newInvoiceTax; }

  // Payment modal
  selectedInvoiceForPayment: InvoiceDto | null = null;
  paymentForm: PaymentForm = this.emptyPaymentForm();

  ngOnInit() {
    this.store.dispatch(InvoiceActions.loadInvoices({ params: { pageNumber: 1, pageSize: 100 } }));

    this.store.select(selectInvoices)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(invoices => {
        this.invoices = invoices;
        this.applyFilters();
      });

    this.store.select(selectInvoiceLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(loading => this.loading = loading);

    this.store.select(selectInvoiceSaving)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(saving => this.saving = saving);
  }

  applyFilter() { this.applyFilters(); }

  applyFilters() {
    let result = [...this.invoices];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.clientName.toLowerCase().includes(q)
      );
    }
    if (this.filterStatus !== 'all') {
      result = result.filter(i => i.statusName.toLowerCase() === this.filterStatus);
    }
    if (this.filterClient !== 'all') {
      result = result.filter(i => i.clientId === this.filterClient);
    }
    this.filteredInvoices = result;
    this.currentPage = 1;
  }

  onSearch() { this.applyFilters(); }

  toggleFilterPanel() { this.showFilterPanel = !this.showFilterPanel; }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.filterClient = 'all';
    this.filterClientBanner = null;
    this.applyFilters();
  }

  onPageSizeChange() { this.currentPage = 1; }

  onPageChange(event: any) {
    this.currentPage = event?.detail ?? event?.page ?? event ?? 1;
  }

  getBalance(invoice: InvoiceDto): number {
    return invoice.statusName === 'Paid' ? 0 : invoice.totalAmount;
  }

  // Create invoice
  openNewInvoiceSheet() {
    this.newInvoice = this.emptyInvoiceForm();
    this.newInvoiceLines = [{ description: '', quantity: 1, unitPrice: 0 }];
    this.showNewInvoiceSheet = true;
  }

  addLineItem() {
    this.newInvoiceLines.push({ description: '', quantity: 1, unitPrice: 0 });
  }

  removeLineItem(index: number) {
    this.newInvoiceLines.splice(index, 1);
  }

  submitNewInvoice() {
    const items: CreateInvoiceLineItemDto[] = this.newInvoiceLines
      .filter(l => l.description.trim())
      .map(l => ({ description: l.description, quantity: l.quantity, unitPrice: l.unitPrice }));
    const dto: CreateInvoiceDto = {
      clientId: this.newInvoice.clientId || this.newInvoice.clientName,
      dueDate: this.newInvoice.dueDate,
      taxAmount: this.newInvoiceTax,
      notes: this.newInvoice.notes,
      lineItems: items
    };
    this.store.dispatch(InvoiceActions.createInvoice({ dto }));
    this.showNewInvoiceSheet = false;
  }

  // Actions
  viewInvoice(invoice: InvoiceDto) {
    this.router.navigate(['../invoice-detail', invoice.id], { relativeTo: this.route });
  }

  markAsSent(invoice: InvoiceDto) {
    const ref = this.alertDialog.open({
      title: 'Mark as Sent?',
      description: `Send invoice "${invoice.invoiceNumber}" to client?`,
      actionText: 'Send',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) this.store.dispatch(InvoiceActions.sendInvoice({ id: invoice.id }));
    });
  }

  openRecordPayment(invoice: InvoiceDto) {
    this.selectedInvoiceForPayment = invoice;
    this.paymentForm = this.emptyPaymentForm();
    this.modalService.open({
      title: 'Record Payment',
      content: this.recordPaymentModal,
      size: 'default',
      showCloseButton: true,
    });
  }

  submitPayment() {
    if (!this.selectedInvoiceForPayment) return;
    this.store.dispatch(InvoiceActions.payInvoice({ id: this.selectedInvoiceForPayment.id }));
    this.modalService.closeAll();
  }

  deleteInvoice(invoice: InvoiceDto) {
    const ref = this.alertDialog.open({
      title: 'Delete Invoice?',
      description: `Delete invoice "${invoice.invoiceNumber}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) this.store.dispatch(InvoiceActions.deleteInvoice({ id: invoice.id }));
    });
  }

  sendInvoice(invoice: InvoiceDto) { this.markAsSent(invoice); }

  payInvoice(invoice: InvoiceDto) { this.openRecordPayment(invoice); }

  cancelInvoice(invoice: InvoiceDto) {
    const ref = this.alertDialog.open({
      title: 'Cancel Invoice?',
      description: `Cancel invoice "${invoice.invoiceNumber}"?`,
      actionText: 'Cancel',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) this.store.dispatch(InvoiceActions.cancelInvoice({ id: invoice.id }));
    });
  }

  // Color helpers
  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      'Draft': 'rgba(148,163,184,0.15)', 'draft': 'rgba(148,163,184,0.15)',
      'Sent': 'rgba(33,150,243,0.15)',   'sent': 'rgba(33,150,243,0.15)',
      'Paid': 'rgba(34,197,94,0.15)',    'paid': 'rgba(34,197,94,0.15)',
      'Overdue': 'rgba(239,68,68,0.15)', 'overdue': 'rgba(239,68,68,0.15)',
      'Cancelled': 'rgba(148,163,184,0.15)', 'cancelled': 'rgba(148,163,184,0.15)',
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      'Draft': '#9CA3AF',    'draft': '#9CA3AF',
      'Sent': '#2196F3',     'sent': '#2196F3',
      'Paid': '#16a34a',     'paid': '#16a34a',
      'Overdue': '#dc2626',  'overdue': '#dc2626',
      'Cancelled': '#9CA3AF', 'cancelled': '#9CA3AF',
    };
    return map[status] ?? '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  private emptyInvoiceForm(): NewInvoiceForm {
    return { clientName: '', clientId: '', clientContact: '', servicePeriod: '', issueDate: '', dueDate: '', taxRate: 0, notes: '' };
  }

  private emptyPaymentForm(): PaymentForm {
    return { amount: 0, method: 'bank_transfer', paymentDate: '', bankRef: '', notes: '' };
  }
}
