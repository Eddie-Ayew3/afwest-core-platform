export type TransactionType = 'Expense' | 'Replenishment';
export type TransactionStatus = 'Approved' | 'Pending' | 'Rejected';

export interface PettyCashDto {
  id: string;
  reference: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  submittedBy: string;
  approvedBy: string | null;
  status: TransactionStatus;
  receipted: boolean;
  site: string;
}

export interface CreatePettyCashDto {
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  site: string;
  date: string;
  notes?: string;
}

export interface ApprovePettyCashDto {
  notes?: string;
}

export interface PettyCashListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: TransactionStatus | null;
  type?: TransactionType | null;
  site?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
