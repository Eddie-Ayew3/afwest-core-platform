import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  CardComponent, CardContentComponent, EmptyStateComponent, PaginationComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService, SheetComponent, SheetContentComponent
} from '@tolle_/tolle-ui';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'cash' | 'mobile_money' | 'cheque';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  clientContact: string;
  issueDate: string;
  dueDate: string;
  servicePeriod: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  notes?: string;
  sentDate?: string;
  paidDate?: string;
}

export interface InvoicePaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string;
  bankRef?: string;
  recordedBy: string;
  notes?: string;
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
  readonly modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  @ViewChild('recordPaymentModal') recordPaymentModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'invoiceRef', label: 'Invoice' },
    { key: 'client', label: 'Client' },
    { key: 'period', label: 'Period' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'amount', label: 'Amount (₵)' },
    { key: 'balance', label: 'Balance (₵)' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '' },
  ];

  invoices: Invoice[] = [
    {
      id: 'INV-2025-001', clientId: 'CLT001', clientName: 'GoldFields Ghana Ltd.', clientContact: 'Kwame Asante-Berko',
      issueDate: '2025-03-01', dueDate: '2025-03-31', servicePeriod: 'March 2025', status: 'paid',
      lineItems: [
        { id: 'LI-001-1', description: 'Guard Services – Head Office Accra, March 2025', quantity: 4, unitPrice: 4500, total: 18000 },
        { id: 'LI-001-2', description: 'Equipment Rental – CCTV Monitoring', quantity: 1, unitPrice: 2400, total: 2400 },
        { id: 'LI-001-3', description: 'Supervisor Allowance', quantity: 1, unitPrice: 1200, total: 1200 },
      ],
      subtotal: 21600, taxRate: 0.15, taxAmount: 3240, totalAmount: 24840, amountPaid: 24840,
      paidDate: '2025-03-28', sentDate: '2025-03-02',
      notes: 'Payment received via GCB bank transfer.'
    },
    {
      id: 'INV-2025-002', clientId: 'CLT002', clientName: 'Accra Mall Management', clientContact: 'Ama Darko-Mensah',
      issueDate: '2025-03-01', dueDate: '2025-03-31', servicePeriod: 'March 2025', status: 'paid',
      lineItems: [
        { id: 'LI-002-1', description: 'Guard Services – Accra Mall, March 2025', quantity: 6, unitPrice: 2400, total: 14400 },
        { id: 'LI-002-2', description: 'Night Patrol Officers – Accra Mall', quantity: 2, unitPrice: 1400, total: 2800 },
      ],
      subtotal: 17200, taxRate: 0.15, taxAmount: 2580, totalAmount: 19780, amountPaid: 19780,
      paidDate: '2025-03-30', sentDate: '2025-03-02',
    },
    {
      id: 'INV-2025-003', clientId: 'CLT003', clientName: 'Kumasi Hive Ventures', clientContact: 'Kofi Boateng',
      issueDate: '2025-03-01', dueDate: '2025-03-31', servicePeriod: 'March 2025', status: 'overdue',
      lineItems: [
        { id: 'LI-003-1', description: 'Guard Services – Kumasi Branch, March 2025', quantity: 3, unitPrice: 3200, total: 9600 },
        { id: 'LI-003-2', description: 'Emergency Response Standby', quantity: 1, unitPrice: 2600, total: 2600 },
      ],
      subtotal: 12200, taxRate: 0.15, taxAmount: 1830, totalAmount: 14030, amountPaid: 0,
      sentDate: '2025-03-02',
    },
    {
      id: 'INV-2025-004', clientId: 'CLT004', clientName: 'Takoradi Harbour Authority', clientContact: 'Yaw Acheampong',
      issueDate: '2025-03-01', dueDate: '2025-03-28', servicePeriod: 'March 2025', status: 'overdue',
      lineItems: [
        { id: 'LI-004-1', description: 'Guard Services – Takoradi Branch, March 2025', quantity: 8, unitPrice: 3200, total: 25600 },
        { id: 'LI-004-2', description: 'Equipment Rental – Metal Detector Units', quantity: 4, unitPrice: 600, total: 2400 },
        { id: 'LI-004-3', description: 'Supervisor Allowance', quantity: 2, unitPrice: 1200, total: 2400 },
      ],
      subtotal: 30400, taxRate: 0.15, taxAmount: 4560, totalAmount: 34960, amountPaid: 17480,
      sentDate: '2025-03-02',
      notes: 'Partial payment received via mobile money on 2025-03-22.'
    },
    {
      id: 'INV-2025-005', clientId: 'CLT005', clientName: 'Cape Coast Teaching Hospital', clientContact: 'Abena Quansah',
      issueDate: '2025-03-05', dueDate: '2025-04-05', servicePeriod: 'March 2025', status: 'sent',
      lineItems: [
        { id: 'LI-005-1', description: 'Guard Services – Cape Coast Post, March 2025', quantity: 2, unitPrice: 3200, total: 6400 },
        { id: 'LI-005-2', description: 'Training & Briefing Sessions', quantity: 1, unitPrice: 1200, total: 1200 },
      ],
      subtotal: 7600, taxRate: 0.15, taxAmount: 1140, totalAmount: 8740, amountPaid: 0,
      sentDate: '2025-03-06',
    },
    {
      id: 'INV-2025-006', clientId: 'CLT006', clientName: 'Volta River Authority', clientContact: 'Nana Asiedu',
      issueDate: '2025-03-01', dueDate: '2025-03-25', servicePeriod: 'March 2025', status: 'overdue',
      lineItems: [
        { id: 'LI-006-1', description: 'Guard Services – Tema Industrial, March 2025', quantity: 5, unitPrice: 3000, total: 15000 },
        { id: 'LI-006-2', description: 'Night Patrol Officers – Tema Industrial', quantity: 2, unitPrice: 1400, total: 2800 },
      ],
      subtotal: 17800, taxRate: 0.15, taxAmount: 2670, totalAmount: 20470, amountPaid: 0,
      sentDate: '2025-03-01',
    },
    {
      id: 'INV-2025-007', clientId: 'CLT001', clientName: 'GoldFields Ghana Ltd.', clientContact: 'Kwame Asante-Berko',
      issueDate: '2025-02-01', dueDate: '2025-02-28', servicePeriod: 'February 2025', status: 'paid',
      lineItems: [
        { id: 'LI-007-1', description: 'Guard Services – Head Office Accra, February 2025', quantity: 4, unitPrice: 4500, total: 18000 },
        { id: 'LI-007-2', description: 'Equipment Rental – CCTV Monitoring', quantity: 1, unitPrice: 2400, total: 2400 },
        { id: 'LI-007-3', description: 'Supervisor Allowance', quantity: 1, unitPrice: 1200, total: 1200 },
      ],
      subtotal: 21600, taxRate: 0.15, taxAmount: 3240, totalAmount: 24840, amountPaid: 24840,
      paidDate: '2025-02-25', sentDate: '2025-02-03',
    },
    {
      id: 'INV-2025-008', clientId: 'CLT003', clientName: 'Kumasi Hive Ventures', clientContact: 'Kofi Boateng',
      issueDate: '2025-02-01', dueDate: '2025-02-28', servicePeriod: 'February 2025', status: 'paid',
      lineItems: [
        { id: 'LI-008-1', description: 'Guard Services – Kumasi Branch, February 2025', quantity: 3, unitPrice: 3200, total: 9600 },
        { id: 'LI-008-2', description: 'Emergency Response Standby', quantity: 1, unitPrice: 2200, total: 2200 },
      ],
      subtotal: 11800, taxRate: 0.15, taxAmount: 1770, totalAmount: 13570, amountPaid: 13570,
      paidDate: '2025-02-27', sentDate: '2025-02-03',
    },
    {
      id: 'INV-2025-009', clientId: 'CLT007', clientName: 'Ahanta West Municipal Assembly', clientContact: 'Efua Koomson',
      issueDate: '2025-03-10', dueDate: '2025-04-10', servicePeriod: 'March 2025', status: 'draft',
      lineItems: [
        { id: 'LI-009-1', description: 'Guard Services – Takoradi Branch, March 2025', quantity: 3, unitPrice: 3000, total: 9000 },
        { id: 'LI-009-2', description: 'Training & Briefing Sessions', quantity: 1, unitPrice: 800, total: 800 },
      ],
      subtotal: 9800, taxRate: 0.15, taxAmount: 1470, totalAmount: 11270, amountPaid: 0,
    },
    {
      id: 'INV-2025-010', clientId: 'CLT008', clientName: 'KNUST Research Institute', clientContact: 'Akosua Frimpong-Boateng',
      issueDate: '2025-02-15', dueDate: '2025-03-15', servicePeriod: 'February 2025', status: 'cancelled',
      lineItems: [
        { id: 'LI-010-1', description: 'Guard Services – Kumasi Branch, February 2025', quantity: 2, unitPrice: 3200, total: 6400 },
        { id: 'LI-010-2', description: 'Equipment Rental – Metal Detector Units', quantity: 2, unitPrice: 600, total: 1200 },
      ],
      subtotal: 7600, taxRate: 0.15, taxAmount: 1140, totalAmount: 8740, amountPaid: 0,
      notes: 'Cancelled due to contract termination.',
    },
  ];

  invoicePayments: InvoicePaymentRecord[] = [
    { id: 'PAY-2025-001', invoiceId: 'INV-2025-001', amount: 24840, method: 'bank_transfer', paymentDate: '2025-03-28', bankRef: 'GCB-TXN-20250328-001', recordedBy: 'Kwame Mensah' },
    { id: 'PAY-2025-002', invoiceId: 'INV-2025-002', amount: 19780, method: 'bank_transfer', paymentDate: '2025-03-30', bankRef: 'SBG-TXN-20250330-007', recordedBy: 'Kwame Mensah' },
    { id: 'PAY-2025-003', invoiceId: 'INV-2025-004', amount: 17480, method: 'mobile_money', paymentDate: '2025-03-22', bankRef: 'MM-REF-THA-20250322', recordedBy: 'Ama Boateng' },
    { id: 'PAY-2025-004', invoiceId: 'INV-2025-007', amount: 24840, method: 'bank_transfer', paymentDate: '2025-02-25', bankRef: 'GCB-TXN-20250225-002', recordedBy: 'Kwame Mensah' },
    { id: 'PAY-2025-005', invoiceId: 'INV-2025-008', amount: 13570, method: 'bank_transfer', paymentDate: '2025-02-27', bankRef: 'GCB-TXN-20250227-004', recordedBy: 'Ama Boateng' },
  ];

  filteredInvoices: Invoice[] = [];
  displayedInvoices: Invoice[] = [];
  searchQuery = '';
  showFilterPanel = false;
  filterStatus: string = 'all';
  filterClient: string = 'all';
  currentPage = 1;
  pageSize = 10;
  filterClientBanner = '';

  // New invoice sheet
  showNewInvoiceSheet = false;
  newInvoice = {
    clientId: '', clientName: '', clientContact: '',
    servicePeriod: '', issueDate: '', dueDate: '',
    taxRate: 15, notes: ''
  };
  newInvoiceLines: { description: string; quantity: number; unitPrice: number }[] = [
    { description: '', quantity: 1, unitPrice: 0 }
  ];

  // Record payment modal state
  selectedInvoiceForPayment: Invoice | null = null;
  paymentForm = { amount: 0, method: 'bank_transfer' as PaymentMethod, paymentDate: '', bankRef: '', notes: '' };

  get totalInvoiced(): number { return this.invoices.reduce((s, i) => s + i.totalAmount, 0); }
  get totalCollected(): number { return this.invoices.reduce((s, i) => s + i.amountPaid, 0); }
  get totalOutstanding(): number { return this.totalInvoiced - this.totalCollected; }
  get overdueCount(): number { return this.invoices.filter(i => i.status === 'overdue').length; }
  get startIndex(): number { return (this.currentPage - 1) * this.pageSize; }
  get endIndex(): number { return Math.min(this.startIndex + this.pageSize, this.filteredInvoices.length); }
  get activeFilterCount(): number {
    let c = 0;
    if (this.filterStatus !== 'all') c++;
    if (this.filterClient !== 'all') c++;
    if (this.searchQuery.trim()) c++;
    return c;
  }
  get uniqueClients(): { id: string; name: string }[] {
    const seen = new Set<string>();
    return this.invoices
      .filter(i => { if (seen.has(i.clientId)) return false; seen.add(i.clientId); return true; })
      .map(i => ({ id: i.clientId, name: i.clientName }));
  }
  get newInvoiceSubtotal(): number { return this.newInvoiceLines.reduce((s, l) => s + (l.quantity * l.unitPrice), 0); }
  get newInvoiceTax(): number { return this.newInvoiceSubtotal * (this.newInvoice.taxRate / 100); }
  get newInvoiceTotal(): number { return this.newInvoiceSubtotal + this.newInvoiceTax; }

  ngOnInit(): void {
    const clientId = this.route.snapshot.queryParams['clientId'];
    if (clientId) {
      this.filterClient = clientId;
      const client = this.invoices.find(i => i.clientId === clientId);
      if (client) this.filterClientBanner = client.clientName;
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.invoices];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.clientName.toLowerCase().includes(q) ||
        i.clientId.toLowerCase().includes(q) ||
        i.servicePeriod.toLowerCase().includes(q)
      );
    }
    if (this.filterStatus !== 'all') result = result.filter(i => i.status === this.filterStatus);
    if (this.filterClient !== 'all') result = result.filter(i => i.clientId === this.filterClient);
    this.filteredInvoices = result;
    this.currentPage = 1;
    this.updateDisplayed();
  }

  updateDisplayed(): void {
    this.displayedInvoices = this.filteredInvoices.slice(this.startIndex, this.endIndex);
  }

  onSearch(): void { this.applyFilters(); }
  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }
  clearFilters(): void {
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.filterClient = 'all';
    this.filterClientBanner = '';
    this.applyFilters();
  }
  onPageSizeChange(): void { this.currentPage = 1; this.updateDisplayed(); }
  onPageChange(event: any): void {
    this.currentPage = (event as any).detail?.page ?? (event as any).page ?? event ?? 1;
    this.updateDisplayed();
  }

  getBalance(inv: Invoice): number { return inv.totalAmount - inv.amountPaid; }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      draft:     'rgba(120,120,120,0.15)',
      sent:      'rgba(33,150,243,0.15)',
      paid:      'rgba(76,175,80,0.15)',
      overdue:   'rgba(244,67,54,0.15)',
      cancelled: 'rgba(158,158,158,0.12)',
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      draft:     '#757575',
      sent:      '#2196F3',
      paid:      '#4CAF50',
      overdue:   '#F44336',
      cancelled: '#9E9E9E',
    };
    return map[status] ?? '';
  }

  viewInvoice(inv: Invoice): void {
    this.router.navigate(['/finance/invoice-management', inv.id]);
  }

  openRecordPayment(inv: Invoice): void {
    this.selectedInvoiceForPayment = inv;
    this.paymentForm = {
      amount: this.getBalance(inv),
      method: 'bank_transfer',
      paymentDate: new Date().toISOString().slice(0, 10),
      bankRef: '',
      notes: ''
    };
    this.modalService.open({
      title: `Record Payment – ${inv.id}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.recordPaymentModal,
    });
  }

  submitPayment(): void {
    const inv = this.selectedInvoiceForPayment;
    if (!inv) return;
    const newPay: InvoicePaymentRecord = {
      id: `PAY-2025-${String(this.invoicePayments.length + 1).padStart(3, '0')}`,
      invoiceId: inv.id,
      amount: this.paymentForm.amount,
      method: this.paymentForm.method,
      paymentDate: this.paymentForm.paymentDate,
      bankRef: this.paymentForm.bankRef || undefined,
      recordedBy: 'Current User',
      notes: this.paymentForm.notes || undefined,
    };
    this.invoicePayments.push(newPay);
    inv.amountPaid += this.paymentForm.amount;
    if (inv.amountPaid >= inv.totalAmount) {
      inv.status = 'paid';
      inv.paidDate = this.paymentForm.paymentDate;
    }
    this.modalService.closeAll();
    this.applyFilters();
    this.toast.show({ title: 'Payment Recorded', description: `₵${this.paymentForm.amount.toLocaleString()} recorded against ${inv.id}.`, variant: 'success' });
  }

  markAsSent(inv: Invoice): void {
    inv.status = 'sent';
    inv.sentDate = new Date().toISOString().slice(0, 10);
    this.applyFilters();
    this.toast.show({ title: 'Invoice Sent', description: `${inv.id} marked as sent.`, variant: 'success' });
  }

  deleteInvoice(inv: Invoice): void {
    const ref = this.alertDialog.open({
      title: 'Delete Invoice?',
      description: `Delete invoice ${inv.id} for ${inv.clientName}? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.invoices = this.invoices.filter(i => i.id !== inv.id);
      this.applyFilters();
      this.toast.show({ title: 'Invoice Deleted', description: `${inv.id} has been deleted.`, variant: 'destructive' });
    });
  }

  // New invoice sheet
  openNewInvoiceSheet(): void {
    this.newInvoice = { clientId: '', clientName: '', clientContact: '', servicePeriod: '', issueDate: '', dueDate: '', taxRate: 15, notes: '' };
    this.newInvoiceLines = [{ description: '', quantity: 1, unitPrice: 0 }];
    this.showNewInvoiceSheet = true;
  }

  addLineItem(): void { this.newInvoiceLines.push({ description: '', quantity: 1, unitPrice: 0 }); }
  removeLineItem(i: number): void { if (this.newInvoiceLines.length > 1) this.newInvoiceLines.splice(i, 1); }

  submitNewInvoice(): void {
    if (!this.newInvoice.clientName || !this.newInvoice.servicePeriod || !this.newInvoice.issueDate || !this.newInvoice.dueDate) return;
    const subtotal = this.newInvoiceSubtotal;
    const taxAmount = +(subtotal * (this.newInvoice.taxRate / 100)).toFixed(2);
    const totalAmount = +(subtotal + taxAmount).toFixed(2);
    const inv: Invoice = {
      id: `INV-2025-${String(this.invoices.length + 1).padStart(3, '0')}`,
      clientId: this.newInvoice.clientId || 'CLT-NEW',
      clientName: this.newInvoice.clientName,
      clientContact: this.newInvoice.clientContact,
      issueDate: this.newInvoice.issueDate,
      dueDate: this.newInvoice.dueDate,
      servicePeriod: this.newInvoice.servicePeriod,
      status: 'draft',
      lineItems: this.newInvoiceLines.map((l, idx) => ({
        id: `LI-NEW-${idx + 1}`,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        total: +(l.quantity * l.unitPrice).toFixed(2),
      })),
      subtotal, taxRate: this.newInvoice.taxRate / 100, taxAmount, totalAmount, amountPaid: 0,
      notes: this.newInvoice.notes || undefined,
    };
    this.invoices.unshift(inv);
    this.applyFilters();
    this.showNewInvoiceSheet = false;
    this.toast.show({ title: 'Invoice Created', description: `${inv.id} created as draft.`, variant: 'success' });
  }
}
