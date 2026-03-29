export type GuardStatus = 'PendingApproval' | 'Active' | 'Rejected' | 'Suspended';

export interface GuardDto {
  id: string;
  userId: string;
  employeeId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  nationalId?: string;
  dateOfBirth?: string;
  hireDate?: string;
  guardLicense?: string;
  licenseExpiry?: string;
  status: GuardStatus;
  siteId?: string;
  siteName?: string;
  regionId?: string;
  regionName?: string;
  createdAt: string;
}

export interface CreateGuardDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  employeeId: string;
  nationalId?: string;
  dateOfBirth?: string;
  hireDate?: string;
  guardLicense?: string;
  licenseExpiry?: string;
}

export interface UpdateGuardDto {
  guardLicense?: string;
  licenseExpiry?: string;
  status?: GuardStatus;
}

export interface GuardAssignmentDto {
  id: string;
  guardId: string;
  siteId: string;
  siteName: string;
  regionId?: string;
  regionName?: string;
  assignedAt: string;
  endedAt?: string;
  endReason?: string;
  isActive: boolean;
}

export interface AssignGuardDto {
  siteId: string;
}

export interface TransferGuardDto {
  newSiteId: string;
  reason?: string;
  endReason?: string;
  notes?: string;
}

export type PerformanceGrade = 'Excellent' | 'Good' | 'Average' | 'Poor';

export interface GuardPerformanceDto {
  id: string;
  guardId: string;
  guardName: string;
  userId: string;
  fullName: string;
  employeeId: string;
  siteName?: string;
  regionName?: string;
  periodStart: string;
  periodEnd: string;
  totalShifts: number;
  completedShifts: number;
  cancelledShifts: number;
  missedShifts: number;
  absences: number;
  lateArrivals: number;
  onTimeArrivals: number;
  attendanceRate: number;
  patrolsCompleted: number;
  patrolsRequired: number;
  patrolCompliancePct: number;
  incidentsReported: number;
  incidentsResolved: number;
  incidentCount: number;
  clientRating: number;
  totalReviews: number;
  performanceScore: number;
  overallScore: number;
  grade: PerformanceGrade;
  disciplinaryActions: number;
  lastReviewDate: string | null;
  notes: string | null;
}

export interface SubmitPerformanceReviewDto {
  notes: string;
  disciplinaryActions: number;
}

export interface GuardStatusActionDto {
  reason?: string;
}

export interface EndAssignmentDto {
  endReason: string;
}

export interface GuardListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: GuardStatus;
  siteId?: string;
  regionId?: string;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
