export type PaymentMethod = 'bank_transfer' | 'cash' | 'mobile_money' | 'check';
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'overdue';

export interface PaymentDto {
  id: string;
  invoiceRef: string;
  clientId: string;
  clientName: string;
  servicePeriod: string;
  amountDue: number;
  amountPaid: number;
  method: PaymentMethod;
  status: PaymentStatus;
  dueDate: string;
  paymentDate: string;
  description: string;
  bankRef?: string;
}

export interface RecordPaymentDto {
  invoiceRef: string;
  clientId: string;
  amountPaid: number;
  method: PaymentMethod;
  paymentDate: string;
  bankRef?: string;
  description?: string;
}

export interface PaymentListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: PaymentStatus | null;
  clientId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
