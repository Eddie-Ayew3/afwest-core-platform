export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Annual' | 'Sick' | 'Emergency' | 'Maternity' | 'Paternity' | 'Unpaid';

export interface LeaveRequestDto {
  id: string;
  guardId: string;
  guardName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface CreateLeaveRequestDto {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface ApproveLeaveDto {
  approved: boolean;
  rejectionReason?: string;
}

export interface LeaveBalanceDto {
  leaveType: LeaveType;
  year: number;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: LeaveStatus;
  guardId?: string;
}

export interface InitializeLeaveBalanceDto {
  year: number;
  balances: LeaveBalanceEntryDto[];
}

export interface LeaveBalanceEntryDto {
  leaveType: LeaveType;
  year: number;
  totalDays: number;
  usedDays?: number;
}
