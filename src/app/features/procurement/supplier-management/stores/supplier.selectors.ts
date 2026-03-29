import { createFeature, createSelector } from '@ngrx/store';
import { supplierReducer } from './supplier.reducer';

export const supplierFeatureKey = 'suppliers';

export const {
  selectSuppliersState,
  selectSuppliers,
  selectSelectedSupplier,
  selectTotalRecords: selectSupplierTotalCount,
  selectLoading: selectSupplierLoading,
  selectSaving: selectSupplierSaving,
  selectError: selectSupplierError,
} = createFeature({ name: supplierFeatureKey, reducer: supplierReducer });

export const selectActiveSuppliers = createSelector(selectSuppliers, suppliers => suppliers.filter(s => s.status === 'Active'));
export const selectPendingSuppliers = createSelector(selectSuppliers, suppliers => suppliers.filter(s => s.status === 'Pending'));
