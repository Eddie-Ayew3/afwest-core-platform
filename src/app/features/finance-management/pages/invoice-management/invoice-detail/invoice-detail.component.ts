import { Component, OnInit, inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { Invoice, InvoicePaymentRecord, PaymentMethod } from '../invoice-management.component';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
    SelectComponent, SelectItemComponent,
    BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css'
})
export class InvoiceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);
  @ViewChild('recordPaymentModal') recordPaymentModal!: TemplateRef<any>;

  invoice: Invoice | null = null;
  invoicePayments: InvoicePaymentRecord[] = [];

  // Payment form state
  paymentForm = { amount: 0, method: 'bank_transfer' as PaymentMethod, paymentDate: '', bankRef: '', notes: '' };

  // Full mock dataset (same as list component — in production this would be a shared service)
  private allInvoices: Invoice[] = [
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

  private allPayments: InvoicePaymentRecord[] = [
    { id: 'PAY-2025-001', invoiceId: 'INV-2025-001', amount: 24840, method: 'bank_transfer', paymentDate: '2025-03-28', bankRef: 'GCB-TXN-20250328-001', recordedBy: 'Kwame Mensah' },
    { id: 'PAY-2025-002', invoiceId: 'INV-2025-002', amount: 19780, method: 'bank_transfer', paymentDate: '2025-03-30', bankRef: 'SBG-TXN-20250330-007', recordedBy: 'Kwame Mensah' },
    { id: 'PAY-2025-003', invoiceId: 'INV-2025-004', amount: 17480, method: 'mobile_money', paymentDate: '2025-03-22', bankRef: 'MM-REF-THA-20250322', recordedBy: 'Ama Boateng' },
    { id: 'PAY-2025-004', invoiceId: 'INV-2025-007', amount: 24840, method: 'bank_transfer', paymentDate: '2025-02-25', bankRef: 'GCB-TXN-20250225-002', recordedBy: 'Kwame Mensah' },
    { id: 'PAY-2025-005', invoiceId: 'INV-2025-008', amount: 13570, method: 'bank_transfer', paymentDate: '2025-02-27', bankRef: 'GCB-TXN-20250227-004', recordedBy: 'Ama Boateng' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.invoice = this.allInvoices.find(i => i.id === id) ?? null;
    this.invoicePayments = this.allPayments.filter(p => p.invoiceId === id);
  }

  goBack(): void { this.router.navigate(['/finance/invoice-management']); }
  getBalance(): number { return this.invoice ? this.invoice.totalAmount - this.invoice.amountPaid : 0; }

  getStatusBg(status: string): string {
    const map: Record<string, string> = { draft: 'rgba(120,120,120,0.15)', sent: 'rgba(33,150,243,0.15)', paid: 'rgba(76,175,80,0.15)', overdue: 'rgba(244,67,54,0.15)', cancelled: 'rgba(158,158,158,0.12)' };
    return map[status] ?? '';
  }
  getStatusFg(status: string): string {
    const map: Record<string, string> = { draft: '#757575', sent: '#2196F3', paid: '#4CAF50', overdue: '#F44336', cancelled: '#9E9E9E' };
    return map[status] ?? '';
  }

  openRecordPayment(): void {
    if (!this.invoice) return;
    this.paymentForm = { amount: this.getBalance(), method: 'bank_transfer', paymentDate: new Date().toISOString().slice(0, 10), bankRef: '', notes: '' };
    this.modalService.open({
      title: `Record Payment – ${this.invoice.id}`,
      backdropClose: true, size: 'default', showCloseButton: true,
      content: this.recordPaymentModal,
    });
  }

  submitPayment(): void {
    if (!this.invoice) return;
    const pay: InvoicePaymentRecord = {
      id: `PAY-NEW-${Date.now()}`,
      invoiceId: this.invoice.id,
      amount: this.paymentForm.amount,
      method: this.paymentForm.method,
      paymentDate: this.paymentForm.paymentDate,
      bankRef: this.paymentForm.bankRef || undefined,
      recordedBy: 'Current User',
      notes: this.paymentForm.notes || undefined,
    };
    this.invoicePayments.push(pay);
    this.invoice.amountPaid += this.paymentForm.amount;
    if (this.invoice.amountPaid >= this.invoice.totalAmount) {
      this.invoice.status = 'paid';
      this.invoice.paidDate = this.paymentForm.paymentDate;
    }
    this.modalService.closeAll();
    this.toast.show({ title: 'Payment Recorded', description: `₵${this.paymentForm.amount.toLocaleString()} recorded successfully.`, variant: 'success' });
  }

  markAsSent(): void {
    if (!this.invoice) return;
    this.invoice.status = 'sent';
    this.invoice.sentDate = new Date().toISOString().slice(0, 10);
    this.toast.show({ title: 'Invoice Sent', description: `${this.invoice.id} marked as sent.`, variant: 'success' });
  }

  cancelInvoice(): void {
    if (!this.invoice) return;
    const ref = this.alertDialog.open({
      title: 'Cancel Invoice?',
      description: `Cancel invoice ${this.invoice.id}? This cannot be undone.`,
      actionText: 'Cancel Invoice', variant: 'destructive',
    });
    ref.afterClosed$.subscribe(confirmed => {
      if (!confirmed || !this.invoice) return;
      this.invoice.status = 'cancelled';
      this.toast.show({ title: 'Invoice Cancelled', description: `${this.invoice.id} has been cancelled.`, variant: 'destructive' });
    });
  }
}
