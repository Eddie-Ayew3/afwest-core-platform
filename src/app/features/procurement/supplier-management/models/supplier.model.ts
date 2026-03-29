export type SupplierStatus = 'Active' | 'Inactive' | 'Pending';
export type SupplierTier = 'Standard' | 'Premium';

export interface SupplierDto {
  id: string;
  supplierCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  status: SupplierStatus;
  tier: SupplierTier;
  activeContracts: number;
  rating: number;
  lastOrderDate: string;
  region: string;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  tier: SupplierTier;
  region: string;
}

export interface UpdateSupplierDto {
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  category?: string;
  tier?: SupplierTier;
  region?: string;
}

export interface SupplierListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: SupplierStatus | null;
  tier?: SupplierTier | null;
  category?: string | null;
  search?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
