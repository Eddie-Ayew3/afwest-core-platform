export type ShiftStatus = 'Scheduled' | 'Active' | 'Completed' | 'Cancelled' | 'Missed';
export type AttendanceMethod = 'Mobile' | 'Manual' | 'Web';

export interface ShiftAttendanceDto {
  id: string;
  checkInTime?: string;
  checkInWithinGeofence: boolean;
  checkInDistanceMeters?: number;
  checkInPhotoUrl?: string;
  checkInMethod: AttendanceMethod;
  checkInMethodName: string;
  checkOutTime?: string;
  checkOutWithinGeofence: boolean;
  checkOutDistanceMeters?: number;
  checkOutPhotoUrl?: string;
  checkOutMethod: AttendanceMethod;
  checkOutMethodName: string;
  markedBy?: string;
  notes?: string;
}

export interface ShiftDto {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  statusName: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  regionId: string;
  regionName: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  attendance?: ShiftAttendanceDto;
}

export interface CreateShiftDto {
  name: string;
  guardId: string;
  siteId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface UpdateShiftDto {
  name?: string;
  notes?: string;
  status?: ShiftStatus;
}

export interface ManualCheckInDto {
  guardId: string;
  checkInTime?: string;
  notes?: string;
}

export interface ManualCheckOutDto {
  guardId: string;
  checkOutTime?: string;
  notes?: string;
}

export interface ShiftListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: ShiftStatus | null;
  guardId?: string | null;
  siteId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}
