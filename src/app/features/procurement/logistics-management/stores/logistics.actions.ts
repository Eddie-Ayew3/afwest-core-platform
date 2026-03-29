import { createActionGroup, props } from '@ngrx/store';
import { ShipmentDto, CreateShipmentDto, UpdateShipmentStatusDto, ShipmentListParams } from '../models/logistics.model';

export const LogisticsActions = createActionGroup({
  source: 'Logistics',
  events: {
    'Load Shipments': props<{ params?: ShipmentListParams }>(),
    'Load Shipments Success': props<{ shipments: ShipmentDto[]; totalRecords: number }>(),
    'Load Shipments Failure': props<{ error: string }>(),

    'Load Shipment': props<{ id: string }>(),
    'Load Shipment Success': props<{ shipment: ShipmentDto }>(),
    'Load Shipment Failure': props<{ error: string }>(),

    'Create Shipment': props<{ dto: CreateShipmentDto }>(),
    'Create Shipment Success': props<{ shipment: ShipmentDto }>(),
    'Create Shipment Failure': props<{ error: string }>(),

    'Update Shipment Status': props<{ id: string; dto: UpdateShipmentStatusDto }>(),
    'Update Shipment Status Success': props<{ shipment: ShipmentDto }>(),
    'Update Shipment Status Failure': props<{ error: string }>(),

    'Delete Shipment': props<{ id: string }>(),
    'Delete Shipment Success': props<{ id: string }>(),
    'Delete Shipment Failure': props<{ error: string }>(),
  }
});
