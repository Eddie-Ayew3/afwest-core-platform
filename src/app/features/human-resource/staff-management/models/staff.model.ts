export interface StaffDto {
  id: string;
  staffId?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles: StaffRoleDto[];
}

export interface StaffRoleDto {
  assignmentId: string;
  roleId: string;
  roleName: string;
  scopeLevel: string;
  siteId?: string;
  siteName?: string;
  regionId?: string;
  regionName?: string;
  isActing: boolean;
  actingEndDate?: string;
}

export interface CreateStaffDto {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  password: string;
  staffId?: string;
}

export interface UpdateStaffDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface StaffListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export interface UserAccessDto {
  id: string;
  staffId?: string;
  email: string;
  fullName: string;
  isActive: boolean;
  primaryRole?: string;
  createdAt: string;
}

export interface ActivateUserDto {
  email: string;
  password: string;
  primaryRoleId: string;
  siteId?: string;
  regionId?: string;
}

export interface AssignRoleDto {
  roleId: string;
  siteId?: string;
  regionId?: string;
  isActing?: boolean;
  actingEndDate?: string;
}
