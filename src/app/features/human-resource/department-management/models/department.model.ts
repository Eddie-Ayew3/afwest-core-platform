export interface DepartmentDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}
