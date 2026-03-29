import { createReducer, on } from '@ngrx/store';
import { LogisticsActions } from './logistics.actions';
import { ShipmentDto } from '../models/logistics.model';

export interface LogisticsState {
  shipments: ShipmentDto[];
  selectedShipment: ShipmentDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialLogisticsState: LogisticsState = {
  shipments: [],
  selectedShipment: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const logisticsReducer = createReducer(
  initialLogisticsState,

  on(LogisticsActions.loadShipments, state => ({ ...state, loading: true, error: null })),
  on(LogisticsActions.loadShipmentsSuccess, (state, { shipments, totalRecords }) => ({ ...state, loading: false, shipments, totalRecords })),
  on(LogisticsActions.loadShipmentsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LogisticsActions.loadShipment, state => ({ ...state, loading: true })),
  on(LogisticsActions.loadShipmentSuccess, (state, { shipment }) => ({ ...state, loading: false, selectedShipment: shipment })),
  on(LogisticsActions.loadShipmentFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LogisticsActions.createShipment, state => ({ ...state, saving: true, error: null })),
  on(LogisticsActions.createShipmentSuccess, (state, { shipment }) => ({
    ...state, saving: false,
    shipments: [...state.shipments, shipment],
    totalRecords: state.totalRecords + 1,
  })),
  on(LogisticsActions.createShipmentFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(LogisticsActions.updateShipmentStatus, state => ({ ...state, saving: true, error: null })),
  on(LogisticsActions.updateShipmentStatusSuccess, (state, { shipment }) => ({
    ...state, saving: false,
    shipments: state.shipments.map(s => s.id === shipment.id ? shipment : s),
    selectedShipment: state.selectedShipment?.id === shipment.id ? shipment : state.selectedShipment,
  })),
  on(LogisticsActions.updateShipmentStatusFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(LogisticsActions.deleteShipment, state => ({ ...state, saving: true })),
  on(LogisticsActions.deleteShipmentSuccess, (state, { id }) => ({
    ...state, saving: false,
    shipments: state.shipments.filter(s => s.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(LogisticsActions.deleteShipmentFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
