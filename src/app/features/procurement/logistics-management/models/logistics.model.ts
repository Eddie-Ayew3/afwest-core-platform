export type ShipmentStatus = 'In Transit' | 'Delivered' | 'Pending' | 'Delayed' | 'Cancelled';
export type ShipmentPriority = 'Normal' | 'Urgent';

export interface ShipmentDto {
  id: string;
  trackingNo: string;
  description: string;
  origin: string;
  destination: string;
  carrier: string;
  driver: string;
  driverPhone: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  dispatchDate: string;
  eta: string;
  items: number;
  weight: string;
  notes?: string;
}

export interface CreateShipmentDto {
  description: string;
  origin: string;
  destination: string;
  carrier: string;
  driver: string;
  driverPhone: string;
  priority: ShipmentPriority;
  dispatchDate: string;
  eta: string;
  items: number;
  weight: string;
  notes?: string;
}

export interface UpdateShipmentStatusDto {
  status: ShipmentStatus;
  notes?: string;
}

export interface ShipmentListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: ShipmentStatus | null;
  priority?: ShipmentPriority | null;
  search?: string | null;
}

export interface PagedResult<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
