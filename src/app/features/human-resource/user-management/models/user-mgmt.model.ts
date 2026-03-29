export interface UserDto {
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
  roles: RoleAssignmentDto[];
}

export interface UserAccessDto {
  userId: string;
  fullName: string;
  email: string;
  staffId?: string;
  employeeId?: string;
  type: 'Staff' | 'Guard';
  isActive: boolean;
  primaryRole?: string;
  primaryRoleScope?: string;
}

export interface RoleAssignmentDto {
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

export interface ActivateUserDto {
  roleId: string;
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

export interface UserListParams {
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
