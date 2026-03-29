export type IncidentSeverity = 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Open' | 'Investigating' | 'Resolved' | 'Closed';

export interface IncidentDto {
  id: string;
  type: string;
  site: string;
  siteId: string;
  region: string;
  reportedBy: string;
  reportedById: string;
  date: string;
  time: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateIncidentDto {
  type: string;
  siteId: string;
  severity: IncidentSeverity;
  date: string;
  time: string;
  reportedBy: string;
  description: string;
}

export interface UpdateIncidentStatusDto {
  status: IncidentStatus;
  notes?: string;
}

export interface IncidentListParams {
  pageNumber?: number;
  pageSize?: number;
  severity?: IncidentSeverity | null;
  status?: IncidentStatus | null;
  siteId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
