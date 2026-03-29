export type PayrollStatus = 'Pending' | 'Processed' | 'Paid';

export interface PayrollRecordDto {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeStaffId: string;
  periodYear: number;
  periodMonth: number;
  periodLabel: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  statusName: string;
  status: number;
  notes?: string;
  processedAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface CreatePayrollRecordDto {
  employeeId: string;
  employeeName: string;
  employeeStaffId: string;
  periodYear: number;
  periodMonth: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  notes?: string;
}

export interface UpdatePayrollRecordDto {
  notes?: string;
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
}
