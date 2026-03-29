import { createFeature, createSelector } from '@ngrx/store';
import { guardReducer } from './guard.reducer';

export const guardFeatureKey = 'guards';

export const {
  selectGuardsState,
  selectGuards,
  selectSelectedGuard,
  selectPerformance,
  selectTotalRecords: selectGuardTotalCount,
  selectLoading: selectGuardLoading,
  selectSaving: selectGuardSaving,
  selectError: selectGuardError,
} = createFeature({ name: guardFeatureKey, reducer: guardReducer });

export const selectActiveGuards = createSelector(selectGuards, guards => guards.filter(g => g.status === 'Active'));
export const selectPendingGuards = createSelector(selectGuards, guards => guards.filter(g => g.status === 'PendingApproval'));
