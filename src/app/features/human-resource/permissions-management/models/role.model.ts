export interface RoleDto {
  id: string;
  name: string;
  description?: string;
  scopeLevel: string;
  approvalLevel: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  permissions: string[]; // permission codes
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  scopeLevel: string;
  approvalLevel: string;
}

export interface UpdateRoleDto extends CreateRoleDto {
  isActive: boolean;
}

export interface SetRolePermissionsDto {
  permissionIds: string[];
}

export interface RoleListParams {
  pageNumber?: number;
  pageSize?: number;
  isActive?: boolean;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
