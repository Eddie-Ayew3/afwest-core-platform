import { Component, OnInit, inject, ViewChild, TemplateRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ButtonComponent, BadgeComponent, InputComponent, LabelComponent,
  SelectComponent, SelectItemComponent,
  BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbLinkComponent, BreadcrumbSeparatorComponent,
  ModalService, AlertDialogService, ToastService
} from '@tolle_/tolle-ui';
import { InvoiceActions } from '../stores/invoice.actions';
import { selectInvoices } from '../stores/invoice.selectors';
import { InvoiceDto } from '../models/invoice.model';

export type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'cash' | 'cheque';

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
  status: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  paidDate?: string;
  sentDate?: string;
  notes?: string;
}

export interface InvoicePaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: string;
  bankRef?: string;
  notes?: string;
  recordedAt: string;
}

/** Map backend InvoiceDto → local Invoice view model */
function toViewModel(dto: InvoiceDto): Invoice {
  return {
    id: dto.invoiceNumber,
    clientId: dto.clientId,
    clientName: dto.clientName,
    clientContact: '',
    issueDate: dto.issuedDate,
    dueDate: dto.dueDate,
    servicePeriod: dto.issuedDate ? new Date(dto.issuedDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '',
    status: dto.statusName.toLowerCase(),
    lineItems: dto.lineItems.map(li => ({
      id: li.id,
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      total: li.lineTotal,
    })),
    subtotal: dto.subTotal,
    taxRate: dto.totalAmount > 0 ? dto.taxAmount / dto.subTotal : 0,
    taxAmount: dto.taxAmount,
    totalAmount: dto.totalAmount,
    amountPaid: dto.statusName === 'Paid' ? dto.totalAmount : 0,
    paidDate: dto.paidAt,
    sentDate: dto.sentAt,
    notes: dto.notes,
  };
}

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
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  readonly modalService = inject(ModalService);
  private alertDialog = inject(AlertDialogService);
  private toast = inject(ToastService);

  @ViewChild('recordPaymentModal') recordPaymentModal!: TemplateRef<any>;

  invoice: Invoice | null = null;
  private invoiceId = '';
  invoicePayments: InvoicePaymentRecord[] = [];

  paymentForm = { amount: 0, method: 'bank_transfer' as PaymentMethod, paymentDate: '', bankRef: '', notes: '' };

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id') ?? '';

    this.store.dispatch(InvoiceActions.loadInvoices({ params: { pageNumber: 1, pageSize: 200 } }));

    this.store.select(selectInvoices)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(invoices => {
        const dto = invoices.find(i => i.id === this.invoiceId || i.invoiceNumber === this.invoiceId);
        this.invoice = dto ? toViewModel(dto) : null;
      });
  }

  goBack(): void { this.router.navigate(['/finance/invoice-management']); }

  getBalance(): number { return this.invoice ? this.invoice.totalAmount - this.invoice.amountPaid : 0; }

  getStatusBg(status: string): string {
    const map: Record<string, string> = {
      draft: 'rgba(120,120,120,0.15)', sent: 'rgba(33,150,243,0.15)',
      paid: 'rgba(76,175,80,0.15)', overdue: 'rgba(244,67,54,0.15)', cancelled: 'rgba(158,158,158,0.12)'
    };
    return map[status] ?? '';
  }

  getStatusFg(status: string): string {
    const map: Record<string, string> = {
      draft: '#757575', sent: '#2196F3', paid: '#4CAF50', overdue: '#F44336', cancelled: '#9E9E9E'
    };
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
    this.store.dispatch(InvoiceActions.payInvoice({ id: this.invoiceId }));
    this.modalService.closeAll();
    this.toast.show({ title: 'Payment Recorded', description: `₵${this.paymentForm.amount.toLocaleString()} recorded successfully.`, variant: 'success' });
  }

  markAsSent(): void {
    if (!this.invoice) return;
    this.store.dispatch(InvoiceActions.sendInvoice({ id: this.invoiceId }));
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
      this.store.dispatch(InvoiceActions.cancelInvoice({ id: this.invoiceId }));
      this.toast.show({ title: 'Invoice Cancelled', description: `${this.invoice.id} has been cancelled.`, variant: 'destructive' });
    });
  }
}
