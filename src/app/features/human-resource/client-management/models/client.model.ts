export type ClientStatus = 'Pending' | 'Active' | 'Suspended' | 'Terminated';

export interface ClientRegionDto {
  regionId: string;
  regionName: string;
  regionCode?: string;
  assignedAt: string;
  isActive: boolean;
}

export interface ClientDto {
  id: string;
  name: string;
  tradeName?: string;
  registrationNumber?: string;
  tinNumber?: string;
  industry?: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
  status: ClientStatus;
  isActive: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
  regions?: ClientRegionDto[];
  siteCount?: number;
}

export interface CreateClientDto {
  name: string;
  tradeName?: string;
  registrationNumber?: string;
  tinNumber?: string;
  industry?: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  notes?: string;
}

export interface UpdateClientDto extends CreateClientDto {
  isActive?: boolean;
}

export interface ClientStatusActionDto {
  reason?: string;
}

export interface ClientListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: ClientStatus;
  isActive?: boolean;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
