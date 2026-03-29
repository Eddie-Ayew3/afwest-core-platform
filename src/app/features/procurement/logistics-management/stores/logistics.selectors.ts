import { createFeature, createSelector } from '@ngrx/store';
import { logisticsReducer } from './logistics.reducer';

export const logisticsFeatureKey = 'logistics';

export const {
  selectLogisticsState,
  selectShipments,
  selectSelectedShipment,
  selectTotalRecords: selectLogisticsTotalCount,
  selectLoading: selectLogisticsLoading,
  selectSaving: selectLogisticsSaving,
  selectError: selectLogisticsError,
} = createFeature({ name: logisticsFeatureKey, reducer: logisticsReducer });

export const selectInTransitShipments = createSelector(selectShipments, shipments => shipments.filter(s => s.status === 'In Transit'));
export const selectUrgentShipments = createSelector(selectShipments, shipments => shipments.filter(s => s.priority === 'Urgent'));
