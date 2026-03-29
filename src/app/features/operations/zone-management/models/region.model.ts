export interface RegionDto {
  id: string;
  name: string;
  code: string;
  capital?: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateRegionDto {
  name: string;
  code: string;
  capital?: string;
  description?: string;
}

export interface UpdateRegionDto {
  name?: string;
  code?: string;
  capital?: string;
  description?: string;
  isActive?: boolean;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export interface AssignUserToRegionDto {
  userId: string;
  roleId: string;
  isActing?: boolean;
  actingEndDate?: string;
}
