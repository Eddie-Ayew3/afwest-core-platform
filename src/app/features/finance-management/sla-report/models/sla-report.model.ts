export type SlaStatus = 'Compliant' | 'At Risk' | 'Breached';

export interface SlaRecordDto {
  id: string;
  client: string;
  clientId: string;
  site: string;
  siteId: string;
  period: string;
  guardHoursAgreed: number;
  guardHoursDelivered: number;
  incidentResponseTarget: number;
  incidentResponseAvg: number;
  patrolCompliancePct: number;
  slaScore: number;
  status: SlaStatus;
  notes: string;
}

export interface SlaListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: SlaStatus | null;
  clientId?: string | null;
  period?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
