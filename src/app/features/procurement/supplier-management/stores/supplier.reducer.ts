import { createReducer, on } from '@ngrx/store';
import { SupplierActions } from './supplier.actions';
import { SupplierDto } from '../models/supplier.model';

export interface SupplierState {
  suppliers: SupplierDto[];
  selectedSupplier: SupplierDto | null;
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialSupplierState: SupplierState = {
  suppliers: [],
  selectedSupplier: null,
  totalRecords: 0,
  loading: false,
  saving: false,
  error: null,
};

export const supplierReducer = createReducer(
  initialSupplierState,

  on(SupplierActions.loadSuppliers, state => ({ ...state, loading: true, error: null })),
  on(SupplierActions.loadSuppliersSuccess, (state, { suppliers, totalRecords }) => ({ ...state, loading: false, suppliers, totalRecords })),
  on(SupplierActions.loadSuppliersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(SupplierActions.loadSupplier, state => ({ ...state, loading: true })),
  on(SupplierActions.loadSupplierSuccess, (state, { supplier }) => ({ ...state, loading: false, selectedSupplier: supplier })),
  on(SupplierActions.loadSupplierFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(SupplierActions.createSupplier, state => ({ ...state, saving: true, error: null })),
  on(SupplierActions.createSupplierSuccess, (state, { supplier }) => ({
    ...state, saving: false,
    suppliers: [...state.suppliers, supplier],
    totalRecords: state.totalRecords + 1,
  })),
  on(SupplierActions.createSupplierFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(SupplierActions.updateSupplier, state => ({ ...state, saving: true, error: null })),
  on(SupplierActions.updateSupplierSuccess, (state, { supplier }) => ({
    ...state, saving: false,
    suppliers: state.suppliers.map(s => s.id === supplier.id ? supplier : s),
    selectedSupplier: state.selectedSupplier?.id === supplier.id ? supplier : state.selectedSupplier,
  })),
  on(SupplierActions.updateSupplierFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(SupplierActions.activateSupplier, state => ({ ...state, saving: true })),
  on(SupplierActions.activateSupplierSuccess, (state, { supplier }) => ({
    ...state, saving: false,
    suppliers: state.suppliers.map(s => s.id === supplier.id ? supplier : s),
  })),
  on(SupplierActions.activateSupplierFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(SupplierActions.deactivateSupplier, state => ({ ...state, saving: true })),
  on(SupplierActions.deactivateSupplierSuccess, (state, { supplier }) => ({
    ...state, saving: false,
    suppliers: state.suppliers.map(s => s.id === supplier.id ? supplier : s),
  })),
  on(SupplierActions.deactivateSupplierFailure, (state, { error }) => ({ ...state, saving: false, error })),

  on(SupplierActions.deleteSupplier, state => ({ ...state, saving: true })),
  on(SupplierActions.deleteSupplierSuccess, (state, { id }) => ({
    ...state, saving: false,
    suppliers: state.suppliers.filter(s => s.id !== id),
    totalRecords: state.totalRecords - 1,
  })),
  on(SupplierActions.deleteSupplierFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
