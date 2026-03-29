import { createFeature, createSelector } from '@ngrx/store';
import { clientReducer } from './client.reducer';

export const clientFeatureKey = 'clients';

export const {
  selectClientsState,
  selectClients,
  selectSelectedClient,
  selectTotalRecords: selectClientTotalCount,
  selectLoading: selectClientLoading,
  selectSaving: selectClientSaving,
  selectError: selectClientError,
} = createFeature({ name: clientFeatureKey, reducer: clientReducer });

export const selectActiveClients = createSelector(selectClients, clients => clients.filter(c => c.status === 'Active'));
export const selectPendingClients = createSelector(selectClients, clients => clients.filter(c => c.status === 'Pending'));
