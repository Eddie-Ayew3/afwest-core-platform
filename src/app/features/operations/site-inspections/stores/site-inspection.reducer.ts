import { createReducer, on } from '@ngrx/store';
import { SiteInspectionActions } from './site-inspection.actions';
import { SiteInspectionDto } from '../models/site-inspection.model';

export interface SiteInspectionState {
  inspections: SiteInspectionDto[];
  selectedInspection: SiteInspectionDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const initialSiteInspectionState: SiteInspectionState = {
  inspections: [],
  selectedInspection: null,
  loading: false,
  saving: false,
  error: null,
};

export const siteInspectionReducer = createReducer(
  initialSiteInspectionState,

  // Load Inspections
  on(SiteInspectionActions.loadInspections, state => ({ ...state, loading: true, error: null })),
  on(SiteInspectionActions.loadInspectionsSuccess, (state, { inspections }) => ({ ...state, loading: false, inspections })),
  on(SiteInspectionActions.loadInspectionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Create Inspection
  on(SiteInspectionActions.createInspection, state => ({ ...state, saving: true, error: null })),
  on(SiteInspectionActions.createInspectionSuccess, (state, { inspection }) => ({ ...state, saving: false, inspections: [...state.inspections, inspection] })),
  on(SiteInspectionActions.createInspectionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Update Inspection
  on(SiteInspectionActions.updateInspection, state => ({ ...state, saving: true, error: null })),
  on(SiteInspectionActions.updateInspectionSuccess, (state, { inspection }) => ({
    ...state,
    saving: false,
    inspections: state.inspections.map(i => i.id === inspection.id ? inspection : i),
  })),
  on(SiteInspectionActions.updateInspectionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Delete Inspection
  on(SiteInspectionActions.deleteInspection, state => ({ ...state, saving: true, error: null })),
  on(SiteInspectionActions.deleteInspectionSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    inspections: state.inspections.filter(i => i.id !== id),
  })),
  on(SiteInspectionActions.deleteInspectionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Start Inspection
  on(SiteInspectionActions.startInspection, state => ({ ...state, saving: true, error: null })),
  on(SiteInspectionActions.startInspectionSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    inspections: state.inspections.map(i => i.id === id ? { ...i, status: 'InProgress' } : i),
  })),
  on(SiteInspectionActions.startInspectionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Complete Inspection
  on(SiteInspectionActions.completeInspection, state => ({ ...state, saving: true, error: null })),
  on(SiteInspectionActions.completeInspectionSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    inspections: state.inspections.map(i => i.id === id ? { ...i, status: 'Completed', completedDate: new Date().toISOString() } : i),
  })),
  on(SiteInspectionActions.completeInspectionFailure, (state, { error }) => ({ ...state, saving: false, error })),

  // Cancel Inspection
  on(SiteInspectionActions.cancelInspection, state => ({ ...state, saving: true, error: null })),
  on(SiteInspectionActions.cancelInspectionSuccess, (state, { id }) => ({
    ...state,
    saving: false,
    inspections: state.inspections.map(i => i.id === id ? { ...i, status: 'Cancelled' } : i),
  })),
  on(SiteInspectionActions.cancelInspectionFailure, (state, { error }) => ({ ...state, saving: false, error })),
);
