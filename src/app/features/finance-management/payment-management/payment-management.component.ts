import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent, BadgeComponent, InputComponent,
  SelectComponent, SelectItemComponent,
  DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  LabelComponent, ModalService,
  DataTableComponent, TolleCellDirective, TableColumn,
  AlertDialogService, ToastService
} from '@tolle_/tolle-ui';

export interface ClientPayment {
  id: string;
  invoiceRef: string;
  clientId: string;
  clientName: string;
  servicePeriod: string;
  amountDue: number;
  amountPaid: number;
  method: 'bank_transfer' | 'cash' | 'mobile_money' | 'check';
  status: 'pending' | 'partial' | 'completed' | 'overdue';
  dueDate: string;
  paymentDate: string;
  description: string;
  bankRef?: string;
}

@Component({
  selector: 'app-payment-management',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent,
    SelectComponent, SelectItemComponent,
    DropdownMenuComponent, DropdownTriggerDirective, TooltipDirective,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
    DataTableComponent, TolleCellDirective,
  ],
  templateUrl: './payment-management.component.html',
  styleUrl: './payment-management.component.css'
})
export class PaymentManagementComponent implements OnInit {
  private modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('paymentModal') paymentModal!: TemplateRef<any>;

  columns: TableColumn[] = [
    { key: 'invoice',   label: 'Invoice'         },
    { key: 'client',    label: 'Client'          },
    { key: 'amountDue', label: 'Amount Due'      },
    { key: 'amountPaid',label: 'Amount Paid'     },
    { key: 'balance',   label: 'Balance'         },
    { key: 'method',    label: 'Method'          },
    { key: 'dueDate',   label: 'Due Date'        },
    { key: 'status',    label: 'Status'          },
    { key: 'actions',   label: ''                },
  ];

  paymentData: ClientPayment[] = [
    {
      id: 'CP-001', invoiceRef: 'INV-2025-001',
      clientId: 'CL-001', clientName: 'Accra Commercial Bank',
      servicePeriod: 'March 2025', amountDue: 18500, amountPaid: 18500,
      method: 'bank_transfer', status: 'completed',
      dueDate: '2025-03-31', paymentDate: '2025-03-28',
      description: 'Security services — Head Office, March 2025',
      bankRef: 'GCB-TXN-20250328-001'
    },
    {
      id: 'CP-002', invoiceRef: 'INV-2025-002',
      clientId: 'CL-003', clientName: 'Kumasi Breweries Ltd',
      servicePeriod: 'March 2025', amountDue: 12400, amountPaid: 6200,
      method: 'bank_transfer', status: 'partial',
      dueDate: '2025-03-31', paymentDate: '2025-03-20',
      description: 'Security services — Kumasi Plant, March 2025',
      bankRef: 'GCB-TXN-20250320-004'
    },
    {
      id: 'CP-003', invoiceRef: 'INV-2025-003',
      clientId: 'CL-005', clientName: 'Takoradi Port Authority',
      servicePeriod: 'March 2025', amountDue: 22000, amountPaid: 0,
      method: 'bank_transfer', status: 'overdue',
      dueDate: '2025-03-15', paymentDate: '',
      description: 'Security services — Port Gate, March 2025',
    },
    {
      id: 'CP-004', invoiceRef: 'INV-2025-004',
      clientId: 'CL-007', clientName: 'Ghana Revenue Authority',
      servicePeriod: 'March 2025', amountDue: 9800, amountPaid: 0,
      method: 'mobile_money', status: 'pending',
      dueDate: '2025-04-05', paymentDate: '',
      description: 'Security services — GRA Tema Office, March 2025',
    },
    {
      id: 'CP-005', invoiceRef: 'INV-2025-005',
      clientId: 'CL-002', clientName: 'Stanbic Bank Ghana',
      servicePeriod: 'March 2025', amountDue: 15600, amountPaid: 15600,
      method: 'bank_transfer', status: 'completed',
      dueDate: '2025-03-31', paymentDate: '2025-03-30',
      description: 'Security services — Airport City Branch, March 2025',
      bankRef: 'SBG-TXN-20250330-007'
    },
    {
      id: 'CP-006', invoiceRef: 'INV-2025-006',
      clientId: 'CL-009', clientName: 'Cape Coast Teaching Hospital',
      servicePeriod: 'March 2025', amountDue: 7200, amountPaid: 0,
      method: 'check', status: 'pending',
      dueDate: '2025-04-10', paymentDate: '',
      description: 'Security services — Main Hospital, March 2025',
    },
    {
      id: 'CP-007', invoiceRef: 'INV-2025-007',
      clientId: 'CL-004', clientName: 'Volta River Authority',
      servicePeriod: 'February 2025', amountDue: 11000, amountPaid: 11000,
      method: 'bank_transfer', status: 'completed',
      dueDate: '2025-02-28', paymentDate: '2025-02-25',
      description: 'Security services — Akosombo Dam, February 2025',
      bankRef: 'GCB-TXN-20250225-002'
    },
    {
      id: 'CP-008', invoiceRef: 'INV-2025-008',
      clientId: 'CL-006', clientName: 'Tema Oil Refinery',
      servicePeriod: 'March 2025', amountDue: 28000, amountPaid: 14000,
      method: 'bank_transfer', status: 'partial',
      dueDate: '2025-03-31', paymentDate: '2025-03-22',
      description: 'Security services — Refinery Complex, March 2025',
      bankRef: 'GCB-TXN-20250322-009'
    },
  ];

  filteredPayments: ClientPayment[] = [];
  searchTerm       = '';
  filterStatus     = 'All';
  filterMethod     = 'All';
  filterPeriod     = 'All';
  showFilterPanel  = false;

  readonly statuses       = ['pending', 'partial', 'completed', 'overdue'];
  readonly paymentMethods = ['bank_transfer', 'cash', 'mobile_money', 'check'];
  readonly periods        = ['March 2025', 'February 2025', 'January 2025'];

  get totalReceivable(): number { return this.filteredPayments.reduce((s, p) => s + p.amountDue, 0); }
  get totalCollected():  number { return this.filteredPayments.reduce((s, p) => s + p.amountPaid, 0); }
  get totalOutstanding():number { return this.totalReceivable - this.totalCollected; }
  get overdueCount():    number { return this.filteredPayments.filter(p => p.status === 'overdue').length; }

  get activeFilterCount(): number {
    let n = 0;
    if (this.filterStatus !== 'All')  n++;
    if (this.filterMethod !== 'All')  n++;
    if (this.filterPeriod !== 'All')  n++;
    return n;
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredPayments = this.paymentData.filter(p => {
      const matchesSearch = !q ||
        p.invoiceRef.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.clientId.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesStatus = this.filterStatus === 'All' || p.status === this.filterStatus;
      const matchesMethod = this.filterMethod === 'All' || p.method === this.filterMethod;
      const matchesPeriod = this.filterPeriod === 'All' || p.servicePeriod === this.filterPeriod;
      return matchesSearch && matchesStatus && matchesMethod && matchesPeriod;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'All';
    this.filterMethod = 'All';
    this.filterPeriod = 'All';
    this.applyFilters();
  }

  toggleFilterPanel(): void { this.showFilterPanel = !this.showFilterPanel; }

  deletePayment(payment: ClientPayment) {
    const ref = this.alertDialog.open({
      title: 'Delete Payment Record?',
      description: `Delete payment record "${payment.invoiceRef || payment.id}"? This cannot be undone.`,
      actionText: 'Delete',
      variant: 'destructive'
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed) return;
      this.paymentData = this.paymentData.filter(p => p.id !== payment.id);
      this.applyFilters();
      this.toast.show({ title: 'Payment Deleted', description: 'The payment record has been deleted.', variant: 'destructive' });
    });
  }

  getBalance(p: ClientPayment): number {
    return p.amountDue - p.amountPaid;
  }

  isOverdue(p: ClientPayment): boolean {
    return p.status !== 'completed' && new Date(p.dueDate) < new Date();
  }

  viewPayment(payment: ClientPayment): void {
    this.modalService.open({
      title: `Invoice — ${payment.invoiceRef}`,
      backdropClose: true,
      size: 'default',
      showCloseButton: true,
      content: this.paymentModal,
      context: { payment }
    });
  }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      completed: 'rgba(34,197,94,0.15)',
      partial:   'rgba(234,179,8,0.15)',
      pending:   'rgba(249,115,22,0.15)',
      overdue:   'rgba(239,68,68,0.15)',
    };
    return map[status] ?? 'rgba(113,113,122,0.15)';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      completed: '#16a34a',
      partial:   '#ca8a04',
      pending:   '#ea580c',
      overdue:   '#dc2626',
    };
    return map[status] ?? '#71717a';
  }

  getMethodIcon(method: string): string {
    const map: Record<string, string> = {
      bank_transfer: 'ri-bank-line',
      cash:          'ri-cash-line',
      mobile_money:  'ri-smartphone-line',
      check:         'ri-file-list-3-line',
    };
    return map[method] ?? 'ri-bank-line';
  }

  formatMethod(method: string): string {
    return method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  getInitials(name: string): string {
    const parts = name.trim().split(' ').filter(p => p.length > 1);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  getCollectionRate(p: ClientPayment): number {
    return p.amountDue > 0 ? Math.round((p.amountPaid / p.amountDue) * 100) : 0;
  }
}
