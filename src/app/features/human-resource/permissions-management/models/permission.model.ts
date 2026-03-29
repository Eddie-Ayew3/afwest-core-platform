export interface PermissionDetailDto {
  id: string;
  name: string;
  code: string;
  description?: string;
  categoryId: string;
  categoryName: string;
}

export interface PermissionCategoryDto {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionDetailDto[];
}
