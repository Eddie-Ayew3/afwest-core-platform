export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceLineItemDto {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceDto {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  issuedDate: string;
  dueDate: string;
  statusName: string;
  status: number;
  subTotal: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  lineItems: InvoiceLineItemDto[];
}

export interface CreateInvoiceLineItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceDto {
  clientId: string;
  dueDate: string;
  taxAmount: number;
  notes?: string;
  lineItems: CreateInvoiceLineItemDto[];
}

export interface UpdateInvoiceDto {
  notes?: string;
  lineItems?: CreateInvoiceLineItemDto[];
}
